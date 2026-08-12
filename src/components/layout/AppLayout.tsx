import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, User, Clock, Home, LogOut } from 'lucide-react';

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token'); // Clear token if any
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f6fc] relative">
      
      {/* Top Header */}
      <header className="p-4 flex justify-between items-center sticky top-0 z-40 bg-[#f4f6fc]">
        <div className="flex items-center gap-4">
          <img src="/iiit-logo.png" alt="IIIT Hyderabad" className="h-10 object-contain" />
          <img src="/scrc-logo.png" alt="Smart City Research Center" className="h-10 object-contain" />
        </div>
        <button 
          onClick={toggleMenu}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Slide-out Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/20" onClick={() => setIsMenuOpen(false)}></div>
      )}
      
      {/* Slide-out Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-end">
          <button onClick={toggleMenu} className="p-2 text-gray-600"><X size={28} /></button>
        </div>
        <nav className="px-4 py-2 space-y-2">
          <button onClick={() => navigateTo('/home')} className="w-full text-left px-4 py-3 text-lg font-semibold text-gray-800 hover:bg-gray-100 rounded-lg flex items-center">
            <Home size={20} className="mr-3" /> Home
          </button>
          <button onClick={() => navigateTo('/history')} className="w-full text-left px-4 py-3 text-lg font-semibold text-gray-800 hover:bg-gray-100 rounded-lg flex items-center">
            <Clock size={20} className="mr-3" /> Charging History
          </button>
          <div className="border-t border-gray-100 my-2"></div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-lg font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center">
            <LogOut size={20} className="mr-3" /> Logout
          </button
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pb-8">
        <Outlet />
      </main>


    </div>
  );
}
