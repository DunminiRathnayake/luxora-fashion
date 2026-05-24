import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin } from "../services/adminAuthService";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldAlert
} from "lucide-react";

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Orders", path: "/admin/orders", icon: Receipt },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  // Get matching current title
  const getPageTitle = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    return currentItem ? currentItem.name : "Admin Panel";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans overflow-x-hidden">
      
      {/* 1. Backdrop for mobile sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. Sidebar Navigation */}
      {/* Desktop Sidebar (Collapsible) */}
      <motion.aside
        animate={{ width: isCollapsed ? 76 : 260 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col bg-[#111] border-r border-neutral-900 sticky top-0 h-screen z-30 shrink-0"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-900 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xs uppercase tracking-[5px] font-semibold text-neutral-200 block whitespace-nowrap"
              >
                LUXORA <span className="font-light text-neutral-500">STAFF</span>
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs uppercase tracking-[2px] font-bold text-neutral-200 block mx-auto whitespace-nowrap"
              >
                LX
              </motion.span>
            )}
          </AnimatePresence>

          {/* Toggle Expand/Collapse */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-neutral-500 hover:text-white p-1 hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center py-4 border-b border-neutral-900">
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-neutral-500 hover:text-white p-1.5 hover:bg-neutral-900 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sidebar Items */}
        <nav className="flex-grow py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3.5 transition-all duration-300 relative group cursor-pointer no-underline ${
                  isActive
                    ? "text-white font-medium"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {/* Active Indicator Underline style background pill */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-neutral-900 rounded-sm border-l-2 border-white z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-4">
                  <Icon className="w-4.5 h-4.5" />
                  {!isCollapsed && (
                    <span className="text-xs uppercase tracking-widest block font-light">
                      {item.name}
                    </span>
                  )}
                </span>

                {/* Tooltip on collapse */}
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-neutral-950 border border-neutral-800 text-[10px] uppercase tracking-widest text-white px-3 py-1.5 rounded-sm whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-neutral-900">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-neutral-500 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 gap-4 cursor-pointer`}
          >
            <LogOut className="w-4.5 h-4.5 text-neutral-500 group-hover:text-white" />
            {!isCollapsed && (
              <span className="text-xs uppercase tracking-widest font-light">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed top-0 bottom-0 left-0 w-72 bg-[#111] border-r border-neutral-900 z-50 flex flex-col lg:hidden"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-900">
              <span className="text-xs uppercase tracking-[5px] font-semibold text-neutral-200 block">
                LUXORA <span className="font-light text-neutral-500">STAFF</span>
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-neutral-500 hover:text-white p-1 hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-4 rounded-sm transition-all duration-300 relative cursor-pointer no-underline ${
                      isActive
                        ? "text-white bg-neutral-900 border-l-2 border-white"
                        : "text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon className="w-5 h-5" />
                      <span className="text-xs uppercase tracking-widest font-light">
                        {item.name}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-neutral-900">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-3 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors gap-4 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-light">
                  Logout
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3. Main content body panel */}
      <div className="flex-grow flex flex-col min-h-screen">
        {/* Topbar Header */}
        <header className="h-20 bg-[#0F0F0F] border-b border-neutral-900 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white p-1 hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Page title */}
            <h2 className="text-sm font-light uppercase tracking-widest text-neutral-300">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile trigger indicator */}
            <div className="flex items-center gap-3 border border-neutral-900 bg-[#161616]/40 px-4 py-2 rounded-full">
              <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-light hidden sm:inline">
                Admin Curator
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content Space */}
        <main className="flex-grow p-6 md:p-8 lg:p-10 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}

export default AdminLayout;
