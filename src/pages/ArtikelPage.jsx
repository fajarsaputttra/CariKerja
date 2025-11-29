import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ArtikelPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") setFilteredArticles(articles);
    else {
      const lower = searchTerm.toLowerCase();
      setFilteredArticles(
        articles.filter(
          (a) =>
            a.title.toLowerCase().includes(lower) ||
            a.content.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, articles]);

  async function fetchArticles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date_posted", { ascending: false });

    if (error) console.error(error);
    setArticles(data || []);
    setFilteredArticles(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100/30">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-[#004182]"
        >
          Artikel & Wawasan Karier
        </motion.h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Dapatkan inspirasi, tips karier, dan berita terkini dunia kerja —
          dibawakan oleh <span className="font-semibold">Carikerja</span>.
        </p>

        {/* Search Bar */}
        <div className="relative mt-8 max-w-lg mx-auto">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white shadow-md rounded-full py-3 pl-12 pr-5 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          />
        </div>
      </section>

      {/* Artikel List */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {loading ? (
            // 🔵 Modern Loading State
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4"
            >
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-4 border-blue-100 animate-ping absolute inset-0"></div>
                <div className="h-14 w-14 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin relative"></div>
              </div>
              <p className="text-base md:text-lg font-medium text-gray-600 tracking-wide">
                Memuat artikel terkini...
              </p>
              <p className="text-xs text-gray-400">
                Mohon tunggu sebentar, kami sedang menyiapkan inspirasi terbaik
                untukmu ✨
              </p>
            </motion.div>
          ) : filteredArticles.length === 0 ? (
            // ⚪ Modern Empty State
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center min-h-[40vh] space-y-5"
            >
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-inner"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FileText className="w-14 h-14 text-blue-600" />
              </motion.div>

              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-1">
                  Belum ada artikel yang cocok
                </h4>
                <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
                  Kami tidak menemukan hasil untuk pencarianmu. Coba gunakan
                  kata kunci lain atau kembali lagi nanti — kami terus
                  menambahkan konten baru setiap minggu 💡
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#004182] text-white text-sm font-medium hover:bg-[#00346b] transition-colors duration-300 shadow-md"
              >
                <span>Kembali ke Beranda</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    to={`/article/${article.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {article.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#004182] line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                          {article.content}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {new Date(article.date_posted).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        <span className="text-blue-600 font-medium group-hover:underline">
                          Baca Selengkapnya →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
