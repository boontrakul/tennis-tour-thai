import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // สั่งให้สแกนครอบคลุมทุกโฟลเดอร์ ไม่ว่าจะวางไฟล์ไว้ตรงไหนของโปรเจกต์!
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;