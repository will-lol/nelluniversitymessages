import { useEffect, useRef, useState } from "preact/hooks";
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
          //this code only applies if the placeholder has finished typing and is now deleting
          interval = 50;  //set interval to be lower because deleting is usually quicker

          if (stringArrayPos > 0) { //if its not fully deleted,
            currentString = currentString.substring(  //get the next substring
              0,
              currentString.length - 1,
            );

            setPlaceholder(currentString);  //commit changes to placeholder
            stringArrayPos--; //decrement stringArrayPos
          } else {  //if its deleted,
            deleteFlag = false; //disable delete flag

            if (placeholderArrayPos == (placeholderArray.length - 1)) {
              placeholderArrayPos = 0;  //go back to first string if we have just seen the last one
            } else {
              placeholderArrayPos++;  //otherwise, go to the next string
            }

            stringArray = Array.from(placeholderArray[placeholderArrayPos]);  //create a char array from our new string!
            interval = 100; //set placeholder back to normality
          }

        } else if (stringArrayPos < stringArray.length) {
          //THIS code applies if the placeholder is still typing
          currentString = currentString.concat(stringArray[stringArrayPos]);  //add the next char
          
          setPlaceholder(currentString);  //commit
          stringArrayPos++; //increment stringArrayPos
        } else {  //if its finished
          interval = 1000;  //ponder on the result
          deleteFlag = true;  //commence the deletion
        }
        setTimeout(animation, interval);
      }
      animation();
    });
  }

  return (
    <>
      <textarea
        placeholder={placeholderArray.length > 0
          ? placeholder
          : props.placeholder}
        class="text-base h-80 border border-black p-2 mb-4 rounded-none"
        {...props}
      />
    </>
  );
}
