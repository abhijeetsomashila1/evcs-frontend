import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { Activity, List, LogOut, ChevronRight } from 'lucide-react';

export default function Settings() {
  const { currentUser } = useUserStore();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Live Monitoring', icon: Activity, path: '/monitoring', color: 'text-blue-500' },
    { title: 'Event Logs', icon: List, path: '/logs', color: 'text-green-500' },
  ];

  return (
    <div className="p-4 pt-8 h-full bg-gray-50">
      <h1 className="text-2xl font-bold text-textMain mb-6">Settings</h1>
      
      {currentUser && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-textMain">{currentUser.name}</h2>
            <p className="text-textMuted">{currentUser.email}</p>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-95 transition-transform"
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-4 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-semibold text-textMain">{item.title}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}
      </div>

      <button className="w-full py-4 bg-white text-danger font-bold rounded-2xl shadow-sm border border-red-100 flex items-center justify-center active:scale-95 transition-transform mt-auto">
        <LogOut size={20} className="mr-2" />
        Log Out
      </button>
    </div>
  );
}
