import { MessageClass } from "../routes/[university].tsx";
import Message from "./Message.tsx"

interface MessageListProps {
  messages?: MessageClass[];
}

export default function MessageList(props: MessageListProps) {
  if (props.messages == null) {
    return (
      <>
        <div>No messages available</div>
      </>
    );
  } else {
    return (
        <ul>
            {props.messages.map((message) => {
                return <li><Message date={message.timeCreated} uuid={message.uuid} university={message.university.name}>{message.messageContent}</Message></li>
            })}
        </ul>
      );    
  }
}
