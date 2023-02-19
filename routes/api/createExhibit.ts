import { Handlers } from "$fresh/server.ts";
import { config as envConfig } from "$deno-std/dotenv/mod.ts";
import { RequestBody } from "../../scripts/types.ts";
import dateInPast from "../../scripts/dateInPast.ts";
import { fetchLocations, findLocationShortNameInLocations } from "../[location].tsx";
import {
  importPKCS8,
  SignJWT,
} from "https://deno.land/x/jose@v4.10.0/index.ts";

//for deno. ignore.
const configData = await envConfig({
  export: true,
  allowEmptyValues: true,
});

const serviceAccountPrivateKey = await importPKCS8(
  Deno.env.get("SERVICE_ACCOUNT_PRIVATE_KEY")!,
  "RS256",
);

//we try not to HAMMER google's servers by persisting the JWT (as much as we can on the edge) and keeping track of its expire time.
let persistantJWT: string | undefined;
let persistantJWTExpireTime: Date | undefined;
let persistantOauthToken: string | undefined;

export const handler: Handlers = {
  async POST(req) {
    async function generateJWT(): Promise<string> {
      const expDate = new Date();
      expDate.setSeconds(expDate.getSeconds() + 3601);

      const JWT = await new SignJWT({
        scope: "https://www.googleapis.com/auth/datastore",
      })
        .setIssuer(Deno.env.get("SERVICE_ACCOUNT_EMAIL")!)
        .setExpirationTime("3600s")
        .setIssuedAt()
        .setAudience("https://oauth2.googleapis.com/token")
        .setProtectedHeader({ alg: "RS256", typ: "JWT" });

      persistantJWTExpireTime = expDate;
      return JWT.sign(serviceAccountPrivateKey);
    }

    async function fetchOauth(JWT: string): Promise<string> {
      return await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body:
            ("grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion="
              .concat(JWT!)),
        },
      ).then((res) => res.json().then((res) => res.access_token));
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
    
    const exhibitData = await req.json() as RequestBody;

    async function validateExhibit(exhibit: RequestBody) {
      if (
        (exhibit.title.length > 500) ||
        (exhibit.content.length > 5000) || 
        (exhibit.uuid.length > 36) ||
        (findLocationShortNameInLocations(exhibit.from, await fetchLocations()) == undefined) || 
        (findLocationShortNameInLocations(exhibit.to, await fetchLocations()) == undefined)
      ) {
        return false;
      } else {
        return true;
      }
    }

    if (!await validateExhibit(exhibitData)) {
      return new Response("Error: Validation failed.", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    function formatTitle(title: string): string {
      let formatted = title.trim();
      if (title.match(/(\.|,)\1{1,}$/) === null) {
        formatted = formatted.replace(/(\.|,)+$/, "");
      }
      return formatted;
    }

    const data = {
      "fields": {
        "title": {
          "stringValue": formatTitle(exhibitData.title),
        },
        "content": {
          "stringValue": exhibitData.content,
        },
        "created": {
          "timestampValue": new Date(),
        },
        "to": {
          "referenceValue":
            "projects/nellbradshawisawesome/databases/(default)/documents/locations/" +
            exhibitData.to,
        },
        "from": {
          "referenceValue":
            "projects/nellbradshawisawesome/databases/(default)/documents/locations/" +
            exhibitData.from,
        },
        "uuid": {
          "stringValue": exhibitData.uuid,
        },
      },
    };

    const firestoreRequest = await fetch(
      "https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents/exhibits",
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
