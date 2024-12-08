import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: '#4F46E5', 
				accent: '#F59E0B',  
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			boxShadow: {
				elevated: '0px 10px 15px rgba(0, 0, 0, 0.2)',
			},
			animation: {
				'slide-in': 'slide-in 0.5s ease-out',
			},
			keyframes: {
				'slide-in': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
		},
	},

	plugins: [],
} satisfies Config;
