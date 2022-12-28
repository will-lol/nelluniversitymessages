import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="exhibition.rocks is a place to share in an open gallery space."/>
      </Head>
      <body class="flex items-center justify-center h-screen flex-col p-4">
        <h1 class="text-6xl mb-4 text-center">Welcome to exhibition.rocks</h1>
        <p class="text-center pb-4">This website is designed to be launched from a QR code at our exhibition sites.</p>
        <a href="https://fresh.deno.dev/"><img src="images/fresh-badge.svg" alt="Fresh badge" /></a>
      </body>
    </>
  );
}
