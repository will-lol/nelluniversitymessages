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
        fontFamily: "'Archivo Narrow'",
        fontStyle: "normal",
        fontWeight: "400 700",
        src: [
          'url("./fonts/ArchivoNarrow-Variable.woff2") format("woff2")',
          'url("./fonts/ArchivoNarrow-Variable.woff") format("woff")'
        ]
      },
      {
        fontFamily: "'Archivo Narrow'",
        fontStyle: "italic",
        fontWeight: "400 700",
        src: [
          'url("./fonts/ArchivoNarrow-Italic-Variable.woff2") format("woff2")',
          'url("./fonts/ArchivoNarrow-Italic-Variable.woff") format("woff")'
        ]
      },
    ],

    body: apply`font-sans dark:bg-black text-black font-normal dark:text-white`,
  },
  theme: {
    fontFamily: {
      sans: '"Archivo Narrow", Impact, "Haettenschweiler", "Franklin Gothic Bold", Charcoal, "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", sans-serif',
    },
    colors: {
      gray: colors.trueGray,
      black: colors.black,
      white: colors.white,
      blue: colors.blue,
      wallGray: "#E0E0E0"
    },
    extend: {
      backgroundImage: {
        "wall-texture": "url('./images/texture.jpg')",
      },
      backgroundSize: {
        "small": "540px",
      },
      boxShadow: {
        "message": "0px 50px 45px rgba(0, 0, 0, 0.12), 0px 8.9px 16.4px rgba(0, 0, 0, 0.083), 0px 3.7px 8px rgba(0, 0, 0, 0.067), 0px 1.8px 3.9px rgba(0, 0, 0, 0.053), 0px 0.8px 1.5px rgba(0, 0, 0, 0.012)"
      },
      //GRID
        gridTemplateColumns: {

        }
      //END GRID
    },
  },
} as Options;
