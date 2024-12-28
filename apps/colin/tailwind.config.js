/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./{src,components}/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
			fontFamily: {
				'display': ['Space Grotesk', 'sans-serif'],
				'body': ['Inter', 'sans-serif'],
			  },
			  fontSize: {
				'10xl': '10rem',
				'11xl': '12rem',
				'12xl': '14rem',
			  },
			  boxShadow: {
				'neon': '0 0 5px theme("colors.neon-blue"), 0 0 10px theme("colors.neon-blue")',
				'neon-strong': '0 0 10px theme("colors.neon-blue"), 0 0 20px theme("colors.neon-blue"), 0 0 30px theme("colors.neon-blue")',
				'cassette': '0 0 0 4px #000, 0 0 0 8px #fff, 0 0 20px rgba(255, 255, 255, 0.5)',
			  },
			  backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'noise': "url('/noise.png')",
			  },
			  animation: {
				'glitch': 'glitch 1s linear infinite',
				'scanline': 'scanline 10s linear infinite',
			  },
			  keyframes: {
				glitch: {
				  '0%': { transform: 'translate(0)' },
				  '20%': { transform: 'translate(-5px, 5px)' },
				  '40%': { transform: 'translate(-5px, -5px)' },
				  '60%': { transform: 'translate(5px, 5px)' },
				  '80%': { transform: 'translate(5px, -5px)' },
				  '100%': { transform: 'translate(0)' },
				},
				scanline: {
				  '0%': { transform: 'translateY(0%)' },
				  '100%': { transform: 'translateY(100%)' },
				},
			  },
    	}
    },
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require("tailwindcss-animate")
	],
  };