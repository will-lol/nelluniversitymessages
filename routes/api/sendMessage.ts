import { Handlers } from "$fresh/server.ts";
import { config as envConfig } from "$deno-std/dotenv/mod.ts";
import {
  importPKCS8,
  SignJWT,
} from "https://deno.land/x/jose@v4.10.0/index.ts";

export interface Message {
  messageContent: string,
  university: string,
  uuid: string
}

const configData = await envConfig({
  export: true,
  allowEmptyValues: true,
});

const serviceAccountPrivateKey = await importPKCS8(
  Deno.env.get("SERVICE_ACCOUNT_PRIVATE_KEY")!,
  "RS256",
);

let persistantJWT: string | undefined;
let persistantJWTExpireTime: Date | undefined;
let persistantOauthToken: string | undefined;

export const handler: Handlers = {
  async POST(req) {
    async function generateJWT(): Promise<string> {
      const expDate = new Date();
      expDate.setSeconds(expDate.getSeconds() + 3601)

      const JWT = await new SignJWT({ scope: "https://www.googleapis.com/auth/datastore" })
        .setIssuer(Deno.env.get("SERVICE_ACCOUNT_EMAIL")!)
        .setExpirationTime("3600s")
        .setIssuedAt()
        .setAudience("https://oauth2.googleapis.com/token")
        .setProtectedHeader({ alg: "RS256", typ: "JWT" });

      persistantJWTExpireTime = expDate;
      return JWT.sign(serviceAccountPrivateKey);
    }

    function dateInPast(date: Date): boolean {
      const current = new Date();
      return date < current;
    }

    async function fetchOauth(JWT: string): Promise<string> {
      return await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: ("grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=".concat(JWT!))
        }
      ).then((res) => res.json().then((res) => res.access_token))
    }

    async function getFirebaseOauth(): Promise<string> {
      let JWT;
      let firebaseOauth: string | undefined = undefined;

      if (persistantJWT == undefined || dateInPast(persistantJWTExpireTime!)) {
        JWT = await generateJWT();
        firebaseOauth = await fetchOauth(JWT);
        persistantJWT = JWT;
        persistantOauthToken = firebaseOauth;
      } else {
        firebaseOauth = persistantOauthToken;
      }

      return firebaseOauth!;
    }

    //TODO: Check UUID is a suitable length. Check messageContent for spam or profranity. Check university exists.

    const messageData = await req.json() as Message;

    const data = {
      "fields": {
        "messageContent": {
          "stringValue": messageData.messageContent,
        },
        "timeCreated": {
          "timestampValue": new Date(),
        },
        "university": {
          "referenceValue":
            "projects/nellbradshawisawesome/databases/(default)/documents/universities/" +
            messageData.university,
        },
        "uuid": {
          "stringValue": messageData.uuid,
        },
      },
    };

    const firestoreRequest = await fetch(
      "https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + await getFirebaseOauth(),
        },
        body: JSON.stringify(data),
      },
    );

    return new Response(firestoreRequest.body, {
      status: firestoreRequest.status,
      statusText: firestoreRequest.statusText,
    });
  },
};
