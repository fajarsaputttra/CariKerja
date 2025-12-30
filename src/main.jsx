import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Global CSS
import "./index.css";

// ===== EAGER (HALAMAN UTAMA) =====
import App from "./App.jsx";

// ===== LAZY PAGES =====
const JobDetail = lazy(() => import("./pages/JobDetail.jsx"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail.jsx"));
const Lowongan = lazy(() => import("./pages/Lowongan.jsx"));
const Artikel = lazy(() => import("./pages/ArtikelPage.jsx"));
const Tentang = lazy(() => import("./pages/TentangPage.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const EditJob = lazy(() => import("./pages/EditJob.jsx"));

// ===== LOADER COMPONENT =====
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0A66C2]"></div>
        <p className="text-sm text-gray-500">Memuat halaman...</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<App />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/lowongan" element={<Lowongan />} />
            <Route path="/artikel" element={<Artikel />} />
            <Route path="/tentang" element={<Tentang />} />

            {/* ADMIN */}
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit/:id"
              element={
                <ProtectedRoute>
                  <EditJob />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
