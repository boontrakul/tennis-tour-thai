import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // 👈 บรรทัดนี้สำคัญที่สุด! มันคือการสั่งให้สแกนโฟลเดอร์ app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;