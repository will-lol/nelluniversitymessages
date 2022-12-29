import { useState, useEffect, useRef } from "preact/hooks";
import { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  placeholderArray?: string[];
}

export default function TextArea(props: Props) {
  const [placeholder, setPlaceholder] = useState("");

  let placeholderArray: string[];
  if (props.placeholderArray) {
    placeholderArray = props.placeholderArray;
  } else {
    placeholderArray = [];
  }

  let flag = false;
  function handleFocus() {
    flag = true;
  }

  if (placeholderArray.length > 0) {
    const cancelEffect = useRef(false);
    useEffect(() => {
      if (cancelEffect.current) {
        return;
      }
      cancelEffect.current = true;
      let interval = 100;
      let stringArray: string[] = Array.from(placeholderArray[0]);
      let stringArrayPos = 0;
      let placeholderArrayPos = 0;
      let currentString = "";
      let deleteFlag = false;

      function animation() {  
        if (deleteFlag) {
          interval = 50;
          if (stringArrayPos > 0) {
            currentString = currentString.substring(0, currentString.length - 1);
            setPlaceholder(currentString);
            stringArrayPos--;
          } else {
            deleteFlag = false;

            if (placeholderArrayPos == (placeholderArray.length-1)) {
              placeholderArrayPos = 0;
            } else {
              placeholderArrayPos++;
            }
            stringArray = Array.from(placeholderArray[placeholderArrayPos]);
          }
        } else if (stringArrayPos < stringArray.length) {
          interval = 100;
          currentString = currentString.concat(stringArray[stringArrayPos]);
          setPlaceholder(currentString);
          stringArrayPos++
        } else {
          interval = 1000;
          deleteFlag = true;
        }
        setTimeout(animation, interval);
      }
      animation();
    })
  }

  return (
    <>
      <textarea
        onFocus={handleFocus}
        placeholder={placeholderArray.length > 0
          ? placeholder
          : props.placeholder}
        class="text-base h-80 border border-black p-2 mb-4 rounded-none"
        {...props}
      />
    </>
  );
}
