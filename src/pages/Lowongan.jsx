import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Briefcase, MapPin, Clock, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Lowongan() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Fetch all jobs once at start
  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select(`
        id, title, company, location, job_type, date_posted,
        category_id, categories(name)
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setAllJobs(data || []);
      setFilteredJobs(data || []); // langsung tampil semua
    }
    setLoading(false);
  }

  // 🔹 Realtime filtering
  useEffect(() => {
    const keyword = search.toLowerCase().trim();

    if (keyword === "") {
      // kalau kosong, tampilkan semua data tanpa refresh
      setFilteredJobs(allJobs);
      return;
    }

    // Filter data langsung di client
    const filtered = allJobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";
      const type = job.job_type?.toLowerCase() || "";
      const category = job.categories?.name?.toLowerCase() || "";

      return (
        title.includes(keyword) ||
        company.includes(keyword) ||
        location.includes(keyword) ||
        type.includes(keyword) ||
        category.includes(keyword)
      );
    });

    setFilteredJobs(filtered);
  }, [search, allJobs]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 🔹 Header */}
      <section className="bg-gradient-to-r from-[#0A66C2] to-[#004a99] text-white py-16 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
          Lowongan Kerja
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          Temukan pekerjaan impianmu dari berbagai kategori dan jenis pekerjaan
        </p>
      </section>

      {/* 🔹 Search Bar */}
      <div className="relative w-full flex justify-center -mt-10 px-4">
        <div className="relative w-full max-w-4xl bg-white/70 backdrop-blur-md rounded-full shadow-lg flex flex-row items-center border border-white/40 p-3 transition hover:bg-white/90 duration-300">
          <Search className="text-gray-400 w-5 h-5 ml-3 mr-2" />
          <input
            type="text"
            placeholder="Cari perusahaan, pekerjaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // realtime filter
            className="flex-grow bg-transparent outline-none text-gray-700 text-sm sm:text-base placeholder-gray-500"
          />
        </div>
      </div>

      {/* 🔹 Job List */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-medium">Memuat data lowongan...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-blue-50 p-6 rounded-full shadow-inner mb-6">
              <Briefcase className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Tidak ada hasil ditemukan
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              Kami tidak menemukan lowongan yang sesuai dengan kata kunci kamu.
              Coba ubah kata pencarian atau hapus filter untuk melihat semua
              lowongan.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-6 px-5 py-2.5 bg-[#0A66C2] text-white rounded-full font-medium shadow hover:bg-[#004a99] transition-all duration-300"
            >
              Tampilkan semua lowongan
            </button>
          </motion.div>
        ) : (
          <motion.div
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
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group bg-white rounded-2xl p-6 flex flex-col justify-between border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 bg-blue-100 text-[#0A66C2] rounded-full font-medium">
                      {job.categories?.name || "Tanpa Kategori"}
                    </span>
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {job.job_type}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#0A66C2] transition-colors line-clamp-2">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">{job.company}</p>

                  <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={15} /> {job.location || "Tidak diketahui"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={15} />{" "}
                      {new Date(job.date_posted).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/job/${job.id}`}
                  className="relative group mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#0A66C2] to-[#004a99] text-white py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300"
                >
                  <span className="z-10">Lihat Detail</span>
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-300 z-10" />
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition duration-300"></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
