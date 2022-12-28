import { Exhibit, Location } from "../routes/[location].tsx";
import ExhibitComponent from "./Exhibit.tsx";
import Link from "./Link.tsx";
import randBetween from "../scripts/randbetween.tsx";

interface Props {
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
  const exhibitsPlacement: number[][] = [];

  const exhibitsLength = exhibits?.length ?? 0;
  let gridRows = Math.round(exhibitsLength / 2);
  let gridCols = exhibitsLength;


  if (gridCols < 2) {
    gridCols = 2;
  }
  if (gridRows < 2) { 
    gridRows = 2;
  }

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
        <div class="p-7 text-center h-[100svh] flex justify-center items-center flex-col">
          <p>Welcome to the {props.location?.name} exhibition.</p>{" "}
          <p class="text-6xl  mb-4">
            Explore the exhibits by moving around the wall.
          </p>
          <div class="text-6xl">
            <Link href={sendURL}>Create an exhibit</Link>
          </div>
        </div>
        {divs}

        {exhibits.map((exhibit) => {
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

          return (
            <div
              class={"w-[100svw] flex items-start justify-start row-start-[" +
                tempPlacement[0] + "] col-start-[" + tempPlacement[1] + "]"}
            >
              <ExhibitComponent
                title={exhibit.title}
                date={exhibit.created}
                uuid={exhibit.uuid}
                from={exhibit.from}
              >
                {exhibit.content}
              </ExhibitComponent>
            </div>
          );
        })}
      </div>
    );
  }
}
