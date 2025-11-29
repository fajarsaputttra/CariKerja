import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetchJob();
  }, [id]);

  async function fetchJob() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error("Error fetching job:", error);
    else setJob(data);
  }

  const nextSlide = () => {
    if (job?.poster_url)
      setCurrentIndex((prev) => (prev + 1) % job.poster_url.length);
  };

  const prevSlide = () => {
    if (job?.poster_url)
      setCurrentIndex(
        (prev) => (prev - 1 + job.poster_url.length) % job.poster_url.length
      );
  };

  if (!job)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium">Memuat data lowongan...</p>
      </div>
    );

  const hasMultipleImages =
    Array.isArray(job.poster_url) && job.poster_url.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50"
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* 🔹 Tombol kembali */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#0A66C2] font-semibold hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Halaman Sebelumnya
          </button>
        </div>

        {/* 🔹 Kartu utama */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 🔹 Gambar utama */}
          {job.poster_url && job.poster_url.length > 0 && (
            <div
              className="relative w-full h-[320px] overflow-hidden cursor-pointer group"
              onClick={() => setPopupOpen(true)}
            >
              <img
                src={job.poster_url[0]}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-md">
                  {job.title}
                </h1>
                <p className="text-lg font-medium text-gray-200">
                  {job.company}
                </p>
              </div>
            </div>
          )}

          {/* 🔹 Informasi */}
          <div className="p-8 sm:p-10">
            <div className="flex flex-wrap gap-4 mb-6 text-gray-700">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <Briefcase className="text-[#0A66C2] w-5 h-5" />
                <span className="bg-blue-100 text-[#0A66C2] px-3 py-1 rounded-full font-medium text-sm">
                  {job.job_type || "Jenis pekerjaan tidak diketahui"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="text-[#0A66C2] w-5 h-5" />
                <span>{job.location || "Lokasi tidak diketahui"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <CalendarDays className="text-[#0A66C2] w-5 h-5" />
                <span>
                  Diposting:{" "}
                  {new Date(job.date_posted).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg mb-8">
              {job.description}
            </p>

            {job.apply_link && (
              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#0A66C2] text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
              >
                Lamar Sekarang
              </a>
            )}
          </div>
        </div>

        {/* 🔹 Popup Gambar */}
        <AnimatePresence>
          {popupOpen && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-5xl w-full mx-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                {/* Tombol close */}
                <button
                  onClick={() => {
                    setPopupOpen(false);
                    setZoom(1);
                  }}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md z-50"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Zoom control */}
                <div className="absolute top-4 left-4 flex gap-2 z-50">
                  <button
                    onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                    className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                    className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-black">
                  <motion.img
                    key={job.poster_url[currentIndex]}
                    src={job.poster_url[currentIndex]}
                    alt="Poster"
                    style={{ transform: `scale(${zoom})` }}
                    className="w-full h-[80vh] object-contain transition-transform duration-300"
                  />

                  {/* Navigasi hanya jika >1 */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Indikator */}
                      <div className="absolute bottom-6 w-full flex justify-center gap-2">
                        {job.poster_url.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${
                              idx === currentIndex
                                ? "bg-white"
                                : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 Footer */}
        <footer className="mt-12 text-gray-500 text-base text-center">
          © 2025{" "}
          <span className="font-semibold text-[#0A66C2]">Carikerja</span> — Indonesia
          Tanpa Pengangguran
        </footer>
      </div>
    </motion.div>
  );
}
