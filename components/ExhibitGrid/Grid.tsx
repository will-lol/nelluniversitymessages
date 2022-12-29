import { Exhibit, Location } from "../../scripts/types.ts";
import ExhibitComponent from "./Exhibit.tsx";
import Link from "../Link.tsx";
import randBetween from "../../scripts/randbetween.tsx";
import Popup from "../../islands/Popup.tsx";

interface Props {
  fromID: string | null;
  exhibits?: Exhibit[] | null;
  location: Location | undefined;
  URL: URL | undefined;
}

export default function ExhibitGrid(props: Props) {
  function compareExhibitDate(a: Exhibit, b: Exhibit) {
    return (b.created.valueOf() - a.created.valueOf());
  }

  let sendURL;
  if (!(props.URL == undefined) && !(props.location == undefined)) {
    sendURL = new URL(props.URL?.origin + "/create");
    sendURL.searchParams.set("from", props.location?.shortName);
  } else {
    sendURL = "";
  }

  let exhibits = props.exhibits;
  exhibits = exhibits?.sort(compareExhibitDate);

  const exhibitsLength = exhibits?.length ?? 0;
  let gridRows = Math.round(exhibitsLength / 2);
  let gridCols = exhibitsLength;

  if (gridCols < 2) {
    gridCols = 2;
  }
  if (gridRows < 2) {
    gridRows = 2;
  }

  const exhibitsPlacement: number[][] = [];
  for (let i = 0; i < exhibitsLength; i++) {
    let tempPlacement: number[];
    while (true) {
      tempPlacement = [
        randBetween(1, gridRows),
        randBetween(1, gridCols),
      ];
      if (
        !exhibitsPlacement.find((elem) => {
          if (
            (elem[0] == tempPlacement[0] &&
              elem[1] == tempPlacement[1])
          ) {
            return true;
          }
        })
      ) {
        if (!(tempPlacement[0] == 1 && tempPlacement[1] == 1)) {
          exhibitsPlacement.push(tempPlacement);
          break;
        }
      }
    }
  }

  exhibitsPlacement.sort((a: number[], b: number[]): number => {
    const aRank = a[0] * a[1];
    const bRank = b[0] * b[1];
    return aRank - bRank;
  });

  const divs: Array<preact.JSX.Element> = [];
  for (
    let i = 0;
    i <= (((gridCols * gridRows) - exhibitsLength) - 1);
    i++
  ) {
    divs.push(<div />);
  }

  if (exhibits == null) {
    return (
      <>
        <div>No exhibits available</div>
      </>
    );
  } else {
    return (
      <div
        class={"grid grid-cols-[repeat(" + gridCols +
          ",100svw)] grid-rows-[repeat(" + gridRows +
          ",minmax(100svh,auto))] justify-items-center items-start"}
      >
        <div class="relative text-center h-[100svh] flex justify-center items-center flex-col">
          <div class="p-7 flex justify-center items-center flex-col">
            <p>Welcome to the {props.location?.name} exhibition.</p>{" "}
            <p class="text-6xl  mb-4">
              Explore the exhibits by moving around the wall.
            </p>
            <div class="text-6xl">
              <Link href={sendURL}>Create an exhibit</Link>
            </div>
          </div>
          {props.fromID != null && <Popup id={props.fromID!}></Popup>}
        </div>
        {divs}

        {exhibits.map((elem, index) => {
          return (
            <div
            id={elem.id}
              class={"p-4 w-[100svw] flex items-start justify-start row-start-[" +
                exhibitsPlacement[index][0] + "] col-start-[" +
                exhibitsPlacement[index][1] + "]"}
            >
              <ExhibitComponent
                title={elem.title}
                date={elem.created}
                uuid={elem.uuid}
                from={elem.from}
              >
                {elem.content}
              </ExhibitComponent>
            </div>
          );
        })}
      </div>
    );
  }
}
