import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Location, Exhibit, FirestoreExhibitResponse, FirestoreLocationResponse } from "../scripts/types.ts";
import ExhibitGrid from "../components/ExhibitGrid/Grid.tsx";

interface Props {
  exhibits: Exhibit[] | null;
  location: Location;
  request: Request;
}

export function findLocationShortNameInLocations(
  shortName: string,
  locations: Location[],
): Location | undefined {
  return locations.find((elem: Location): boolean => {
    return (elem.shortName.toLowerCase() == shortName.toLowerCase());
  });
}

//convert firebase reference to the document name
export function referenceToShortName(reference: string): string {
  return reference.match("([^\/]+$)")![0];
}

//fetch all locations from firebase and convert to Location obj
export async function fetchLocations(): Promise<Location[]> {
  const locationFetch: FirestoreLocationResponse = await fetch(
    "https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents/locations",
  ).then((res) => res.json());
  const locations: Location[] = locationFetch.documents.map(
    (data) => {
      return {
        shortName: referenceToShortName(data.name),
        name: data.fields.name.stringValue,
      };
    },
  );
  return locations;
}

//fetch all exhibits from firebase and convert to Exhibit obj
async function fetchExhibits(
  location: Location,
): Promise<Exhibit[] | null> {
  const requestBody = {
    "structuredQuery": {
      "where": {
        "fieldFilter": {
          "field": {
            "fieldPath": "to",
          },
          "op": "EQUAL",
          "value": {
            "referenceValue":
              `projects/nellbradshawisawesome/databases/(default)/documents/locations/${location.shortName}`,
          },
        },
      },
      "from": [{ "collectionId": "exhibits" }],
    },
  };

  const exhibitsFirestore: FirestoreExhibitResponse[] = await fetch(
    "https://firestore.googleapis.com/v1/projects/nellbradshawisawesome/databases/(default)/documents:runQuery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  ).then((res) => res.json());

  let exhibits: Exhibit[] | null
  try {
    exhibits = exhibitsFirestore.map((data) => {
      return {
        id: referenceToShortName(data.document.name), //use the ID auto generated by firebase. for some reason data.document.name is a reference, so convert that.
        title: data.document.fields.title.stringValue,
        content: data.document.fields.content.stringValue,
        created: new Date(data.document.fields.created.timestampValue),
        to: new Location(
          referenceToShortName(data.document.fields.to.referenceValue),
          locations,
        ),
        from: new Location(
          referenceToShortName(data.document.fields.from.referenceValue),
          locations,
        ),
        uuid: data.document.fields.uuid.stringValue,
      };
    });
  } catch {
    exhibits = null
  }
  return exhibits;
}

//define a global variable for locations (we dont expect this data to change often)
const locations = await fetchLocations();

//handler fetches data and handles errors with that
export const handler: Handlers<Props> = {
  async GET(request, ctx) {
    const { location } = ctx.params;
    let locationObj;
    try {
      locationObj = new Location(location, locations);
    } catch {
      return ctx.renderNotFound();
    }

    const exhibits: Exhibit[] | null = await fetchExhibits(locationObj);

    const response = await ctx.render({
      exhibits: exhibits,
      location: locationObj,
      request: request,
    });

    //there should be no cache of html to allow users to refresh and see new messages. the JS and assets will be cached due to middleware.
    response.headers.set("Cache-Control", "no-cache");
    return response;
  },
};

export default function LocationPage(
  { data }: PageProps<Props | null>,
) {

  let pageURL;  //we need to retrieve the page url here for the anchor used in exhibitgrid component to avoid using JS to fetch href (and thus making it an island)
  let param: string | null; //the search param is also retrieved here in case I decide to make Popup.tsx a component later on.
  if (data?.request.url == undefined) {
    pageURL = undefined;
    param = null;
  } else {
    pageURL = new URL(data?.request.url);
    param = pageURL.searchParams.get("id");
  }

  return (
    <>
      <Head>
        <title>{data?.location.name} exhibition</title>
      </Head>
      <body class={"bg-wallGray bg-repeat bg-small bg-wall-texture overflow-scroll h-fit"}>
        <ExhibitGrid
          fromID={param}
          URL={pageURL}
          exhibits={data?.exhibits}
          location={data?.location}
        />
      </body>
    </>
  );
}
