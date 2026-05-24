import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginAdmin } from "../services/adminAuthService";
import { Shield, ArrowRight, Eye, EyeOff } from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);
    
    // Simulate luxury slow loading/verification (700ms) for high-end feel
    setTimeout(() => {
      const success = loginAdmin(email, password, rememberMe);
      setIsLoading(false);
      
      if (success) {
        navigate("/admin");
      } else {
        setError("Invalid administrative credentials.");
      }
    }, 850000 / 1000000); // ~850ms
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center relative overflow-hidden px-6 font-sans">
      
      {/* Background Ambient Luxury Light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neutral-900/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-neutral-900/30 rounded-full blur-[140px] pointer-events-none"></div>
      
      {/* Border Details for Editorial Look */}
      <div className="absolute inset-8 border border-neutral-900/40 pointer-events-none hidden md:block"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-[#121212]/60 backdrop-blur-md border border-neutral-900/80 p-8 md:p-10 relative z-10 shadow-2xl"
      >
        {/* Branding header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-neutral-800 bg-[#161616] mb-4">
            <Shield className="w-5 h-5 text-neutral-400" />
          </div>
          <span className="text-[9px] tracking-[6px] uppercase text-neutral-500 font-semibold block mb-1">
            Luxora Terminal
          </span>
          <h1 className="text-xl font-light uppercase tracking-widest text-neutral-200">
            Staff Portal
          </h1>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Validation Alert */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-950/20 border border-red-900/50 px-4 py-3 text-red-400 text-xs font-light text-center uppercase tracking-wider rounded-sm overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <div className="relative group">
            <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2 transition-colors group-focus-within:text-neutral-300">
              Identity Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@luxora.com"
              className="w-full bg-[#161616]/40 border-b border-neutral-800 focus:border-white py-2.5 px-1 text-sm text-white focus:outline-none transition-colors duration-300 font-light"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2 transition-colors group-focus-within:text-neutral-300">
              Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161616]/40 border-b border-neutral-800 focus:border-white py-2.5 pl-1 pr-10 text-sm text-white focus:outline-none transition-colors duration-300 font-light"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Controls: Remember Me & Reset */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-light">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border flex items-center justify-center transition-colors duration-250 ${
                  rememberMe
                    ? "bg-white border-white text-black"
                    : "bg-transparent border-neutral-800"
                }`}
              >
                {rememberMe && (
                  <svg
                    className="w-2.5 h-2.5 stroke-current stroke-2 fill-none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </div>
              <span className="tracking-wider uppercase text-[10px]">Remember session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-4 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-3 w-3 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying Credentials
              </span>
            ) : (
              <>
                Authenticate <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-neutral-600">
          Luxora Luxury Fashion Brand © 2026
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
