/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                cream: '#FDFAF6',
                linen: '#F5EEE8',
                sand: '#EDE0D4',
                terracotta: {
                    DEFAULT: '#9E6B5A',
                    light: '#B8897A',
                    dark: '#7A4F3F',
                },
                sage: {
                    DEFAULT: '#7B9D7E',
                    light: '#A8C4AB',
                },
                brown: '#4A3728',
                taupe: '#8B7355',
            },
            fontFamily: {
                display: ['Cormorant Garamond', 'Georgia', 'serif'],
                body: ['Jost', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                pill: '50px',
            },
            boxShadow: {
                sm: '0 2px 12px rgba(90,60,40,.08)',
                md: '0 8px 32px rgba(90,60,40,.12)',
                lg: '0 20px 60px rgba(90,60,40,.16)',
            },
        },
    },
    plugins: [],
};
