import type { Config } from 'tailwindcss';

/**
 * Palette "Kem & Đất nung" (terracotta) — định nghĩa bằng RGB triplet trong
 * globals.css (:root) để hỗ trợ opacity modifier của Tailwind (vd bg-accent/10).
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
        tint: 'rgb(var(--tint) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        arch: '45% 45% 6px 6px / 30% 30% 4px 4px',
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(176, 106, 79, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(176, 106, 79, 0.16)',
        'glass-lg': '0 20px 50px 0 rgba(42, 38, 34, 0.12)',
        'glass-glow': '0 0 25px 0 rgba(176, 106, 79, 0.3)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fluid-blob': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.15)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'fluid-blob-reverse': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-30px, 40px) scale(1.1)' },
          '66%': { transform: 'translate(25px, -30px) scale(0.95)' },
        },
        'marquee-left': {
          // Track chứa danh sách LẶP HAI LẦN; đi từ 0% -> -50% là lướt hết
          // đúng một bản rồi lặp liền mạch (không giật) — xem NewArrivalsSection.
          // Chiều phải -> trái (translateX giảm dần).
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'promo-glow': {
          '0%, 100%': {
            color: 'rgb(196 40 40)',
            textShadow: '0 0 0 rgba(196, 40, 40, 0)',
          },
          '50%': {
            color: 'rgb(163 26 26)',
            textShadow: '0 0 14px rgba(196, 40, 40, 0.45)',
          },
        },
        'promo-badge-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(196, 40, 40, 0.5)',
            backgroundColor: 'rgba(196, 40, 40, 0.07)',
            borderColor: 'rgba(196, 40, 40, 0.35)',
          },
          '50%': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 28px 6px rgba(196, 40, 40, 0.35)',
            backgroundColor: 'rgba(196, 40, 40, 0.14)',
            borderColor: 'rgba(196, 40, 40, 0.7)',
          },
        },
        'promo-icon-bounce': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.2) rotate(-8deg)' },
          '50%': { transform: 'scale(1.05) rotate(6deg)' },
          '75%': { transform: 'scale(1.2) rotate(-4deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease both',
        'fluid-blob': 'fluid-blob 18s infinite ease-in-out',
        'fluid-blob-slow': 'fluid-blob-reverse 24s infinite ease-in-out',
        'marquee-left': 'marquee-left 24s linear infinite',
        'promo-glow': 'promo-glow 1.6s ease-in-out infinite',
        'promo-badge-glow': 'promo-badge-glow 1.6s ease-in-out infinite',
        'promo-icon-bounce': 'promo-icon-bounce 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
