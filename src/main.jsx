import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext";

// Pages
import App from "./App.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import EditJob from "./pages/EditJob.jsx";
import ArticleDetail from "./pages/ArticleDetail";
import Lowongan from "./pages/Lowongan.jsx";
import Artikel from "./pages/ArtikelPage.jsx";
import Tentang from "./pages/TentangPage.jsx";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Global CSS
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Halaman utama */}
          <Route path="/" element={<App />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/lowongan" element={<Lowongan />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/tentang" element={<Tentang />} />

          {/* Admin */}
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
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);