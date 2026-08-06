import { useState, useEffect } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useChargerStore } from '../stores/useChargerStore';

export default function Home() {
  const [amount, setAmount] = useState<string>('0.0');
  const [progress, setProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const { currentSessionId, setCurrentSession, sessionStartTime, chargingAmount } = useChargerStore();
  const isCharging = currentSessionId !== null;

  // Estimate charging time: 1 unit = 12 minutes
  const minsPerUnit = 12; 
  
  // Calculate for the preview (before starting)
  const numAmount = parseFloat(amount) || 0;
  const totalMinsPreview = Math.round(numAmount * minsPerUnit);
  const hoursPreview = Math.floor(totalMinsPreview / 60);
  const minsPreview = totalMinsPreview % 60;
  const timeStringPreview = hoursPreview > 0 ? `${hoursPreview}h ${minsPreview}m` : `${minsPreview} min`;

  // Progress Bar Logic (Real-time sync with backend)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isCharging && sessionStartTime && chargingAmount) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/pzem/latest');
          if (res.ok) {
            const data = await res.json();
            const currentUnits = (data.energy_Wh || 0) / 1000.0;
            
            // Calculate Percentage based on actual energy
            let percent = (currentUnits / chargingAmount) * 100;
            if (percent > 100) percent = 100;
            setProgress(percent);

            // Estimate Time Remaining
            const totalSeconds = chargingAmount * minsPerUnit * 60;
            const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
            
            if (percent >= 100) {
              setTimeRemaining(`0s remaining`);
            } else {
              const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);
              const rHours = Math.floor(remainingSeconds / 3600);
              const rMins = Math.floor((remainingSeconds % 3600) / 60);
              const rSecs = remainingSeconds % 60;
              
              if (rHours > 0) {
                setTimeRemaining(`${rHours}h ${rMins}m remaining`);
              } else if (rMins > 0) {
                setTimeRemaining(`${rMins}m ${rSecs}s remaining`);
              } else {
                setTimeRemaining(`${rSecs}s remaining`);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch latest energy:", err);
        }
      }, 1000);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [isCharging, sessionStartTime, chargingAmount]);


  const startMutation = useMutation({
    mutationFn: async () => {
      const userId = Number(localStorage.getItem('user_id')) || 1;
      if (numAmount <= 0) throw new Error("Please enter a valid amount");
      return api.startCharging(userId, 'EV001', numAmount);
    },
    onSuccess: (data) => {
      setCurrentSession(data.session_id, Date.now(), numAmount);
      toast.success('Charging Started');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start charging');
    }
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      if (!currentSessionId) throw new Error("No active session");
      return api.stopCharging(currentSessionId);
    },
    onSuccess: () => {
      setCurrentSession(null);
      toast.success('Charging Stopped');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to stop charging');
    }
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-sm border border-gray-100 p-8 pt-8">
        
        {/* Charger ID Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#f0f4ff] border border-[#d6e2ff] text-[#3b5b8d] px-8 py-3 rounded-full text-lg font-extrabold tracking-widest uppercase shadow-sm">
            EV001
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
            {isCharging ? (
              <>Charging<br/>in Progress</>
            ) : (
              <>Start<br/>Charging</>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-4 px-2">
            {isCharging 
              ? "Energy is currently flowing to your vehicle." 
              : "Select the amount of energy you'd like to dispense to your vehicle."}
          </p>
        </div>

        {!isCharging ? (
          <>
            {/* Input Section (Hidden while charging) */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                Enter Amount (units)
              </label>
              <div className="bg-gray-100 rounded-2xl flex items-center p-4 relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-4xl font-bold text-gray-600 w-full outline-none"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                />
                <span className="text-gray-400 font-semibold absolute right-6">units</span>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50 rounded-2xl p-4 flex justify-center items-center mb-6 text-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Est. Charging Time</p>
                <p className="text-lg font-bold text-[#147b3d]">~{timeStringPreview}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Progress Bar Section (Shown while charging) */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-sm font-bold text-gray-700">{progress >= 100 ? 'Complete' : 'Charging...'}</span>
                <span className="text-xl font-extrabold text-[#147b3d]">{Math.floor(progress)}%</span>
              </div>
              
              {/* The Bar */}
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#007b33] to-[#1fd66b] h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Subtle shimmer effect */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 rounded-full w-full opacity-50"></div>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="text-center mt-3">
                <p className="text-xs font-semibold text-gray-500">
                  {progress >= 100 ? (
                    <span className="flex items-center justify-center text-[#147b3d]"><CheckCircle2 size={14} className="mr-1"/> Target Reached</span>
                  ) : (
                    timeRemaining
                  )}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Action Button */}
        {isCharging ? (
          <button 
            disabled={stopMutation.isPending}
            onClick={() => stopMutation.mutate()}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center transition-all active:scale-95 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20"
          >
            {stopMutation.isPending ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Stop Charging'
            )}
          </button>
        ) : (
          <button 
            disabled={startMutation.isPending || numAmount <= 0}
            onClick={() => startMutation.mutate()}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none bg-[#007b33] hover:bg-[#00682b] shadow-lg shadow-green-900/20"
          >
            {startMutation.isPending ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Zap size={20} className="mr-2" fill="currentColor" />
                Start Charging
              </>
            )}
          </button>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 text-center mt-6 leading-tight px-4">
          By starting the session, you agree to the usage terms. High-voltage DC charging will begin immediately.
        </p>

      </div>
    </div>
  );
}
