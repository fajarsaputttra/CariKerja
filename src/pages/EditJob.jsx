import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Upload, Save, ArrowLeft } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [poster, setPoster] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (!error) setCategories(data);
  }

  async function fetchJob() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) setError("Data lowongan tidak ditemukan");
    else setJob(data);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let posterUrls = job.poster_url || [];

      if (poster && poster.length > 0) {
        for (const file of poster) {
          const fileName = `${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("posters")
            .upload(fileName, file);
          if (uploadError) throw new Error("Gagal upload poster baru");

          const { data: publicUrlData } = supabase.storage
            .from("posters")
            .getPublicUrl(fileName);

          posterUrls.push(publicUrlData.publicUrl);
        }
      }

      const { error } = await supabase
        .from("jobs")
        .update({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          apply_link: job.apply_link,
          poster_url: posterUrls,
          category_id: job.category_id,
          job_type: job.job_type,
        })
        .eq("id", id);

      if (error) throw new Error("Gagal memperbarui data");

      alert("✅ Data berhasil diperbarui!");
      navigate("/admin");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat data lowongan...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Lowongan Pekerjaan
          </h2>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#0A66C2] transition"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Judul */}
          <InputField
            label="Judul Pekerjaan"
            type="text"
            value={job.title || ""}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            placeholder="Contoh: Frontend Developer"
          />

          {/* Perusahaan */}
          <InputField
            label="Nama Perusahaan"
            type="text"
            value={job.company || ""}
            onChange={(e) => setJob({ ...job, company: e.target.value })}
            placeholder="Contoh: PT Digital Maju"
          />

          {/* Lokasi */}
          <InputField
            label="Lokasi"
            type="text"
            value={job.location || ""}
            onChange={(e) => setJob({ ...job, location: e.target.value })}
            placeholder="Contoh: Jakarta, Indonesia"
          />

          {/* Jenis Pekerjaan */}
          <SelectField
            label="Jenis Pekerjaan"
            value={job.job_type || ""}
            onChange={(e) => setJob({ ...job, job_type: e.target.value })}
            options={["Full Time", "Part Time", "Remote", "Contract"]}
          />

          {/* Kategori */}
          <SelectField
            label="Kategori Pekerjaan"
            value={job.category_id || ""}
            onChange={(e) => setJob({ ...job, category_id: e.target.value })}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />

          {/* Deskripsi */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Deskripsi
            </label>
            <textarea
              value={job.description || ""}
              onChange={(e) =>
                setJob({ ...job, description: e.target.value })
              }
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none min-h-[120px]"
              placeholder="Tuliskan deskripsi pekerjaan secara lengkap..."
            />
          </div>

          {/* Apply Link */}
          <InputField
            label="Link Pendaftaran"
            type="url"
            value={job.apply_link || ""}
            onChange={(e) => setJob({ ...job, apply_link: e.target.value })}
            placeholder="https://example.com/apply"
          />

          {/* Poster Preview */}
          {job.poster_url && job.poster_url.length > 0 && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Poster Saat Ini
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {job.poster_url.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Poster ${i}`}
                    className="rounded-lg border border-gray-200 shadow-sm object-cover w-full h-32"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload Baru */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Poster Baru (Opsional)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-[#0A66C2] hover:text-[#0A66C2] cursor-pointer transition">
              <Upload size={28} className="mb-2" />
              <span className="text-sm">
                Klik untuk memilih atau seret file ke sini
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPoster(Array.from(e.target.files))}
                className="hidden"
              />
            </label>
          </div>

          {/* Tombol */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Save size={18} />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- Komponen Reusable Modern --- */
function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none bg-white"
      >
        <option value="">Pilih Opsi</option>
        {options.map((opt, i) =>
          typeof opt === "string" ? (
            <option key={i} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}
