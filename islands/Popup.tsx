import {
  useId,
} from "preact/hooks";
import { JSXInternal } from "preact/src/jsx.d.ts";

interface Props {
  id: string;
}

export default function Popup(props: Props) {
  const link = useId();
  function click(e: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) {
    const elem = document.getElementById(props.id);
    const linkElem = document.getElementById(link);

    elem?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    if (linkElem) {
      linkElem.style.display = "none";
    }
  }

  return (
    <div class="absolute bottom-0 p-4 w-full">
      <a
        id={link}
        onClick={click}
        href={"#" + props.id}
        class="transition-transform rounded-full border border-black border-solid border-opacity-30  p-2 bg-white flex justify-end shadow"
      >
        <div class="flex items-center" href={"#" + props.id}>
          Jump to your exhibit
          <svg
            class="mx-1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
          >
            <path d="m10 16-1-1 4-4H4V9h9L9 5l1-1 6 6Z" />
          </svg>
        </div>
      </a>
    </div>
  );
}
