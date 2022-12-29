import { findLocationShortNameInLocations } from "../routes/[location].tsx";

export interface RequestBody {
  title: string;
  content: string;
  from: string;
  to: string;
  uuid: string;
}

export class Exhibit {
  id: string;
  title: string;
  content: string;
  created: Date;
  to: Location;
  from: Location;
  uuid: string;

  constructor(
    id: string,
    title: string,
    content: string,
    created: Date,
    to: Location,
    from: Location,
    uuid: string,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.created = created;
    this.to = to;
    this.from = from;
    this.uuid = uuid;
  }
}

export class Location {
  shortName: string;
  name: string;

  constructor(shortName: string, locations: Location[]) {
    const temp = findLocationShortNameInLocations(shortName, locations);
    if (temp == undefined) {
      throw ("location shortName does not exist");
    } else {
      this.shortName = temp.shortName;
      this.name = temp.name;
    }
  }
}

export interface FirestoreExhibitResponse {
  document: FirestoreExhibitDocument;
}

export interface FirestoreExhibitDocument {
  name: string;
  fields: {
    title: { stringValue: string };
    content: { stringValue: string };
    created: { timestampValue: string };
    to: { referenceValue: string };
    from: { referenceValue: string };
    uuid: { stringValue: string };
  };
}

export interface FirestoreLocationDocument {
  name: string;
  fields: {
    name: { stringValue: string };
  };
}

export interface FirestoreLocationResponse {
  documents: FirestoreLocationResponse[];
}
