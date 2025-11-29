# 🧭 CariKerja — Modern Job Finder Platform

CariKerja adalah platform pencarian lowongan kerja modern berbasis web, dibangun menggunakan **React**, **Vite**, dan **Supabase**.  
Aplikasi ini dirancang untuk menyediakan pengalaman cepat, responsif, dan mudah digunakan, baik untuk pencari kerja maupun admin pengelola lowongan.

---

# 🚀 Tech Stack

### **Frontend**
- React + Vite
- TailwindCSS (optional)
- React Router DOM
- React Icons
- Context API / Custom Hooks

### **Backend**
- Supabase (Database, Auth, Storage)

### **Deployment**
- Netlify (Frontend)
- Supabase Hosting (Backend)

---

---

# 🛠️ Installation & Setup

### 1. Clone Repository

git clone https://github.com/fajarsaputttra/CariKerja.git

cd CariKerja


### 2. Install Dependencies

npm install


### 3. Setup Environment Variables

Buat file `.env`:

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key


> 🔒 `.env` sudah di-ignore, jadi aman dari GitHub.

---

# 🔌 Supabase Client

File: `src/lib/supabaseClient.js`

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

## ▶️ Jalankan Server

npm run dev

http://localhost:5173
