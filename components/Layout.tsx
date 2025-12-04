import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, ShoppingBag } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100 shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-white">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-2 pb-safe flex justify-between items-center z-20 sticky bottom-0">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-medium">The Hub</span>
        </NavLink>
        
        <NavLink 
          to="/directory" 
          className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Users className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-medium">Directory</span>
        </NavLink>
        
        <NavLink 
          to="/store" 
          className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <ShoppingBag className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-medium">Store</span>
        </NavLink>
      </nav>
    </div>
  );
};