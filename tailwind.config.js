/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    teal: '#1FB5A3',
                    electricTeal: '#2DE2C8',
                    tealDeep: '#0F766E',
                    tealDark: '#0B3B3C',
                    sky: '#3B9BD4',
                    skyLight: '#E8F5FD',
                    coral: '#FF6B35',
                    coralHover: '#F05820',
                    lime: '#C6F432',
                    sunny: '#FFC857',
                    mint: '#F3FBF9',
                    mintLight: '#E6F8F4',
                    lavender: '#F4F0FF',
                    peach: '#FFF2EB',
                    heading: '#0F172A',
                    body: '#334155',
                    muted: '#64748B',
                    // Dark gym tones
                    charcoal: '#0E1420',
                    navy: '#111B2E',
                    steel: '#1E293B',
                    gunmetal: '#2A3547',
                    darkText: '#F8FAFC',
                    darkMuted: '#CBD5E1',
                },
                primary: '#1FB5A3',
                dark: '#0E1420',
                light: '#F3FBF9',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
                display: ['Syne', 'Plus Jakarta Sans', 'Outfit', 'sans-serif'],
                athletic: ['Oswald', 'Outfit', 'sans-serif'],
            },
            boxShadow: {
                'soft-sm': '0 2px 8px rgba(15, 23, 42, 0.04)',
                'soft-md': '0 10px 30px rgba(15, 23, 42, 0.06)',
                'soft-lg': '0 20px 45px rgba(15, 23, 42, 0.08)',
                'teal-glow': '0 10px 30px rgba(31, 181, 163, 0.35)',
                'coral-glow': '0 10px 30px rgba(255, 107, 53, 0.4)',
                'electric-glow': '0 0 25px rgba(45, 226, 200, 0.4)',
                'dark-card': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            },
            animation: {
                blob: "blob 9s infinite",
                float: "float 6s ease-in-out infinite",
                'float-slow': "float 8s ease-in-out infinite",
                'pulse-subtle': "pulseSubtle 3s ease-in-out infinite",
                'shine': "shine 2.5s ease-in-out infinite",
                'spin-slow': "spin 15s linear infinite",
            },
            keyframes: {
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -30px) scale(1.08)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                pulseSubtle: {
                    "0%, 100%": { transform: "scale(1)", opacity: "1" },
                    "50%": { transform: "scale(1.04)", opacity: "0.9" },
                },
                shine: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                }
            },
        },
    },
    plugins: [],
}
