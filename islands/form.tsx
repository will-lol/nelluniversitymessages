import { useEffect, useId, useState, useRef } from "preact/hooks";
import { UniversityClass } from "../routes/[university].tsx";
import { Message } from "../routes/api/sendMessage.ts";
import Label from "../components/form/Label.tsx";
import TextArea from "../components/form/TextArea.tsx";
import Select from "../components/form/Select.tsx";
import Error from "../components/form/Error.tsx";
import Button from "../components/Button.tsx";

interface FormProps {
  universities: UniversityClass[];
}

function getUUIDCookie(): string {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf("UUID" + "=") == 0) {
      return c.substring(("UUID" + "=").length, c.length);
    }
  }
  throw "cookie does not exist";
}

function setUUIDCookie() {
  const UUID = crypto.randomUUID();
  document.cookie = "UUID=" + UUID + ";" +
    " expires=Fri, 01 Jan 9999 00:00:00 GMT";
  return UUID;
}

export default function Form(props: FormProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [university, setUniversity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [error, setError] = useState(new Set() as Set<string>);

  const messageElementId = useId();
  const titleElementId = useId();
  const selectElementId = useId();

  function addError(newError: string) {
    const temp = error;
    temp.add(newError);
    setError(temp);
  }
  function removeError(oldError: string) {
    const temp = error;
    temp.delete(oldError);
    setError(temp);
  }

  function onLoad() {
    const params = (new URL(window.location.href)).searchParams;
    const selectElem = document.getElementById(selectElementId) as HTMLSelectElement;
    const universityParam = params.get("university");

    if (universityParam) {
      selectElem.value = universityParam;
    }
    
    setTitle(
      (document.getElementById(titleElementId) as HTMLInputElement).value,
    );
    setMessage(
      (document.getElementById(messageElementId) as HTMLInputElement).value,
    );
    setUniversity(
      (document.getElementById(selectElementId) as HTMLSelectElement).value,
    );
  }

  const cancelEffect = useRef(false);
  useEffect(() => {
    if (!cancelEffect.current) {
      onLoad();
      cancelEffect.current = true;
    }
  }, []);

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
      messageTitle: title,
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
      addError(sendMessage.statusText);
    } else {
      window.location.href = "/" + university;
    }
  }

  function checkSetMessage(message: string) {
    setMessage(message);
    const errorMessage = "Your message is too long. Character limit is 500.";
    if (message.length > 5000) {
      addError(errorMessage);
      setSubmitDisable(true);
    } else {
      removeError(errorMessage);
    }
  }

  function checkSetTitle(title: string) {
    setTitle(title);
    const errorMessage = "Your title is too long. Character limit is 500.";
    if (title.length > 500) {
      addError(errorMessage);
      setSubmitDisable(true);
    } else {
      removeError(errorMessage);
    }
  }

  return (
    <form class="my-4 flex flex-col" onSubmit={handleSubmit}>
      <Label required htmlFor="message">Writing space</Label>
      <TextArea
        autocomplete="off"
        id={messageElementId}
        name="message"
        type="text"
        onInput={(e) => checkSetMessage((e.target as HTMLSelectElement).value)}
        disabled={submitting}
      />
      <Label required htmlFor="title">Title</Label>
      <TextArea
        autocomplete="off"
        id={titleElementId}
        name="title"
        type="text"
        onInput={(e) => checkSetTitle((e.target as HTMLSelectElement).value)}
        disabled={submitting}
      />
      <Label required htmlFor="university">Exhibition site</Label>
      <Select
        name="university"
        id={selectElementId}
        onChange={(e) => setUniversity((e.target as HTMLSelectElement).value)}
        default={undefined}
        autocomplete="off"
      >
        <option value={undefined}></option>
        {props.universities.map((elem) => {
          return <option value={elem.shortName}>{elem.name}</option>;
        })}
      </Select>
      {error.size > 0 && Array.from(error).map((elem) => {
        return <Error>{elem}</Error>;
      })}
      <Button
        type="submit"
        disabled={((message.length == 0) || (university.length == 0)) ||
          submitting || submitDisable}
      >
        Submit
      </Button>
    </form>
  );
}
