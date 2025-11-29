import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  LogOut,
  Edit,
  Upload,
  Tag,
  Briefcase,
  Building2,
  MapPin,
  Link2,
  Clock,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 🔒 ambil dari context Auth
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    apply_link: "",
    category_id: "",
    job_type: "Full Time",
  });
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPosters, setShowPosters] = useState(true);

  const jobTypes = ["Full Time", "Part Time", "Remote", "Contract"];

  // 🔐 Cek auth token di awal
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        navigate("/login");
        return;
      }

      fetchJobs();
      fetchCategories();
    }

    checkSession();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, categories(name)")
      .order("id", { ascending: false });
    if (!error) setJobs(data || []);
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (!error) setCategories(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let posterUrls = [];

      if (poster && poster.length > 0) {
        for (const file of poster) {
          const fileName = `${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("posters")
            .upload(fileName, file);
          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("posters")
            .getPublicUrl(fileName);

          posterUrls.push(publicUrlData.publicUrl);
        }
      }

      const { error } = await supabase.from("jobs").insert([
        {
          title: form.title,
          company: form.company,
          location: form.location,
          description: form.description,
          apply_link: form.apply_link,
          category_id: form.category_id ? parseInt(form.category_id) : null,
          job_type: form.job_type,
          poster_url: posterUrls,
        },
      ]);

      if (error) throw error;

      alert("✅ Lowongan berhasil ditambahkan!");
      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        apply_link: "",
        category_id: "",
        job_type: "Full Time",
      });
      setPoster(null);
      fetchJobs();
    } catch (err) {
      alert("❌ Gagal menyimpan data!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 🔐 Logout aman dengan Supabase JWT
  async function handleLogout() {
    try {
      await supabase.auth.signOut(); // hapus sesi Supabase
      logout(); // hapus dari context (kalau ada)
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0A66C2]">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* 🔹 Statistik */}
      <section className="max-w-5xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
        {[
          {
            icon: <Briefcase size={22} />,
            title: "Total Lowongan",
            value: jobs.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: <Layers size={22} />,
            title: "Kategori",
            value: categories.length,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            icon: <ImageIcon size={22} />,
            title: "Poster",
            value: jobs.filter((j) => j.poster_url?.length > 0).length,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-5 rounded-2xl shadow-sm ${stat.bg}`}
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <h3 className="text-sm text-gray-600">{stat.title}</h3>
              <p className={`text-3xl font-semibold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 🔹 Form Tambah Lowongan */}
      <section className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <PlusCircle className="text-blue-600" /> Tambah Lowongan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              icon={<Briefcase size={16} />}
              placeholder="Judul Pekerjaan"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <InputField
              icon={<Building2 size={16} />}
              placeholder="Nama Perusahaan"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <InputField
              icon={<MapPin size={16} />}
              placeholder="Lokasi"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <InputField
              icon={<Link2 size={16} />}
              placeholder="Link Apply"
              value={form.apply_link}
              onChange={(e) => setForm({ ...form, apply_link: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectModern
              label="Kategori"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            />
            <SelectModern
              label="Jenis Pekerjaan"
              options={jobTypes.map((t) => ({ value: t, label: t }))}
              value={form.job_type}
              onChange={(e) => setForm({ ...form, job_type: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Deskripsi pekerjaan"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none min-h-[120px] text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label
            htmlFor="poster-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl py-8 cursor-pointer hover:bg-blue-50 transition"
          >
            <Upload className="text-blue-500 mb-2" size={30} />
            <span className="text-gray-600 text-sm">
              Klik atau seret file untuk upload poster
            </span>
            <input
              id="poster-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPoster(Array.from(e.target.files))}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A66C2] text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Mengunggah..." : "Tambah Lowongan"}
          </button>
        </form>
      </section>

      {/* 🔹 Daftar Lowongan */}
      <section className="max-w-5xl mx-auto mt-12 px-6 pb-20">
        <div className="flex items-center justify-end mb-6 gap-3">
          <span className="text-sm text-gray-600 font-medium">
            {showPosters ? "Sembunyikan Poster" : "Tampilkan Poster"}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showPosters}
              onChange={() => setShowPosters(!showPosters)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/admin/edit/${job.id}`)}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {job.company} • {job.location}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.categories?.name && (
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Tag size={12} /> {job.categories.name}
                      </span>
                    )}
                    {job.job_type && (
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Clock size={12} /> {job.job_type}
                      </span>
                    )}
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                  <Edit size={18} /> Edit
                </button>
              </div>

              {showPosters && job.poster_url?.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {job.poster_url.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${job.title}-${i}`}
                      className="rounded-xl h-24 object-cover w-full shadow-sm hover:scale-[1.03] transition"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* Components */
function InputField({ icon, placeholder, value, onChange, required }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-xl pl-10 p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}

function SelectModern({ label, options, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none border w-full py-3 px-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 hover:bg-gray-100 transition pr-10"
          required
        >
          <option value="">Pilih {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
}