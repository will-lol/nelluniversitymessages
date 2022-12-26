import Form from "../islands/form.tsx";
import { fetchUniversities } from "./[university].tsx";

const universities = await fetchUniversities();

export default function Send() {
  return (
    <div class="p-4">
      <h1 class="text-6xl font-bold mb-4">EXHIBIT <em>SOMETHING.</em></h1>
      <div class="text-4xl leading-snug">
        <p>
          We placed exhibition sites around Australian universities.
        </p>
        <p>
          We now invite you to exhibit at one of these sites.
        </p>
      </div>
      <Form universities={universities} />
    </div>
  );
}
