import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			fontFamily: {
				istok: ['var(--font-istok-web)'],
			},
			fontSize: {
				h1: ['72px', { lineHeight: '103.6px', fontWeight: '700' }],
				h2: ['64px', { lineHeight: '86.4px', fontWeight: '700' }],
				h3: ['48px', { lineHeight: '58px', fontWeight: '700' }],
				h4: ['32px', { lineHeight: '46.1px', fontWeight: '700' }],
				p1: ['32px', { lineHeight: '46.1px', fontWeight: '400' }],
				p2: ['28px', { lineHeight: '40.3px', fontWeight: '400' }],
				p3: ['24px', { lineHeight: '34.5px', fontWeight: '400' }],
				p4: ['20px', { lineHeight: '28.8px', fontWeight: '400' }],
			},
			colors: {
				black: '#000000',
				white: '#FFFFFF',
				red: '#CC0000',
				blue: '#17A5D3',
				dark_grey: '#979797',
				light_grey: '#EEEEEE',
			},
			spacing: {
				none: '0',
				'1': '1px',
				'2': '2px',
				'4': '4px',
				'8': '8px',
				'12': '12px',
				'16': '16px',
				'20': '20px',
				'24': '24px',
				'32': '32px',
				'48': '48px',
				'64': '64px',
			},
			borderRadius: {
				none: '0px',
				sm: '5px',
				md: '10px',
				lg: '20px',
			},
		},
	},
	plugins: [],
};
export default config;
