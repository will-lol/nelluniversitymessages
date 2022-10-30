import { Handlers, PageProps } from "$fresh/server.ts";
import MessageList from "../components/MessageList.tsx";

export class MessageClass {
  messageContent: string;
  timeCreated: Date;
  university: UniversityClass;
  uuid: string;

  constructor(messageContent: string, timeCreated: Date, university: UniversityClass, uuid: string) {
    this.messageContent = messageContent;
    this.timeCreated = timeCreated;
    this.university = university;
    this.uuid = uuid;
  }
}

export class UniversityClass {
  shortName: string;
  city: string;
  name: string;

  constructor(shortName: string, universities: UniversityClass[]) {
    for (let i=0;i<universities.length;i++) {
      if (shortName == universities[i].shortName) {
        this.shortName = universities[i].shortName;
        this.city = universities[i].city;
        this.name = universities[i].name;
        return;
      }
    }
    throw("university shortName does not exist");
  }
} 

interface UniversityProps {
  messages: MessageClass[] | null;
  university: UniversityClass;
}

interface FirestoreMessageResponse {
  document: {
    name: string;
    fields: {
      messageContent: { stringValue: string };
      timeCreated: { timestampValue: string };
      uuid: { stringValue: string };
      university: { referenceValue: string };
    };
  };
}

interface FirestoreUniversityResponse {
  name: string;
  fields: {
    city: { stringValue: string };
    name: { stringValue: string };
  }
}

interface FirestoreUniversitiesResponse {
  documents: FirestoreUniversityResponse[]
}

function referenceToShortName(reference: string): string {
  return reference.match("([^\/]+$)")![0];
}

export async function fetchUniversities(): Promise<UniversityClass[]> {
  const universityFetch: FirestoreUniversitiesResponse = await fetch("https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents/universities").then((res) => res.json());
  const universities: UniversityClass[] = universityFetch.documents.map((elem) => {
    return {
      shortName: referenceToShortName(elem.name),
      city: elem.fields.city.stringValue,
      name: elem.fields.name.stringValue
    }
  })

  return universities
}

async function fetchMessages(university: UniversityClass): Promise<MessageClass[] | null> {
  const requestBody = {
    "structuredQuery": {
      "where": {
        "fieldFilter": {
          "field": {
            "fieldPath": "university",
          },
          "op": "EQUAL",
          "value": {
            "referenceValue":
              `projects/nellbradshawisawesome/databases/(default)/documents/universities/${university.shortName}`,
          },
        },
      },
      "from": [{ "collectionId": "messages" }],
    },
  };

  const messagesFirestore: FirestoreMessageResponse[] = await fetch(
    "https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents:runQuery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  ).then((res) => res.json());

  let messages: MessageClass[] | null;
  try {
    messages = messagesFirestore.map((elem) => {
      return {
        messageContent: elem.document.fields.messageContent.stringValue,
        timeCreated: new Date(elem.document.fields.timeCreated.timestampValue),
        university: new UniversityClass(referenceToShortName(elem.document.fields.university.referenceValue), universities),
        uuid: elem.document.fields.uuid.stringValue,
      };
    });
  } catch {
    messages = null;
  }

  return messages;
}

const universities = await fetchUniversities();

export const handler: Handlers<UniversityProps> = {
  async GET(_, ctx) {
    const { university } = ctx.params;
    let universityObj;

    try {
      universityObj = new UniversityClass(university, universities);
    } catch {
      return ctx.renderNotFound();
    }

    const messages: MessageClass[] | null= await fetchMessages(universityObj);

    return ctx.render({
      messages: messages,
      university: universityObj,
    });
  },
};

export default function University(
  { data }: PageProps<UniversityProps | null>,
) {
  return (
    <>
      <h1>Hello {data?.university.name}</h1>
      <ul>
        <MessageList messages={data?.messages} />
      </ul>
      <a href="/send">
        <button>send a message</button>
      </a>
    </>
  );
}