import { MessageClass } from "../routes/[university].tsx";
import Message from "./Message.tsx"

interface MessageListProps {
  messages?: MessageClass[];
}

export default function MessageList(props: MessageListProps) {
  function compareMessageDate(a: MessageClass, b: MessageClass) {
    return (b.timeCreated.valueOf() - a.timeCreated.valueOf());
  }

  let messages = props.messages;
  messages = messages?.sort(compareMessageDate) 

  if (messages == null) {
    return (
      <>
        <div>No messages available</div>
      </>
    );
  } else {
    return (
        <ul>
            {messages.map((message) => {
                return <li><Message date={message.timeCreated} uuid={message.uuid} university={message.university.name}>{message.messageContent}</Message></li>
            })}
        </ul>
      );    
  }
}
