import { JSX } from "preact";

export default function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return(
        <>
        <button class="disabled:(opacity-50 pointer-events-none) focus:outline-black px-4 py-2 border border-gray-300 shadow-md relative after::(absolute inset-0 shadow-lg content- opacity-50  transition-opacity) hover:after::opacity-100 active:after::opacity-0 transition-transform motion-reduce:(transition-none after::transition-none) active:scale-95 bg-gradient-to-b from-gray-200 to-gray-300 dark:(border-gray-900 from-gray-700 to-gray-800 focus:outline-white)" {...props}/></>
    )
}