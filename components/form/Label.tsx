import { JSX } from "preact";

export default function Label(props: JSX.HTMLAttributes<HTMLLabelElement>) {
  return (
    <>
      <label
        class="text-sm"
        {...props}
      />
    </>
  );
}
