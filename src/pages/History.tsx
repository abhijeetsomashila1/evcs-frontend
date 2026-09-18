import { Clock, Zap, CheckCircle2, Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function History() {
  // Fetch actual data from the PostgreSQL database
  const { data: historyData, isLoading, isError } = useQuery({
    queryKey: ['history', 1],
    queryFn: () => api.getHistory(1) // Using user_id=1 as the default logged-in user
  });

  // Helper to format PostgreSQL timestamps into human-readable dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const d = new Date(dateString);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };



  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 w-full">
      <div className="w-full max-w-sm mt-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Clock className="mr-3 text-[#007b33]" size={32} />
          Charging History
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Your recent charging sessions and energy usage.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading database history...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center text-red-500 bg-red-50 p-4 rounded-xl">
            <AlertCircle className="mr-2" />
            <p className="text-sm font-semibold">Failed to load history from database</p>
          </div>
        )}

        {/* Empty State */}
        {historyData?.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">No charging sessions yet.</p>
          </div>
        )}

        {/* Success Data Rendering */}
        {historyData?.map((session: any, idx: number) => (
          <div 
            key={session.session_id}
            className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
            style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both` }}
          >
            {/* Subtle left border color accent */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${session.status === 'Completed' ? 'bg-[#007b33]' : 'bg-yellow-500'}`}></div>

            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SESSION-{session.session_id}</span>
                <div className="flex items-center text-sm font-bold text-gray-800">
                  <Calendar size={14} className="mr-1.5 text-gray-400" />
                  {formatDate(session.start_time)}
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full flex items-center text-xs font-bold ${session.status === 'Completed' ? 'bg-[#e6f4ea] text-[#007b33]' : 'bg-yellow-100 text-yellow-700'}`}>
                <CheckCircle2 size={12} className="mr-1" />
                {session.status}
              </div>
            </div>

            <div className="flex items-center text-xs font-medium text-gray-500 mb-4">
              <MapPin size={12} className="mr-1" />
              SCRC IIIT-H — {session.charger_id}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-3">
              <div className="flex flex-col items-center text-center border-r border-gray-200">
                <Zap size={14} className="text-yellow-500 mb-1" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase">Target Units</span>
                <span className="text-sm font-bold text-gray-800">{session.amount ? `${session.amount} u` : 'N/A'}</span>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <Clock size={14} className="text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase">Total Time</span>
                <span className="text-sm font-bold text-gray-800">
                  {session.amount ? (() => {
                    const totalMins = Math.round(Number(session.amount) * 12);
                    const hrs = Math.floor(totalMins / 60);
                    const mins = totalMins % 60;
                    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
                  })() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
