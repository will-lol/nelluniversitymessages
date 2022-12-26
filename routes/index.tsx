import { Head } from "$fresh/runtime.ts";
import Button from "../components/Button.tsx"

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <body class="flex items-center justify-center h-screen flex-col">
        <h1 class="text-6xl mb-4">Welcome to exhibition.rocks</h1>
        <p>This website is designed to be launched from a QR code at our exhibition sites.</p>
      </body>
    </>
  );
}
