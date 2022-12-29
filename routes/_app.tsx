import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

//this just defines some defaults for all pages (favicon, browser specific meta tags (sigh), seo stuff (sigh))
export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="E0E0E0" />
        <meta
          name="description"
          content="exhibition.rocks is a place to share in an open gallery space."
        />{" "}
        <link rel="shortcut icon" href="/images/favicon.svg" type="image/svg" />
        <style>
          {"html {scroll-behavior: smooth;}"}
        </style>
      </Head>
      <props.Component />
    </>
  );
}
