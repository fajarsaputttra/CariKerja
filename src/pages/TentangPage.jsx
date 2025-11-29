import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Briefcase, Users } from "lucide-react";
import emailjs from "emailjs-com";

const TentangPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      time: new Date().toLocaleString("id-ID"),
    };

    try {
      await emailjs.send(
        "service_tp2ukgc",
        "template_gs66n7e",
        templateParams,
        "rxMA5aVEPqFZeBZcw"
      );
      setSent(true);
    } catch (error) {
      console.error("Email gagal dikirim:", error);
    } finally {
      setLoading(false);
    }
  };

  // === Template Email HTML (yang dikirim ke admin)
  const emailTemplate = `
<div
  style="
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f4f7fb;
    padding: 40px 0;
    color: #2c3e50;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #0a66c2, #004182);
        color: #ffffff;
        padding: 24px 30px;
        text-align: center;
      "
    >
      <h1 style="margin: 0; font-size: 22px; letter-spacing: 0.5px">
        ✉️ Saran Baru untuk <span style="font-weight: 700">Carikerja</span>
      </h1>
      <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9">
        Diterima pada {{time}}
      </p>
    </div>

    <div style="padding: 28px 30px">
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="border-collapse: collapse"
      >
        <tr>
          <td style="width: 60px; vertical-align: top">
            <div
              style="
                width: 48px;
                height: 48px;
                background-color: #e8f1ff;
                border-radius: 50%;
                text-align: center;
                line-height: 48px;
                font-size: 24px;
              "
            >
              👤
            </div>
          </td>
          <td style="vertical-align: top; padding-left: 12px">
            <div style="font-size: 16px; font-weight: 600; color: #004182">
              {{name}}
            </div>
            <div
              style="font-size: 13px; color: #6b7280; margin-bottom: 10px"
            >
              {{email}}
            </div>
          </td>
        </tr>
      </table>

      <div
        style="
          margin-top: 20px;
          padding: 18px;
          background-color: #f9fbfe;
          border-left: 4px solid #0a66c2;
          border-radius: 10px;
          font-size: 15px;
          line-height: 1.6;
        "
      >
        {{message}}
      </div>
    </div>

    <div
      style="
        background-color: #f1f5fb;
        text-align: center;
        padding: 16px;
        font-size: 13px;
        color: #6b7280;
        border-top: 1px solid #e5eaf1;
      "
    >
      <p style="margin: 0">
        Email ini dikirim otomatis oleh sistem <b>Carikerja</b>.<br/>
        Jika ini bukan untuk Anda, silakan abaikan pesan ini.
      </p>
      <p style="margin-top: 6px; font-size: 12px; color: #9ca3af">
        © 2025 Carikerja — Indonesia Tanpa Pengangguran 💙
      </p>
    </div>
  </div>
</div>`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/10 via-[#004182]/10 to-transparent"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-[#004182]"
          >
            Tentang <span className="text-[#0A66C2]">Carikerja</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed"
          >
            Carikerja hadir untuk membantu para pencari kerja di Indonesia
            menemukan pekerjaan impian mereka dengan lebih cepat dan
            persiapan yang matang. Kami percaya bahwa setiap orang berhak
            mendapatkan kesempatan karier terbaik sesuai potensinya.
          </motion.p>
        </div>
      </section>

      {/* ===== VISI MISI ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <motion.div whileHover={{ y: -6 }} className="p-8 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
            <Briefcase className="w-10 h-10 text-[#0A66C2] mx-auto mb-4" />
            <h3 className="font-bold text-lg text-[#004182] mb-2">Visi Kami</h3>
            <p className="text-gray-600">
              Menjadi platform terpercaya yang mempercepat proses pencarian kerja
              dan membantu individu mempersiapkan diri menghadapi dunia profesional.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="p-8 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
            <Users className="w-10 h-10 text-[#0A66C2] mx-auto mb-4" />
            <h3 className="font-bold text-lg text-[#004182] mb-2">Misi Kami</h3>
            <p className="text-gray-600">
              Menghubungkan talenta terbaik dengan perusahaan berkualitas melalui
              informasi lowongan yang relevan, artikel inspiratif, dan fitur persiapan karier.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="p-8 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
            <MapPin className="w-10 h-10 text-[#0A66C2] mx-auto mb-4" />
            <h3 className="font-bold text-lg text-[#004182] mb-2">Fokus Kami</h3>
            <p className="text-gray-600">
              Membantu jobseeker berkembang tidak hanya mendapatkan pekerjaan,
              tapi juga memahami cara menjadi profesional unggul di tempat kerja.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FORM SARAN ===== */}
      <section className="py-20 bg-gradient-to-br from-[#004182] to-[#0A66C2] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Beri Kami <span className="text-blue-200">Masukan</span>
          </h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto">
            Kami selalu terbuka terhadap saran dan ide baru untuk menjadikan
            Carikerja lebih bermanfaat bagi seluruh pencari kerja di Indonesia.
          </p>

          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-2xl mx-auto space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Nama kamu" onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/20 placeholder-blue-100 text-white focus:outline-none focus:ring-2 focus:ring-blue-300" required />
              <input type="email" name="email" placeholder="Email kamu" onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/20 placeholder-blue-100 text-white focus:outline-none focus:ring-2 focus:ring-blue-300" required />
            </div>
            <textarea name="message" placeholder="Tulis saranmu di sini..." rows="4" onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 placeholder-blue-100 text-white focus:outline-none focus:ring-2 focus:ring-blue-300" required></textarea>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#004182] font-semibold hover:bg-blue-100 transition-all duration-300 shadow-md"
            >
              {loading ? "Mengirim..." : <><Send className="w-4 h-4" /> Kirim Saran</>}
            </button>

            {sent && (
              <p className="text-green-200 font-medium mt-4">
                ✅ Terima kasih! Saranmu sudah kami terima.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ===== MAPS SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[#004182] mb-6">
            Lokasi Kami
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Kami berbasis di Indonesia dan terus berupaya menghadirkan solusi digital
            yang memudahkan para pencari kerja dari seluruh nusantara.
          </p>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-blue-100">
            <iframe
              title="Lokasi Carikerja"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127101.57230405744!2d105.18833647470572!3d-5.428495619363404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da46f3aa6fbf%3A0x3039d80b220cc40!2sBandar%20Lampung%2C%20Bandar%20Lampung%20City%2C%20Lampung!5e0!3m2!1sen!2sid!4v1760825516263!5m2!1sen!2sid"
              width="100%"
              height="400"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TentangPage;
