import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="Hello world!" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg" />
      </Head>
      <props.Component />
    </>
  );
}