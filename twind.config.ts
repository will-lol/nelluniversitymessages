import { Options } from "$fresh/plugins/twind.ts";
import { strict, apply } from 'twind';
import { content } from 'twind-content';
import * as colors from 'twind/colors';

export default {
  selfURL: import.meta.url,
  mode: strict,
  plugins: {
    content
  },
  preflight: {
    "@font-face": [
      {
        fontFamily: "Libre Franklin",
        fontWeight: 400,
        src:
          'url(./static/fonts/libre-franklin-v13-latin-regular.woff) format("woff")',
      },
      {
        fontFamily: "Libre Franklin",
        fontWeight: 500,
        src:
          'url(./static/fonts/libre-franklin-v13-latin-500.woff) format("woff")',
      },
    ],

    body: apply`font-sans bg-gray-200 dark:bg-gray-800 text-black dark:text-white`,
  },
  theme: {
    fontFamily: {
      sans: "Libre Franklin, sans-serif",
    },
    colors: {
      gray: colors.trueGray,
      black: colors.black,
      white: colors.white
    },
  },
} as Options;
