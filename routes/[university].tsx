import { Handlers, PageProps } from "$fresh/server.ts";
import Button from "../components/Button.tsx";
import MessageGrid from "../components/MessageGrid.tsx";

export class MessageClass {
  messageTitle: string;
  messageContent: string;
  timeCreated: Date;
  university: UniversityClass;
  uuid: string;

  constructor(
    messageTitle: string,
    messageContent: string,
    timeCreated: Date,
    university: UniversityClass,
    uuid: string,
  ) {
    this.messageTitle = messageTitle;
    this.messageContent = messageContent;
    this.timeCreated = timeCreated;
    this.university = university;
    this.uuid = uuid;
  }
}

function capsInsensitiveStringMatch(str1: string, str2: string): boolean {
  return (str1.toLowerCase == str2.toLowerCase);
}

export class UniversityClass {
  shortName: string;
  city: string;
  name: string;

  constructor(shortName: string, universities: UniversityClass[]) {
    for (let i = 0; i < universities.length; i++) {
      if (capsInsensitiveStringMatch(shortName, universities[i].shortName)) {
        this.shortName = universities[i].shortName;
        this.city = universities[i].city;
        this.name = universities[i].name;
        return;
      }
    }
    throw ("university shortName does not exist");
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
      messageTitle: { stringValue: string };
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
  };
}

interface FirestoreUniversitiesResponse {
  documents: FirestoreUniversityResponse[];
}

function referenceToShortName(reference: string): string {
  return reference.match("([^\/]+$)")![0];
}

export async function fetchUniversities(): Promise<UniversityClass[]> {
  const universityFetch: FirestoreUniversitiesResponse = await fetch(
    "https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents/universities",
  ).then((res) => res.json());
  const universities: UniversityClass[] = universityFetch.documents.map(
    (data) => {
      return {
        shortName: referenceToShortName(data.name),
        city: data.fields.city.stringValue,
        name: data.fields.name.stringValue,
      };
    },
  );

  return universities;
}

async function fetchMessages(
  university: UniversityClass,
): Promise<MessageClass[] | null> {
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
    messages = messagesFirestore.map((data) => {
      return {
        messageTitle: data.document.fields.messageTitle.stringValue,
        messageContent: data.document.fields.messageContent.stringValue,
        timeCreated: new Date(data.document.fields.timeCreated.timestampValue),
        university: new UniversityClass(
          referenceToShortName(data.document.fields.university.referenceValue),
          universities,
        ),
        uuid: data.document.fields.uuid.stringValue,
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

    const messages: MessageClass[] | null = await fetchMessages(universityObj);

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
    <body class="bg-wallGray bg-repeat bg-small bg-wall-texture overflow-scroll">
        <MessageGrid messages={data?.messages} university={data?.university} />
    </body>
  );
}
