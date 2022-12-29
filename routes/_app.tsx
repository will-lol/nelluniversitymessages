import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="E0E0E0"/>
        <meta name="description" content="Hello world!" />
        <link rel="shortcut icon" href="/images/favicon.svg" type="image/svg" />
        <style>
          {"html {scroll-behavior: smooth;}"}
        </style>
      </Head>
      <props.Component/>
    </>
  );
}