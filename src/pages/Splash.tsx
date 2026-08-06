import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary text-white">
      <div className="animate-pulse flex flex-col items-center">
        <Zap size={80} className="mb-4 text-white" />
        <h1 className="text-2xl font-bold tracking-wider">Wi-SUN EV Charger Controller</h1>
        <div className="mt-8">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
