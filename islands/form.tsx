import { useEffect, useId, useState, useRef } from "preact/hooks";
import { Location, findLocationShortNameInLocations } from "../routes/[location].tsx";
import { RequestBody } from "../routes/api/createExhibit.ts";
import Label from "../components/form/Label.tsx";
import TextArea from "../components/form/TextArea.tsx";
import Select from "../components/form/Select.tsx";
import Error from "../components/form/Error.tsx";
import Button from "../components/Button.tsx";
import Exhibit from "../components/Exhibit.tsx";

interface FormProps {
  universities: Location[];
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
  const [content, setContent] = useState("");
  const [to, setTo] = useState("");
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
  function getParam(key: string) {
    const params = (new URL(window.location.href)).searchParams;
    return params.get(key);
  }

  function onLoad() {
    const selectElem = document.getElementById(selectElementId) as HTMLSelectElement;
    const fromParam = getParam("from");

    if (fromParam) {
      if (findLocationShortNameInLocations(fromParam, props.universities)) {
        selectElem.value = fromParam;
        console.log("hi")
      } else {
        addError("Invalid from parameter. Please try visiting this site via a location page.")
      }
    }
    
    setTitle(
      (document.getElementById(titleElementId) as HTMLInputElement).value,
    );
    setContent(
      (document.getElementById(messageElementId) as HTMLInputElement).value,
    );
    setTo(
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
    let body: RequestBody;

    const fromParam = getParam("from")
    if (!fromParam) {
      addError("Cannot submit. Please try visiting this site via a location page.");
      return;
    } else {
      body = {
        title: title,
        content: content,
        to: to,
        from: fromParam,
        uuid: UUID,
      };
    }

    const sendMessage = await fetch("/api/createExhibit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (sendMessage.status != 200) {
      addError(sendMessage.statusText);
    } else {
      window.location.href = "/" + fromParam;
    }
  }

  function checkSetContent(message: string) {
    setContent(message);
    const errorMessage = "Your writing is too long. Character limit is 500.";
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
        onInput={(e) => checkSetContent((e.target as HTMLSelectElement).value)}
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
        onChange={(e) => setTo((e.target as HTMLSelectElement).value)}
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
        disabled={((content.length == 0) || (to.length == 0)) || (title.length == 0) ||
          submitting || submitDisable}
      >
        Submit
      </Button>
    </form>
  );
}
