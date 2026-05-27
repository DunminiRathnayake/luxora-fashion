import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const redirectPath = location.state?.from?.pathname || location.state?.from || "/shop";

  const validate = () => {
    let formErrors = {};

    if (!email) {
      formErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      formErrors.password = "Password is required";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      setErrors({});

      try {
        await login(email, password);
        setIsSubmitting(false);
        setLoginSuccess(true);
        
        // Redirect after delay
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } catch (err) {
        setIsSubmitting(false);
        setErrors({ server: err.message || "Invalid credentials. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col lg:grid lg:grid-cols-12 bg-white">
      <SEO title="Sign In" description="Log in to your Luxora account to view order history and update billing details." />
      {/* Left Panel: Fashion Imagery */}
      <div className="h-60 sm:h-72 lg:h-auto lg:col-span-5 relative bg-neutral-900 overflow-hidden shrink-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.75 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
          alt="LUXORA editorial"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 flex flex-col justify-end p-8 lg:p-12 z-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold mb-1"
          >
            The Art of Dress
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl lg:text-3xl font-light text-white tracking-widest uppercase mb-2 lg:mb-4"
          >
            LUXORA
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-neutral-350 font-light text-xs lg:text-sm leading-relaxed max-w-sm"
          >
            Est. 2026. A statement of style, a legacy of craft. Discover curated luxury wardrobe essentials and exclusive privileges.
          </motion.p>
        </div>
      </div>

      {/* Right Panel: Content form */}
      <div className="flex-grow lg:col-span-7 flex items-center justify-center px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {loginSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-light tracking-widest uppercase mb-3">Welcome Back</h3>
                <p className="text-gray-500 font-light text-sm">Authenticating your profile. Preparing the collections...</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="mb-8">
                  <h1 className="text-2xl font-light tracking-widest uppercase text-neutral-900 mb-2">
                    Sign In
                  </h1>
                  <p className="text-neutral-500 font-light text-xs">
                    Please log in using your account credentials.
                  </p>
                  {errors.server && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-light tracking-wide rounded-md animate-fade-in">
                      {errors.server}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                        }}
                        className={`w-full pl-8 pr-3 py-2.5 bg-transparent border-b outline-none transition-all duration-300 text-sm font-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black ${
                          errors.email
                            ? "border-red-400 focus:border-red-500"
                            : "border-neutral-200 focus:border-black"
                        }`}
                        placeholder="name@domain.com"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-light mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-[10px] text-neutral-400 hover:text-black uppercase tracking-wider underline underline-offset-2 font-medium cursor-pointer"
                        onClick={() => alert("Password reset workflow placeholder.")}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        className={`w-full pl-8 pr-10 py-2.5 bg-transparent border-b outline-none transition-all duration-300 text-sm font-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black ${
                          errors.password
                            ? "border-red-400 focus:border-red-500"
                            : "border-neutral-200 focus:border-black"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-[10px] text-red-500 font-light mt-1 block">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black accent-black cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-xs text-neutral-500 select-none cursor-pointer">
                      Keep me signed in
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                    {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </form>


                <div className="mt-8 text-center text-xs text-neutral-500 font-light">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-black font-semibold uppercase tracking-wider underline underline-offset-4 hover:text-neutral-700"
                  >
                    Create Account
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;