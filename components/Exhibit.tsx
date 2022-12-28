import { PreactDOMAttributes } from "preact";
import { Location } from "../routes/[location].tsx"
import { timeElapsedString } from "../scripts/dateformatter.tsx";

interface Props {
    title: string,
    date: Date,
    uuid: string,
    from: Location,
    children: PreactDOMAttributes["children"]
}

export default function Exhibit(props: Props) {
    return (
        <div class="w-full min-h-[calc(100svh-2rem)] bg-white shadow-message border border-black border-opacity-30 p-6 m-4">
            <h1 class="text-4xl break-all mb-4 font-medium">{props.uuid}</h1>
            <h2 class="text-xl font-medium mb-4"><em>{props.title}</em>, <span class="font-normal">{timeElapsedString(props.date)} at {props.from.name}</span></h2>
            <p class="text-base">{props.children}</p>
        </div>
    );
}