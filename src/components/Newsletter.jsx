import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, ArrowRight } from "lucide-react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setStatus("loading");

    // Simulate API request
    setTimeout(() => {
      setStatus("success");
    }, 1800);
  };

  return (
    <section className="px-6 py-28 bg-[#151515] text-white text-center relative overflow-hidden flex flex-col justify-center items-center">
      {/* Subtle luxury editorial backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-800/30 via-transparent to-transparent -z-10" />

      <div className="max-w-2xl w-full mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="py-6 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-6">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-xl md:text-2xl font-light uppercase tracking-widest mb-4">
                Welcome To The Circle
              </h3>
              <p className="text-neutral-400 font-light text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                Thank you for subscribing to LUXORA editorials. A welcoming privilege code and exclusive updates will arrive in your inbox shortly.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="uppercase tracking-[8px] text-[10px] sm:text-xs text-neutral-500 font-semibold mb-4 block">
                Join The List
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wide leading-tight mb-4">
                Be First To Discover Drops
              </h2>

              <p className="text-neutral-400 font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto mb-10">
                Receive invitation-only drop notifications, exclusive seasonal collection previews, and styling lookbooks.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch relative">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={status === "loading"}
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full bg-transparent border-b border-neutral-700 focus:border-white py-3 px-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 font-light uppercase tracking-widest text-center sm:text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-3.5 bg-white text-black text-[10px] uppercase tracking-widest font-semibold border border-white hover:bg-transparent hover:text-white transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                    {status === "idle" && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>

                {error && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-red-400 font-light mt-2.5 block text-center uppercase tracking-wider"
                  >
                    {error}
                  </motion.span>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Newsletter;