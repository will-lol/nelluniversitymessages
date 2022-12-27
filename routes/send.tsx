import Form from "../islands/form.tsx";
import { fetchUniversities } from "./[university].tsx";
import { Head } from "$fresh/runtime.ts";

const universities = await fetchUniversities();

export default function Send() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="exhibition.rocks is a place to share in an open gallery space."
        />
        <title>Create an exhibit</title>
      </Head>
      <div class="p-4">
        <h1 class="text-6xl font-bold mb-4">
          EXHIBIT <em>SOMETHING.</em>
        </h1>
        <div class="text-4xl leading-snug">
          <p>
            We placed exhibition sites around locations in Australia.
          </p>
          <p>
            We now invite you to exhibit at one of these sites.
          </p>
        </div>
        <Form universities={universities} />
      </div>
    </>
  );
}
