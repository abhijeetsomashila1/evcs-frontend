import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShake(true);
      toast.error('Please enter a valid email address');
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Bypass authentication: Accept any credentials
      localStorage.setItem('user_id', '1');
      localStorage.setItem('user_name', 'Test User');
      localStorage.setItem('user_email', email);
      
      toast.success(`Welcome back!`);
      navigate('/home');
    } catch {
      setShake(true);
      toast.error('Cannot reach the server. Please try again.');
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top Logo Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <img
          src="/iiit-logo.png"
          alt="IIIT Hyderabad"
          className="h-12 object-contain"
        />
        <img
          src="/scrc-logo.png"
          alt="Smart City Research Centre"
          className="h-12 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">

        {/* Title Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0f8f4] border-2 border-[#007b33] mb-4">
            <Zap size={30} className="text-[#007b33]" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EV Charger</h1>
          <p className="text-sm text-gray-500 mt-1">Wi-SUN Smart Charging Network</p>
        </div>

        {/* Login Card */}
        <div
          className={`bg-white w-full max-w-sm rounded-[2rem] shadow-sm border border-gray-100 p-8 transition-all ${shake ? 'animate-shake' : ''}`}
          style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-7">Access the charging control panel</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-100 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none border-2 border-transparent focus:border-[#007b33] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3.5 bg-gray-100 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none border-2 border-transparent focus:border-[#007b33] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 bg-[#007b33] hover:bg-[#00682b] shadow-lg shadow-green-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={18} fill="currentColor" />
                  Sign In
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-gray-400 text-center mt-6 px-4">
          International Institute of Information Technology, Hyderabad
        </p>

      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>

    </div>
  );
}
