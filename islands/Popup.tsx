import {
  useId,
} from "preact/hooks";
import { JSXInternal } from "preact/src/jsx.d.ts";

interface Props {
  id: string;
}

export default function Popup(props: Props) {
  const link = useId(); //bad practise

  //this function just zips the user over to their recently submitted exhibit and removes the url param and hash.
  function click(e: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) {
    const elem = document.getElementById(props.id);
    const linkElem = document.getElementById(link);

    const url = new URL(window.location.href);

    elem?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    if (linkElem) {
      linkElem.style.display = "none";
    }

    url.searchParams.delete("id");
    setTimeout(() => {history.replaceState(null, "", url);}, 100);  //for some reason scrollIntoView adds a hash some time after it is called. for this reason, we have to use a delay.
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
