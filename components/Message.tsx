import { PreactDOMAttributes } from "preact";
import { timeElapsedString } from "../scripts/dateformatter.tsx";

interface MessageProps {
    date: Date,
    uuid: string,
    university: string,
    children: PreactDOMAttributes["children"]
}

export default function Message(props: MessageProps) {
    return (
        <div>
            <p>{props.children}</p>
            <div>Date created: {timeElapsedString(props.date)}</div>
            <div>User ID: {props.uuid}</div>
            <div>University: {props.university}</div>
        </div>
    );
}