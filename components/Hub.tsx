import React, { useState, useEffect, useRef } from 'react';
import { Thread, ThreadType, ThreadStatus, Vendor } from '../types';
import { MessageSquare, ArrowLeft, Send, Sparkles, Search, X, TrendingUp, Users, Clock, AlertTriangle, CheckCircle2, Plus, Loader2, ArrowRight } from 'lucide-react';
import { summarizeThread, searchCommunity, findSimilarThreads, SearchResult } from '../services/geminiService';
import { MOCK_THREADS, MOCK_VENDORS } from '../mockData';

export const Hub: React.FC = () => {
  // Global Data State
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);

  // View States
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [filterType, setFilterType] = useState<ThreadType | 'All'>('All');
  
  // Detail View AI State
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Create Thread State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'INPUT' | 'CHECKING' | 'DUPLICATES'>('INPUT');
  const [newThreadData, setNewThreadData] = useState({ title: '', content: '', type: ThreadType.GENERAL });
  const [similarThreads, setSimilarThreads] = useState<Thread[]>([]);

  // Auto-scroll to bottom of chat when opening a thread
  useEffect(() => {
    if (selectedThread && scrollRef.current) {
      scrollRef.current.scrollTop = 0; // Start at top to see summary/OP
    }
  }, [selectedThread]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);
    setShowSearch(true);
    
    const result = await searchCommunity(searchQuery, threads, MOCK_VENDORS);
    setSearchResult(result);
    setIsSearching(false);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResult(null);
  };

  const handleOpenThread = async (thread: Thread) => {
    setSelectedThread(thread);
    // Simulate "Live" summary generation on open
    setIsSummarizing(true);
    try {
        // Try to get real AI summary if key exists, else fallback to mock in UI
        const result = await summarizeThread(thread.title, thread.content, thread.comments);
        setSummary(result);
    } catch (e) {
        setSummary(null); 
    }
    setIsSummarizing(false);
  };

  const handleCreateCheck = async () => {
    if (!newThreadData.title.trim() || !newThreadData.content.trim()) return;

    setCreateStep('CHECKING');
    try {
        const similarIds = await findSimilarThreads(newThreadData.title, newThreadData.content, threads);
        
        if (similarIds.length > 0) {
            const matches = threads.filter(t => similarIds.includes(t.id));
            if (matches.length > 0) {
                setSimilarThreads(matches);
                setCreateStep('DUPLICATES');
                return;
            }
        }
        // If no duplicates, go straight to creation
        finalizeCreateThread();
    } catch (error) {
        console.error("Error checking duplicates", error);
        finalizeCreateThread();
    }
  };

  const finalizeCreateThread = () => {
    const newThread: Thread = {
        id: Date.now().toString(),
        title: newThreadData.title,
        content: newThreadData.content,
        type: newThreadData.type,
        author: 'You',
        unit: 'A-101', // Mock current user
        status: ThreadStatus.OPEN,
        timestamp: 'Just now',
        comments: []
    };

    setThreads([newThread, ...threads]);
    setShowCreateModal(false);
    setNewThreadData({ title: '', content: '', type: ThreadType.GENERAL });
    setCreateStep('INPUT');
    setSimilarThreads([]);
    
    // Optional: Open the new thread immediately
    setSelectedThread(newThread);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateStep('INPUT');
    setNewThreadData({ title: '', content: '', type: ThreadType.GENERAL });
  };

  // --- Create Thread Modal ---
  const renderCreateModal = () => {
    if (!showCreateModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">
                        {createStep === 'DUPLICATES' ? 'Wait! Similar Topics Found' : 'Start New Discussion'}
                    </h3>
                    <button onClick={closeCreateModal} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto">
                    {createStep === 'CHECKING' && (
                        <div className="py-12 flex flex-col items-center text-center">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-600 font-medium">Checking for existing discussions...</p>
                            <p className="text-xs text-slate-400 mt-2">Our AI is ensuring we don't duplicate topics.</p>
                        </div>
                    )}

                    {createStep === 'INPUT' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Topic Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {[ThreadType.GENERAL, ThreadType.RWA_ISSUE, ThreadType.LOST_FOUND, ThreadType.EVENT].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewThreadData({ ...newThreadData, type })}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                                newThreadData.type === type 
                                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                                    placeholder="What's on your mind?"
                                    value={newThreadData.title}
                                    onChange={e => setNewThreadData({...newThreadData, title: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Details</label>
                                <textarea 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[120px] text-sm text-slate-800"
                                    placeholder="Provide more context..."
                                    value={newThreadData.content}
                                    onChange={e => setNewThreadData({...newThreadData, content: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {createStep === 'DUPLICATES' && (
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 items-start">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-800">
                                    We found some existing discussions that look similar to yours. Joining them might get you a faster answer!
                                </p>
                            </div>

                            <div className="space-y-2">
                                {similarThreads.map(thread => (
                                    <div key={thread.id} className="border border-slate-200 rounded-xl p-3 hover:bg-slate-50 transition-colors">
                                        <h4 className="font-semibold text-slate-900 text-sm mb-1">{thread.title}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{thread.content}</p>
                                        <button 
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                handleOpenThread(thread);
                                            }}
                                            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                                        >
                                            View this discussion <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                {createStep !== 'CHECKING' && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button 
                            onClick={closeCreateModal}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                        >
                            Cancel
                        </button>
                        
                        {createStep === 'INPUT' ? (
                            <button 
                                onClick={handleCreateCheck}
                                disabled={!newThreadData.title || !newThreadData.content}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={finalizeCreateThread}
                                className="px-5 py-2 bg-white border-2 border-indigo-600 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50"
                            >
                                Post Anyway
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
  };

  // --- Detail View (Chat Style) ---
  if (selectedThread) {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
        {/* Chat Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center shadow-sm justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <button onClick={() => { setSelectedThread(null); setSummary(null); }} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col overflow-hidden">
              <h2 className="text-base font-bold text-slate-900 truncate leading-tight">{selectedThread.title}</h2>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                {selectedThread.comments.length} participants • {selectedThread.status}
              </span>
            </div>
          </div>
          <button className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100">
            <Users className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
          
          {/* Original Post (OP) - Styled as the context starter */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                   {selectedThread.author[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedThread.author}</div>
                  <div className="text-[10px] text-slate-400">Unit {selectedThread.unit} • {selectedThread.timestamp}</div>
                </div>
                <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedThread.type === ThreadType.RWA_ISSUE ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                    {selectedThread.type}
                </span>
             </div>
             <p className="text-slate-800 text-sm leading-relaxed">
                {selectedThread.content}
             </p>
             {selectedThread.poll && (
                <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                   <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1">
                     <CheckCircle2 className="w-3 h-3" /> Live Poll
                   </h4>
                   <div className="font-semibold text-sm mb-2">{selectedThread.poll.question}</div>
                   <div className="space-y-2">
                      {selectedThread.poll.options.map((opt, i) => (
                        <div key={i} className="relative h-8 bg-slate-200 rounded-lg overflow-hidden">
                           <div className="absolute top-0 left-0 h-full bg-indigo-200" style={{ width: `${(opt.votes/selectedThread.poll!.totalVotes)*100}%` }}></div>
                           <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium text-slate-700">
                              <span>{opt.label}</span>
                              <span>{Math.round((opt.votes/selectedThread.poll!.totalVotes)*100)}%</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             )}
          </div>

          {/* AI Summary Block (System Message) */}
          <div className="relative">
             <div className="absolute inset-0 flex items-center" aria-hidden="true">
               <div className="w-full border-t border-indigo-100"></div>
             </div>
             <div className="relative flex justify-center">
               <span className="bg-slate-50 px-2 text-xs text-slate-400 uppercase tracking-wider">Discussion Context</span>
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 shadow-sm relative overflow-hidden">
             {/* "Live" Indicator Badge */}
             <div className="absolute top-0 right-0 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-bl-xl border-l border-b border-indigo-50 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-[10px] font-bold text-indigo-700">
                   Updates in 4 msgs
                </span>
             </div>

             <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600 mt-1">
                   <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-indigo-900 text-sm mb-1">Live Topic Summary</h3>
                   {isSummarizing ? (
                      <div className="text-xs text-indigo-400 animate-pulse">Analyzing conversation stream...</div>
                   ) : (
                      <div className="text-sm text-indigo-800 leading-relaxed prose prose-sm">
                         {summary && !summary.includes("API Key") ? (
                            <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                         ) : (
                            // Mock Summary Fallback if API key missing or just for UI demo
                            <ul className="list-disc list-outside ml-4 space-y-1">
                               <li>Residents are reporting consistent issues with {selectedThread.type.toLowerCase()}.</li>
                               <li><b>Consensus:</b> Immediate action required by the management committee.</li>
                               <li><b>Next Step:</b> Security team to review logs by 5 PM.</li>
                            </ul>
                         )}
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Comment Stream */}
          <div className="space-y-4 pb-4">
             {selectedThread.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 animate-slide-up">
                   <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full bg-gray-200 object-cover mt-1" />
                   <div className="flex-col flex max-w-[85%]">
                      <div className="flex items-baseline gap-2 mb-1 pl-1">
                         <span className="text-xs font-bold text-slate-700">{comment.author}</span>
                         <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700">
                         {comment.content}
                      </div>
                   </div>
                </div>
             ))}
          </div>

        </div>

        {/* Sticky Input */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-3 pb-safe">
           <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
             <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-sm placeholder-slate-400 text-slate-800" />
             <button className="text-indigo-600 font-semibold p-1.5 hover:bg-indigo-50 rounded-full transition-colors">
               <Send className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    );
  }

  // --- Home Screen View (The Hub) ---
  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
             {isSearching ? <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"/> : <Sparkles className="h-4 w-4 text-indigo-500" />}
          </div>
          <input 
            type="text" 
            placeholder="Search discussions & directory..." 
            className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
               <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                 <X className="h-4 w-4" />
               </button>
            </div>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* Search Overlay */}
        {showSearch ? (
           <div className="p-4 min-h-[50vh]">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-slate-800">Results</h2>
                 <button onClick={closeSearch} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">Close</button>
              </div>
              
              {searchResult ? (
                 <div className="space-y-4 animate-fade-in">
                    <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-200">
                       <div className="flex items-center gap-2 mb-3 opacity-90">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">AI Answer</span>
                       </div>
                       <p className="text-sm leading-relaxed font-medium">{searchResult.answer}</p>
                    </div>

                    {searchResult.relevantThreadIds.length > 0 && (
                       <div>
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Related Discussions</h3>
                          {searchResult.relevantThreadIds.map(tid => {
                             const t = threads.find(th => th.id === tid);
                             if(!t) return null;
                             return (
                                <div key={tid} onClick={() => handleOpenThread(t)} className="bg-white p-3 mb-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 active:scale-95 transition-transform">
                                   <div className="bg-slate-100 p-2 rounded-lg"><MessageSquare className="w-4 h-4 text-slate-500" /></div>
                                   <div className="flex-1">
                                      <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                                      <div className="text-xs text-slate-500 line-clamp-1">{t.content}</div>
                                   </div>
                                </div>
                             )
                          })}
                       </div>
                    )}
                 </div>
              ) : (
                 <div className="text-center py-12 text-slate-400 text-sm">Type to search...</div>
              )}
           </div>
        ) : (
          /* Main Hub Dashboard */
          <>
            {/* Hot Topics Grid */}
            <div className="p-4 pb-2">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   Hot Topics
                   <TrendingUp className="w-5 h-5 text-red-500" />
                 </h2>
                 <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold uppercase animate-pulse">Live</span>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 {threads.slice(0, 6).map((thread) => {
                    const isUrgent = thread.type === ThreadType.RWA_ISSUE;
                    return (
                      <button 
                        key={thread.id} 
                        onClick={() => handleOpenThread(thread)}
                        className={`relative p-3.5 h-36 rounded-2xl border text-left flex flex-col justify-between shadow-sm hover:shadow-md transition-all active:scale-95 group overflow-hidden ${
                          isUrgent ? 'bg-white border-red-100' : 'bg-white border-slate-200'
                        }`}
                      >
                         {/* Decorative Background Icon */}
                         <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            {isUrgent ? <AlertTriangle className="w-24 h-24" /> : <MessageSquare className="w-24 h-24" />}
                         </div>

                         <div className="relative z-10">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                               isUrgent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {isUrgent ? 'Alert' : thread.type === ThreadType.LOST_FOUND ? 'Help' : 'Topic'}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-3">
                               {thread.title}
                            </h3>
                         </div>
                         
                         <div className="relative z-10 flex items-center justify-between mt-2 pt-2 border-t border-slate-50/50">
                            <div className="flex items-center gap-1 text-slate-400">
                               <MessageSquare className="w-3 h-3" />
                               <span className="text-xs font-medium">{thread.comments.length}</span>
                            </div>
                            <div className="flex -space-x-1.5">
                               {thread.comments.slice(0, 3).map((c, i) => (
                                  <div key={c.id} className="w-5 h-5 rounded-full border border-white bg-slate-200 overflow-hidden">
                                     <img src={c.avatar} className="w-full h-full object-cover" />
                                  </div>
                               ))}
                               {thread.comments.length > 3 && (
                                  <div className="w-5 h-5 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                     +{thread.comments.length - 3}
                                  </div>
                               )}
                            </div>
                         </div>
                      </button>
                    );
                 })}
               </div>
            </div>

            {/* Recent List */}
            <div className="p-4 pt-2">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Recent Activity</h3>
               <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                  {threads.slice(2).map(thread => (
                     <div key={thread.id} onClick={() => handleOpenThread(thread)} className="p-4 flex gap-3 active:bg-slate-50 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                           thread.type === ThreadType.RWA_ISSUE ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'
                        }`}>
                           {thread.type === ThreadType.RWA_ISSUE ? <AlertTriangle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-0.5">
                              <h4 className="font-semibold text-slate-900 text-sm truncate pr-2">{thread.title}</h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{thread.timestamp}</span>
                           </div>
                           <p className="text-xs text-slate-500 line-clamp-1 mb-1.5">{thread.content}</p>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{thread.type}</span>
                              {thread.poll && <span className="text-[10px] text-indigo-500 font-medium flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Poll</span>}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </>
        )}
      </div>
      
      {/* Floating Action Button (FAB) */}
      {!showSearch && (
        <button 
            onClick={() => setShowCreateModal(true)}
            className="absolute bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-300 hover:bg-indigo-700 active:scale-95 transition-all z-20 flex items-center gap-2"
        >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-bold pr-1">New</span>
        </button>
      )}

      {/* Render Create Thread Modal */}
      {renderCreateModal()}
    </div>
  );
};