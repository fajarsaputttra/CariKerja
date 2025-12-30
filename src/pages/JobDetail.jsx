import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Home,
  Briefcase,
  MapPin,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function JobDetail() {
  const { slug } = useParams(); // ⬅️ GANTI id → slug
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchJob();
  }, [slug]);

  async function fetchJob() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("slug", slug) // ⬅️ QUERY BERDASARKAN SLUG
      .single();

    if (!error) setJob(data);
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasMultipleImages =
    Array.isArray(job.poster_url) && job.poster_url.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-blue-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0A66C2] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-full text-[#0A66C2] font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          {/* IMAGE */}
          {job.poster_url?.length > 0 && (
            <div
              className="relative h-[220px] sm:h-[320px] cursor-pointer"
              onClick={() => setPopupOpen(true)}
            >
              <img
                src={job.poster_url[0]}
                alt={job.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h1 className="text-xl sm:text-3xl font-bold line-clamp-2">
                  {job.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-200">
                  {job.company}
                </p>
              </div>
            </div>
          )}

          {/* INFO */}
          <div className="p-5 sm:p-8">
            <div
              className="
                flex flex-col gap-2
                sm:flex-row sm:items-center sm:gap-6
                text-sm text-gray-700
              "
            >
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
                <Briefcase className="w-4 h-4" />
                {job.job_type}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                {new Date(job.date_posted).toLocaleDateString("id-ID")}
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                {job.location}
              </span>
            </div>

            <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

            {job.apply_link && (
              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-5 inline-block
                  w-full sm:w-auto
                  bg-[#0A66C2] text-white
                  px-6 py-3 rounded-full
                  font-semibold text-center
                  hover:bg-blue-700 transition
                "
              >
                Lamar Sekarang
              </a>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE POPUP */}
      <AnimatePresence>
        {popupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setPopupOpen(false)}
              className="absolute top-5 right-5 bg-white rounded-full p-2"
            >
              <X />
            </button>

            <motion.img
              src={job.poster_url[currentIndex]}
              alt="Poster"
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (i) =>
                        (i - 1 + job.poster_url.length) %
                        job.poster_url.length
                    )
                  }
                  className="absolute left-4 text-white"
                >
                  <ChevronLeft size={40} />
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex(
                      (i) => (i + 1) % job.poster_url.length
                    )
                  }
                  className="absolute right-4 text-white"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
