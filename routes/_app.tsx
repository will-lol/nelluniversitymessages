import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";
import { theme } from "twind/css";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="E0E0E0"/>
        <meta name="description" content="Hello world!" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg" />
      </Head>
      <props.Component/>
    </>
  );
}