import { MessageClass } from "../routes/[university].tsx";
import Message from "./Message.tsx";
import { UniversityClass } from "../routes/[university].tsx";
import Link from "./Link.tsx";

interface MessageGridProps {
  messages?: MessageClass[] | null;
  university: UniversityClass | undefined;
}

export default function MessageGrid(props: MessageGridProps) {
  function compareMessageDate(a: MessageClass, b: MessageClass) {
    return (b.timeCreated.valueOf() - a.timeCreated.valueOf());
  }

  let messages = props.messages;
  messages = messages?.sort(compareMessageDate);

  const messagesLength = messages?.length ?? 0;
  const gridRows = messagesLength / 2;
  const gridCols = messagesLength;

  let divs: Array<preact.JSX.Element> = [];
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
            <Link href="send">Add an exhibit</Link>
          </div>
        </div>
        {divs}
        {messages.map((message) => {
          return (
            <div class="w-[100svw] flex items-start justify-start">
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
