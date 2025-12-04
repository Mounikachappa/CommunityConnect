import React, { useState } from 'react';
import { Vendor } from '../types';
import { Search, Star, Phone, ShieldCheck, MapPin, ArrowLeft, Plus, User } from 'lucide-react';
import { MOCK_VENDORS } from '../mockData';

export const Directory: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = MOCK_VENDORS.filter(v => 
    (filter === 'All' || v.category === filter) &&
    (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add Vendor Screen
  if (isAdding) {
    return (
      <div className="bg-white h-full flex flex-col">
        <div className="border-b p-4 flex items-center gap-3">
          <button onClick={() => setIsAdding(false)}><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
          <h2 className="text-lg font-bold">Add New Vendor</h2>
        </div>
        <form className="p-6 space-y-6 flex-1" onSubmit={(e) => { e.preventDefault(); setIsAdding(false); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
            <input type="text" required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Joe's Electricals" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none">
              <option>Plumber</option>
              <option>Electrician</option>
              <option>Maid Agency</option>
              <option>Carpenter</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
            <input type="tel" required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="+91 99999 99999" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200">Submit for Verification</button>
        </form>
      </div>
    )
  }

  // Vendor Detail Screen
  if (selectedVendor) {
    return (
       <div className="flex flex-col h-full bg-white">
         <div className="relative h-48 w-full">
            <img src={selectedVendor.imageUrl} className="w-full h-full object-cover" alt="Vendor" />
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
              <button onClick={() => setSelectedVendor(null)} className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
         </div>
         
         <div className="px-5 py-4 -mt-6 bg-white rounded-t-3xl flex-1 overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedVendor.name}</h2>
                  <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{selectedVendor.category}</span>
               </div>
               <div className="flex flex-col items-center bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                  <div className="flex items-center gap-1 text-green-700 font-bold text-lg">
                    <span className="text-lg">{selectedVendor.rating}</span>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-[10px] text-green-600 uppercase font-semibold">{selectedVendor.reviewCount} Reviews</span>
               </div>
            </div>

            {/* Core Stats */}
            <div className="flex gap-4 my-6">
               <div className="flex-1 bg-indigo-50 p-3 rounded-xl flex items-center gap-3 border border-indigo-100">
                  <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs text-indigo-400 font-semibold uppercase">Verified by</p>
                     <p className="font-bold text-indigo-900">Community</p>
                  </div>
               </div>
               <div className="flex-1 bg-orange-50 p-3 rounded-xl flex items-center gap-3 border border-orange-100">
                  <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs text-orange-400 font-semibold uppercase">Used By</p>
                     <p className="font-bold text-orange-900">{selectedVendor.usedByCount} Residents</p>
                  </div>
               </div>
            </div>

            <a href={`tel:${selectedVendor.contact}`} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold mb-8 shadow-lg">
               <Phone className="w-5 h-5" />
               Call {selectedVendor.contact}
            </a>

            {/* Reviews */}
            <h3 className="font-bold text-lg mb-4">Resident Reviews</h3>
            <div className="space-y-4 pb-8">
               {selectedVendor.reviews.map(review => (
                 <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-semibold text-gray-800">{review.author} <span className="text-gray-400 text-xs font-normal">(Unit {review.unit})</span></span>
                       <div className="flex text-amber-400">
                         {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />)}
                       </div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                 </div>
               ))}
            </div>
         </div>
       </div>
    );
  }

  // Vendor List View
  return (
    <div className="flex flex-col h-full bg-gray-50">
       <div className="bg-primary px-4 pt-12 pb-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
          <div className="flex justify-between items-center mb-4">
             <h1 className="text-2xl font-bold text-white">Directory</h1>
             <button onClick={() => setIsAdding(true)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
               <Plus className="w-6 h-6" />
             </button>
          </div>
          
          <div className="relative mb-4">
             <Search className="absolute left-3 top-3 text-white/60 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search plumbers, electricians..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 backdrop-blur-md" 
             />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
             {['All', 'Plumber', 'Electrician', 'Maid Agency'].map(cat => (
               <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === cat ? 'bg-white text-primary' : 'bg-primary-700/50 text-white/80 border border-white/10'
                }`}
               >
                 {cat}
               </button>
             ))}
          </div>
       </div>

       <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {filteredVendors.map(vendor => (
            <div key={vendor.id} onClick={() => setSelectedVendor(vendor)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow">
               <img src={vendor.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt={vendor.name} />
               <div className="flex-1">
                 <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                 <p className="text-xs text-gray-500 mb-1">{vendor.category}</p>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                     <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                     {vendor.rating}
                   </div>
                   <span className="text-[10px] text-gray-400">Used by {vendor.usedByCount}+</span>
                 </div>
               </div>
               <div className="bg-gray-50 p-2 rounded-full">
                 <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};
