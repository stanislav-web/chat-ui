  /** @type {import('tailwindcss').Config} */
  const defaultTheme = require('tailwindcss/defaultTheme');

  module.exports = {
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
      theme: {
          screens: {
              sm: '480px',
              md: '768px',
              lg: '976px',
              xl: '1440px',
          },
          extend: {
              fontFamily: {
                  sans: ['Inter var', ...defaultTheme.fontFamily.sans],
              },
              spacing: {
                  '128': '32rem',
                  '144': '36rem',
              },
              borderRadius: {
                  '4xl': '2rem',
              }
          },
      },
    plugins: [require('flowbite/plugin')],
  };
