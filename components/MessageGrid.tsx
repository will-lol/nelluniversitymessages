import { MessageClass } from "../routes/[university].tsx";
import Message from "./Message.tsx";
import { UniversityClass } from "../routes/[university].tsx";
import Button from "./Button.tsx";

interface MessageGridProps {
  messages?: MessageClass[] | null;
  university: UniversityClass | undefined;
}

export default function MessageGrid(props: MessageGridProps) {
  function compareMessageDate(a: MessageClass, b: MessageClass) {
    return (b.timeCreated.valueOf() - a.timeCreated.valueOf());
  }

  let messages = props.messages;
  messages = messages?.sort(compareMessageDate) 

  let gridRows = messages?.length ?? 0;
  let gridCols = gridRows*3;
  

  if (messages == null) {
    return (
      <>
        <div>No messages available</div>
      </>
    );
  } else {
    return (
        <div class={"grid grid-cols-[repeat(" + gridCols + ",100svw)] grid-rows-[repeat(" + gridRows + ",100svh)] justify-items-center items-center"}>
          <div class="p-7 text-center"><p>Welcome to the {props.university?.name} exhibition.</p> <p class="mb-4">Explore the exhibits by moving around the wall.</p> <a href="send"><Button>Add an exhibit</Button></a></div>
            {messages.map((message) => {
                return <><Message title={message.messageTitle} date={message.timeCreated} uuid={message.uuid} university={message.university.name}>{message.messageContent}</Message></>
            })}
        </div>
      );    
  }
}
