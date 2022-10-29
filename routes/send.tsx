import Form from "../islands/form.tsx";
import { fetchUniversities } from "./[university].tsx";

const universities = await fetchUniversities();

export default function Send() {
    return (
        <>
            <h1>Send a message</h1>
            <Form universities={universities}/>
        </>
    )
}