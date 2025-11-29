import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      setArticle(data);
    }
    fetchArticle();
  }, [id]);

  if (!article)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Memuat artikel...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50"
    >
      {/* Header section */}
      <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden rounded-b-3xl shadow-md">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-md mb-2">
            {article.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-200">
            Diposting:{" "}
            {new Date(article.date_posted).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/70 backdrop-blur-lg shadow-lg rounded-3xl p-8 sm:p-10 border border-gray-100"
        >
          <article className="prose max-w-none prose-blue prose-headings:font-semibold prose-p:text-gray-700">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </p>
          </article>

          {/* Tombol kembali */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-transform transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Halaman Utama
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
