import { useState } from "https://esm.sh/v95/preact@10.11.0/hooks/src/index.d.ts";
import { UniversityClass } from "../routes/[university].tsx";

interface FormProps {
  universities: UniversityClass[];
}

export default function Form(props: FormProps) {  
  return (
    <form>
      <label htmlFor="message">* Message</label>
      <input id="message" name="message" type="text" />
      <label htmlFor="university">* University</label>
      <select
        name="university"
        id="university"
      >
        {props.universities.map((elem) => {
            return (<option>{elem.name}</option>);
        })}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
