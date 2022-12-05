import { JSX } from "preact";

export default function Link(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
    return (
        <>
         <a class="italic text-blue-900 hover:underline" {...props}/>
        </>
    )
}