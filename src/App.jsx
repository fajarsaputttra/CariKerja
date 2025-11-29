import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Supabase init ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchJobs();
    fetchArticles();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory]);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // --- Fetch Categories ---
  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (error) console.error("Gagal ambil kategori:", error);
    else setCategories(data || []);
  }

  // --- Fetch Jobs ---
  async function fetchJobs() {
    setLoading(true);
    let query = supabase
      .from("jobs")
      .select(
        `
        id,
        title,
        company,
        location,
        job_type,
        date_posted,
        apply_link,
        poster_url,
        category_id,
        categories (name)
      `
      )
      .order("id", { ascending: false });

    if (selectedCategory) query = query.eq("category_id", selectedCategory);

    const { data, error } = await query;
    if (error) console.error(error);
    else setJobs(data || []);

    setTimeout(() => setLoading(false), 400);
  }

  // --- Fetch Articles ---
  async function fetchArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date_posted", { ascending: false });
    if (error) console.error("Gagal ambil artikel:", error);
    else setArticles(data || []);
  }

  // --- Search Filtering ---
  const filteredJobs = jobs.filter((job) =>
    [job.title, job.company, job.location, job.job_type]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    setTransitioning(true);
    const timeout = setTimeout(() => setTransitioning(false), 200);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 text-gray-800">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A66C2]/90 backdrop-blur-md shadow-sm border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight"
          >
            Cari<span className="text-blue-200">Kerja</span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-white hover:text-blue-200">
              Beranda
            </a>
            <a href="/lowongan" className="text-white hover:text-blue-200">
              Lowongan
            </a>
            <a href="/artikel" className="text-white hover:text-blue-200">
              Artikel
            </a>
            <a href="/tentang" className="text-white hover:text-blue-200">
              Tentang Kami
            </a>
          </nav>

          {/* DESKTOP ADMIN BUTTON */}
          <Link
            to="/login"
            className="hidden md:block bg-white text-[#0A66C2] px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-blue-50 transition"
          >
            Admin
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-3xl focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <div
          className={`
      md:hidden bg-[#0A66C2]/95 backdrop-blur-xl 
      border-t border-blue-800 shadow-lg overflow-hidden 
      transition-all duration-300
      ${mobileMenuOpen ? "max-h-80 py-4" : "max-h-0 py-0"}
    `}
        >
          <div className="flex flex-col px-6 space-y-4 text-white text-lg">
            <a href="/" className="hover:text-blue-200">
              Beranda
            </a>
            <a href="/lowongan" className="hover:text-blue-200">
              Lowongan
            </a>
            <a href="/artikel" className="hover:text-blue-200">
              Artikel
            </a>
            <a href="/tentang" className="hover:text-blue-200">
              Tentang Kami
            </a>

            <Link
              to="/login"
              className="w-full bg-white text-[#0A66C2] py-2 rounded-full text-center font-semibold shadow-md hover:bg-blue-50 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="
    relative w-full 
    h-[460px] sm:h-[480px] 
    flex flex-col justify-start sm:justify-center items-center 
    text-white
    pt-[130px] sm:pt-[70px]
    overflow-hidden
  "
      >
        {/* DESKTOP IMAGE */}
        <div
          className="
      hidden sm:block 
      absolute inset-0 
      w-full h-full
      bg-cover bg-center bg-no-repeat
    "
          style={{
            backgroundImage: "url('/images/header-desktop.png')",
          }}
        ></div>

        {/* MOBILE IMAGE */}
        <div
          className="
      sm:hidden 
      absolute inset-0 
      w-full h-full
      bg-cover bg-center bg-no-repeat
    "
          style={{
            backgroundImage: "url('/images/header-mobile.png')",
          }}
        ></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A66C2]/70 via-[#0A66C2]/45 to-transparent"></div>

        {/* SEARCH CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 w-full px-5 sm:px-6
               mt-16 sm:mt-10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mx-auto w-full max-w-[850px]">
              <div
                onClick={(e) => e.stopPropagation()}
                className="
            relative 
            bg-white/45 backdrop-blur-xl 
            rounded-lg sm:rounded-2xl  
            flex flex-col sm:flex-row 
            items-center shadow-lg 
            p-2 sm:p-3 
            border border-white/40 
            transition hover:shadow-2xl hover:bg-white/55 
            w-full 
            mx-auto 
            gap-2 sm:gap-0

            /* MOBILE: tampil kecil & modern */
            scale-95
          "
              >
                {/* DROPDOWN */}
                <div className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="
                flex items-center justify-between 
                w-full sm:w-48 
                bg-white/80 text-gray-800 
                font-medium 
                px-3 py-1.5 text-sm 
                rounded-lg sm:rounded-full 
                sm:px-4 sm:py-2 sm:text-base
                shadow-sm hover:bg-white
              "
                  >
                    {selectedCategory
                      ? categories.find((c) => c.id === selectedCategory)?.name
                      : "Semua Kategori"}

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 ml-2 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
                  absolute top-full mt-2 
                  w-full sm:w-48 
                  bg-white text-gray-800 
                  rounded-xl sm:rounded-2xl 
                  shadow-xl border border-gray-200 
                  z-[9999]
                "
                    >
                      <ul className="max-h-48 overflow-y-auto">
                        <li
                          onClick={() => {
                            setSelectedCategory("");
                            setDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          Semua Kategori
                        </li>
                        {categories.map((cat) => (
                          <li
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setDropdownOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {cat.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* SEARCH INPUT */}
                <div
                  className="
              flex-grow flex items-center 
              bg-white/70 sm:bg-white/30 
              rounded-lg sm:rounded-full 
              px-3 py-1.5 text-sm
              sm:px-4 sm:py-2 sm:text-base
              w-full
            "
                >
                  <Search className="text-gray-400 w-5 h-5 mr-2" />
                  <input
                    type="text"
                    placeholder="Cari perusahaan, pekerjaan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                flex-grow bg-transparent outline-none 
                text-gray-700 placeholder-gray-500
              "
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full px-6 sm:px-10 lg:px-16 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[8fr_2fr] gap-10">
          {/* LEFT - JOBS */}
          <motion.div
            id="lowongan"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-2xl font-bold text-[#0A66C2] mb-5">
              Lowongan Kerja Terbaru
            </h3>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-lg font-medium">Memuat data lowongan...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col items-center justify-center min-h-[45vh] text-center space-y-6"
                >
                  {/* Glow Effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-200/40 blur-3xl rounded-full opacity-40 w-40 h-40 -z-10"></div>

                    {/* Icon */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 text-[#0A66C2]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.5 14.5L19 19M10.5 16A5.5 5.5 0 1010.5 5a5.5 5.5 0 000 11z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h4 className="text-2xl font-semibold text-gray-800">
                      Tidak ditemukan hasil
                    </h4>
                    <p className="text-gray-500 text-base mt-1 max-w-md mx-auto">
                      Coba ubah kata kunci pencarian atau pilih kategori lain
                      untuk menemukan peluang kerja yang sesuai.
                    </p>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("");
                    }}
                    className="mt-2 bg-[#0A66C2] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-blue-700 transition"
                  >
                    Reset Pencarian
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-6"
                >
                  {filteredJobs.slice(0, 6).map((job) => (
                    <motion.div
                      key={job.id}
                      whileHover={{ y: -5, scale: 1.01 }}
                      transition={{ duration: 0.25 }}
                      className="
          bg-white 
          p-4 sm:p-8 
          rounded-xl sm:rounded-2xl 
          shadow-sm 
          border border-gray-200 
          hover:shadow-md hover:border-blue-300 
          transition-all duration-200
          w-full
        "
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
                        {/* LEFT */}
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 leading-snug">
                            {job.title}
                          </h2>

                          <p className="text-sm sm:text-lg text-gray-600 mt-1">
                            {job.company} • {job.location}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                            {job.job_type && (
                              <span
                                className="
                  px-2 py-0.5 
                  text-xs sm:text-sm 
                  font-medium 
                  text-green-700 bg-green-100 
                  rounded-full border border-green-200
                "
                              >
                                {job.job_type}
                              </span>
                            )}

                            {job.categories && (
                              <span
                                className="
                  px-2 py-0.5 
                  text-xs sm:text-sm 
                  font-medium 
                  text-blue-700 bg-blue-100 
                  rounded-full border border-blue-200
                "
                              >
                                {job.categories.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* BUTTON */}
                        <Link
                          to={`/job/${job.id}`}
                          className="
              bg-[#0A66C2] 
              text-white 
              px-4 py-2 
              sm:px-6 sm:py-3
              text-sm sm:text-lg 
              rounded-lg sm:rounded-xl 
              font-medium 
              text-center
              hover:bg-blue-700 
              transition
            "
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT – ARTICLES */}
          <motion.aside
            id="artikel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-2xl font-bold text-[#0A66C2] mb-5">
              Artikel Terbaru
            </h3>

            <div className="space-y-6">
              {articles.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada artikel.</p>
              ) : (
                articles.slice(0, 3).map((a) => (
                  <motion.div
                    key={a.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="
      bg-white 
      rounded-xl sm:rounded-2xl 
      border border-gray-200 
      shadow-sm hover:shadow-md 
      transition-transform 
      overflow-hidden
    "
                  >
                    {/* Thumbnail */}
                    <img
                      src={a.image}
                      alt={a.title}
                      className="
        w-full 
        h-28 sm:h-40 
        object-cover
      "
                    />

                    <div className="p-4 sm:p-5">
                      {/* Judul */}
                      <h4
                        className="
        font-semibold 
        text-gray-800 
        text-base sm:text-lg 
        mb-1 sm:mb-2 
        line-clamp-2
      "
                      >
                        {a.title}
                      </h4>

                      {/* Tanggal */}
                      <p
                        className="
        text-[11px] sm:text-xs 
        text-gray-400 
        mb-1 sm:mb-2
      "
                      >
                        {new Date(a.date_posted).toLocaleDateString("id-ID")}
                      </p>

                      {/* Excerpt */}
                      <p
                        className="
        text-sm sm:text-gray-600 
        text-[13px] 
        line-clamp-3 
        mb-3 sm:mb-4
      "
                      >
                        {a.excerpt}
                      </p>

                      {/* Link */}
                      <Link
                        to={`/article/${a.id}`}
                        className="
          text-[#0A66C2] 
          font-medium 
          hover:underline 
          text-sm
        "
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="
          relative w-full 
          bg-gradient-to-br from-[#0A66C2] to-[#004182] 
          text-white 
          pt-12 pb-20 sm:pb-14 
          mt-20 
          overflow-hidden
        "
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] h-[360px] bg-white/10 blur-3xl opacity-20 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Carikerja<span className="text-blue-200">.</span>
              </h2>

              <p className="text-blue-100 text-sm max-w-sm">
                Platform pencarian kerja modern untuk membantu masyarakat
                Indonesia menemukan karier terbaik — cepat, akurat, dan penuh
                inspirasi.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 justify-center text-sm text-blue-100">
              <a href="#home" className="hover:text-white">
                Beranda
              </a>
              <a href="/lowongan" className="hover:text-white">
                Lowongan
              </a>
              <a href="/artikel" className="hover:text-white">
                Artikel
              </a>
              <a href="/tentang" className="hover:text-white">
                Tentang
              </a>
            </div>

            <div className="flex items-center justify-center gap-3">
              <a
                href="mailto:lokerinfo167@gmail.com"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4h16v16H4zM4 4l8 8m8-8l-8 8"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="my-8 border-t border-white/10"></div>

          <div className="text-center text-xs md:text-sm text-blue-100">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-white">Carikerja</span> •
              Membangun masa depan karier Indonesia
            </p>

            <p className="mt-1 text-blue-200">
              Dibuat dengan ❤️ oleh{" "}
              <span className="font-semibold text-white">Mas Fajar</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
