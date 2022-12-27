import { MessageClass } from "../routes/[university].tsx";
import Message from "./Message.tsx";
import { UniversityClass } from "../routes/[university].tsx";
import Link from "./Link.tsx";
import randBetween from "../scripts/randbetween.tsx";

interface MessageGridProps {
  messages?: MessageClass[] | null;
  university: UniversityClass | undefined;
  URL: URL | undefined;
}

export default function MessageGrid(props: MessageGridProps) {
  function compareMessageDate(a: MessageClass, b: MessageClass) {
    return (b.timeCreated.valueOf() - a.timeCreated.valueOf());
  }

  let sendURL;
  if (!(props.URL == undefined) && !(props.university == undefined)) {
    sendURL = new URL(props.URL?.origin + "/send");
    sendURL.searchParams.set("university", props.university?.shortName);
  } else {
    sendURL = "";
  }

  let messages = props.messages;
  messages = messages?.sort(compareMessageDate);
  const messagesPlacement: number[][] = [];

  const messagesLength = messages?.length ?? 0;
  let gridRows = Math.round(messagesLength / 2);
  let gridCols = messagesLength;


  if (gridCols < 2) {
    gridCols = 2;
  }
  if (gridRows < 2) { 
    gridRows = 2;
  }

  const divs: Array<preact.JSX.Element> = [];
  for (
    let i = 0;
    i <= (((gridCols * gridRows) - messagesLength) - 1);
    i++
  ) {
    divs.push(<div />);
  }

  if (messages == null) {
    return (
      <>
        <div>No messages available</div>
      </>
    );
  } else {
    return (
      <div
        class={"grid grid-cols-[repeat(" + gridCols +
          ",100svw)] grid-rows-[repeat(" + gridRows +
          ",minmax(100svh,auto))] justify-items-center items-start"}
      >
        <div class="p-7 text-center h-[100svh] flex justify-center items-center flex-col">
          <p>Welcome to the {props.university?.name} exhibition.</p>{" "}
          <p class="text-6xl  mb-4">
            Explore the exhibits by moving around the wall.
          </p>
          <div class="text-6xl">
            <Link href={sendURL}>Create an exhibit</Link>
          </div>
        </div>
        {divs}

        {messages.map((message) => {
          let tempPlacement: number[];
          while (true) {
            tempPlacement = [
              randBetween(1, gridRows),
              randBetween(1, gridCols),
            ];
            if (
              !messagesPlacement.find((element) => {
                if (
                  (element[0] == tempPlacement[0] &&
                    element[1] == tempPlacement[1])
                ) {
                  return true;
                }
              })
            ) {
              if (!(tempPlacement[0] == 1 && tempPlacement[1] == 1)) {
                messagesPlacement.push(tempPlacement);
                break;
              }
            }
          }

          return (
            <div
              class={"w-[100svw] flex items-start justify-start row-start-[" +
                tempPlacement[0] + "] col-start-[" + tempPlacement[1] + "]"}
            >
              <Message
                title={message.messageTitle}
                date={message.timeCreated}
                uuid={message.uuid}
                university={message.university.name}
              >
                {message.messageContent}
              </Message>
            </div>
          );
        })}
      </div>
    );
  }
}
