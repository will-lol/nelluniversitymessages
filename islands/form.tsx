import { useState } from "preact/hooks";
import { UniversityClass } from "../routes/[university].tsx";
import { Message } from "../routes/api/sendMessage.ts";

interface FormProps {
  universities: UniversityClass[];
}

function getUUIDCookie(): string {
  console.log("getting");
  const cookies = document.cookie.split(";");
  for(let i = 0; i <cookies.length; i++) {
    let c = cookies[i];
    console.log(c);
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
      console.log(c);
    }
    if (c.indexOf("UUID" + "=") == 0) {
      return c.substring(("UUID" + "=").length, c.length);
    }
  }
  throw "cookie does not exist"
}

function setUUIDCookie() {
  const UUID = crypto.randomUUID() ;
  document.cookie = "UUID=" + UUID + ";" + " expires=Fri, 01 Jan 9999 00:00:00 GMT";
  return UUID;
}

export default function Form(props: FormProps) {
  const [message, setMessage] = useState("");
  const [university, setUniversity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setSubmitting(true);

    let UUID: string;
    try {
      UUID = getUUIDCookie();
    } catch {
      UUID = setUUIDCookie();
    }
    const body: Message = {
      messageContent: message,
      university: university,
      uuid: UUID,
    };
    console.log(body);
    const sendMessage = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (sendMessage.status != 200) {
      setError(true);
    } else {
      window.location.href = "/" + university;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">* Message</label>
      <input
        autocomplete="off"
        id="message"
        name="message"
        type="text"
        onInput={(e) => setMessage((e.target as HTMLSelectElement).value)}
        disabled={submitting}
      />
      <label htmlFor="university">* University</label>
      <select
        name="university"
        id="university"
        onChange={(e) => setUniversity((e.target as HTMLSelectElement).value)}
        default={undefined}
        autocomplete="off"
      >
        <option value={undefined}></option>
        {props.universities.map((elem) => {
          return <option value={elem.shortName}>{elem.name}</option>;
        })}
      </select>
      <button
        type="submit"
        disabled={((message.length == 0) || (university.length == 0)) ||
          submitting}
      >
        Submit
      </button>
    </form>
  );
}
