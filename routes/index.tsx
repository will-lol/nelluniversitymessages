import { Head } from "$fresh/runtime.ts";
import Button from "../components/Button.tsx"

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <h1 class="text-5xl">Welcome to nellbradshawisawesome</h1>
      <p class="my-6">You have landed on a project in progress.</p>
      <p>Coming soon.</p>
      <Button>hi im a button</Button>
    </>
  );
}
