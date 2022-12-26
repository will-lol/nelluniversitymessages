import { JSX } from "preact";

export default function Select(props: JSX.HTMLAttributes<HTMLSelectElement>) {
  return (
    <>
      <select
        class="text-sm mb-4 p-2 border border-black rounded-none"
        {...props}
      />
    </>
  );
}
