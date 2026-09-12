export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#12141A',
        panel: '#191C24',
        panelBorder: '#262A35',
        muted: '#9199A8',
        accent: '#6C7BFF',
        positive: '#3DDC97',
        negative: '#E8604C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};