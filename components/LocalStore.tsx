import React, { useState } from 'react';
import { Store, OrderStatus, Product } from '../types';
import { ShoppingBag, ArrowLeft, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import { MOCK_STORES } from '../mockData';

export const LocalStore: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  // Mock Order State (In a real app, this would be per-order data)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.NEW);
  const [showOrderSheet, setShowOrderSheet] = useState(false);

  // Store Detail View
  if (selectedStore) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header Image */}
        <div className="h-40 w-full relative">
          <img src={selectedStore.imageUrl} className="w-full h-full object-cover" alt={selectedStore.name} />
          <button onClick={() => setSelectedStore(null)} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full hover:bg-white transition">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Store Info */}
        <div className="bg-white px-5 py-6 -mt-6 rounded-t-3xl shadow-sm z-10 flex flex-col flex-1">
          <div className="mb-6">
             <div className="flex justify-between items-start">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStore.name}</h2>
                  <p className="text-gray-500 text-sm">by {selectedStore.ownerName} • Unit {selectedStore.unit}</p>
               </div>
               <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase">{selectedStore.category}</span>
             </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-4 text-lg">Menu / Products</h3>
          <div className="space-y-4 pb-20 overflow-y-auto no-scrollbar">
            {selectedStore.products.map(product => (
              <div key={product.id} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                <img src={product.imageUrl} className="w-20 h-20 rounded-lg object-cover bg-gray-100" alt={product.name} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                  <p className="text-gray-500 text-xs mt-1">Freshly prepared</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-900">₹{product.price}</span>
                    <button 
                      onClick={() => setShowOrderSheet(true)}
                      className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium active:scale-95 transition"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Management Sheet (Mock for Seller view perspective) */}
        {showOrderSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg">Manage Order #1234</h3>
                   <button onClick={() => setShowOrderSheet(false)} className="text-gray-400 hover:text-gray-600">Close</button>
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Item</span>
                     <span className="font-medium">Chocolate Truffle Cake</span>
                   </div>
                   <div className="flex justify-between text-sm border-b border-gray-100 pb-4">
                     <span className="text-gray-500">Total</span>
                     <span className="font-bold text-lg">₹800</span>
                   </div>

                   <div className="pt-2">
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Update Status</label>
                      <div className="flex flex-col gap-2">
                         {[OrderStatus.NEW, OrderStatus.IN_PROGRESS, OrderStatus.READY].map((status) => (
                           <button
                             key={status}
                             onClick={() => setOrderStatus(status)}
                             className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                               orderStatus === status 
                               ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                               : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                             }`}
                           >
                             <div className="flex items-center gap-3">
                               {status === OrderStatus.NEW && <Clock className="w-4 h-4" />}
                               {status === OrderStatus.IN_PROGRESS && <ShoppingBag className="w-4 h-4" />}
                               {status === OrderStatus.READY && <CheckCircle className="w-4 h-4" />}
                               <span className="text-sm font-medium">{status}</span>
                             </div>
                             {orderStatus === status && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // Store List View
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 py-5 bg-white border-b border-gray-100 sticky top-0 z-10">
         <h1 className="text-2xl font-bold text-gray-900">Local Store</h1>
         <p className="text-sm text-gray-500 mt-1">Support your neighbors' businesses</p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto">
         {MOCK_STORES.map(store => (
           <div 
             key={store.id} 
             onClick={() => setSelectedStore(store)}
             className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col active:scale-[0.98] transition-transform cursor-pointer"
           >
              <div className="h-32 w-full bg-gray-200 relative">
                 <img src={store.imageUrl} className="w-full h-full object-cover" alt={store.name} />
                 <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-gray-800">
                    {store.unit}
                 </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                 <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{store.name}</h3>
                 <p className="text-xs text-gray-500 mb-2">{store.category}</p>
                 <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">{store.products.length} Products</span>
                    <ArrowLeft className="w-3 h-3 text-gray-400 rotate-180" />
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
