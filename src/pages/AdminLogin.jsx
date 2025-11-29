import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("❌ Login gagal. Periksa email dan password!");
    } else {
      window.location.href = "/admin";
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-[#0A66C2] text-white p-3 rounded-full shadow-md">
              <LogIn size={26} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#0A66C2]">Portal Admin</h1>
          <p className="text-gray-500 text-sm mt-1">
            Masuk untuk mengelola lowongan pekerjaan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center text-sm bg-red-50 py-2 rounded-lg border border-red-200"
            >
              {error}
            </motion.p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0A66C2] transition">
              <Mail className="text-gray-400 ml-3" size={18} />
              <input
                type="email"
                placeholder="admin@email.com"
                className="w-full p-2.5 pl-3 outline-none bg-transparent"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0A66C2] transition">
              <Lock className="text-gray-400 ml-3" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2.5 pl-3 outline-none bg-transparent"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A66C2] hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {loading ? (
              <span className="animate-pulse">Memproses...</span>
            ) : (
              <>
                <LogIn size={18} /> Masuk
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} JobPortal Admin • Powered by
          futuredataspeednetwork
        </div>
      </motion.div>
    </div>
  );
}
