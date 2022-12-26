import { JSX } from "preact";

export default function Error(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div
        class="text-red-700 mb-4"
        {...props}
      />
    </>
  );
}
