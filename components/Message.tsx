import { PreactDOMAttributes } from "preact";
import { timeElapsedString } from "../scripts/dateformatter.tsx";

interface MessageProps {
    title: string,
    date: Date,
    uuid: string,
    university: string,
    children: PreactDOMAttributes["children"]
}

export default function Message(props: MessageProps) {
    return (
        <div class="w-screen-pad h-screen-pad bg-white shadow-message border border-black border-opacity-30 p-6">
            <h1 class="text-4xl break-all mb-4 font-medium">{props.uuid}</h1>
            <h2 class="text-xl font-medium mb-4"><em>{props.title}</em>, <span class="font-normal">{timeElapsedString(props.date)}</span></h2>
            <p class="text-base">{props.children}</p>
        </div>
    );
}