import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        party: {
          dark: "#0F0C20",
          card: "#181432",
          cardHover: "#231D45",
          purple: "#8B5CF6",
          pink: "#EC4899",
          cyan: "#06B6D4",
          amber: "#F59E0B",
          accent: "#A855F7"
        }
      },
      backgroundImage: {
        'party-gradient': 'linear-gradient(135deg, #1A0B2E 0%, #0D061A 50%, #160D27 100%)',
        'neon-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.15) 35%, transparent 70%)',
      }
    },
  },
  plugins: [],
};
export default config;
