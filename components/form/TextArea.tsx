import { JSX } from "preact";

export default function TextArea(props: JSX.HTMLAttributes<HTMLTextAreaElement>) {
  return (
    <>
      <textarea
        class="text-base h-80 border border-black p-2 mb-4 rounded-none"
        {...props}
      />
    </>
  );
}
