import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import MiniCartDrawer, { CartToast } from "./components/MiniCartDrawer";
import ErrorBoundary from "./components/ErrorBoundary";
import SuspenseLoader from "./components/SuspenseLoader";

// Admin System Frame Imports
import ProtectedAdminRoute from "./admin/routes/ProtectedAdminRoute";
import AdminLayout from "./admin/layouts/AdminLayout";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const ProfileOrders = lazy(() => import("./pages/ProfileOrders"));

// Lazy Loaded Admin Pages
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./admin/pages/AdminProducts"));
const AdminAddProduct = lazy(() => import("./admin/pages/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("./admin/pages/AdminEditProduct"));
const AdminOrders = lazy(() => import("./admin/pages/AdminOrders"));
const AdminCustomers = lazy(() => import("./admin/pages/AdminCustomers"));
const AdminAnalytics = lazy(() => import("./admin/pages/AdminAnalytics"));

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow flex flex-col">
        <Suspense fallback={<SuspenseLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Customer Facing Routes */}
              <Route path="/" element={<ErrorBoundary><PageTransition><Home /></PageTransition></ErrorBoundary>} />
              <Route path="/shop" element={<ErrorBoundary><PageTransition><Shop /></PageTransition></ErrorBoundary>} />
              <Route path="/product/:id" element={<ErrorBoundary><PageTransition><ProductDetails /></PageTransition></ErrorBoundary>} />
              <Route path="/cart" element={<ErrorBoundary><PageTransition><Cart /></PageTransition></ErrorBoundary>} />
              <Route path="/wishlist" element={<ErrorBoundary><PageTransition><Wishlist /></PageTransition></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><PageTransition><Login /></PageTransition></ErrorBoundary>} />
              <Route path="/register" element={<ErrorBoundary><PageTransition><Register /></PageTransition></ErrorBoundary>} />
              <Route
                path="/profile/orders"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <PageTransition>
                        <ProfileOrders />
                      </PageTransition>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<ErrorBoundary><AdminLogin /></ErrorBoundary>} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                <Route path="products" element={<ErrorBoundary><AdminProducts /></ErrorBoundary>} />
                <Route path="products/new" element={<ErrorBoundary><AdminAddProduct /></ErrorBoundary>} />
                <Route path="products/edit/:id" element={<ErrorBoundary><AdminEditProduct /></ErrorBoundary>} />
                <Route path="orders" element={<ErrorBoundary><AdminOrders /></ErrorBoundary>} />
                <Route path="customers" element={<ErrorBoundary><AdminCustomers /></ErrorBoundary>} />
                <Route path="analytics" element={<ErrorBoundary><AdminAnalytics /></ErrorBoundary>} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MiniCartDrawer />}
      {!isAdminRoute && <CartToast />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;