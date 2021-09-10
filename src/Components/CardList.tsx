import { FunctionComponent, useContext, useEffect, useState } from "react";
import "./CardList.css";
import {
  buildResultList,
  Result,
  buildResultTemplatesManager,
  ResultTemplatesManager,
  ResultList as HeadlessResultList,
  ResultListOptions,
} from "@coveo/headless";
import EngineContext from "../common/engineContext";
import ReactCardFlip from "react-card-flip";

type Template = (result: Result) => React.ReactNode;

interface ResultListProps {
  controller: HeadlessResultList;
}

const ResultListRenderer: FunctionComponent<ResultListProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);
  const getFavs = (id: string) => {
    const likes: any = localStorage.getItem("likes");
    if (likes && JSON.parse(likes).includes(id)) {
      return "fav-active";
    }
  };

  const engine = useContext(EngineContext)!;
  const [isFlipped, setIsFlipped] = useState({}) as any;

  const headlessResultTemplateManager: ResultTemplatesManager<Template> =
    buildResultTemplatesManager(engine);

  const handleFlip = (id: string) => {
    setIsFlipped({ [id]: !isFlipped[id] });
  };

  headlessResultTemplateManager.registerTemplates({
    conditions: [],
    content: (result: Result) => (
      <ReactCardFlip
        isFlipped={isFlipped[result.uniqueId]}
        flipDirection="vertical"
        key={result.uniqueId}
      >
        <div
          onClick={() => handleFlip(result.uniqueId)}
          className={`result ${getFavs(result.uniqueId)}`}
        >
          <img src={result.raw.movieimage as any} alt="img" />
        </div>
        <div key={result.uniqueId} onClick={() => handleFlip(result.uniqueId)}>
          <div className="result_data">
            <h2>
              <a href={result.clickUri} target="_blank" rel="noreferrer">
                {result.title} (
                {new Date(result.raw.moviereleasedate as any).getFullYear()})
              </a>
            </h2>
            <p>{result.excerpt}</p>
          </div>
        </div>
      </ReactCardFlip>
    ),
  });

  useEffect(() => {
    controller.subscribe(() => setState(controller.state));
  }, [controller]);

  return (
    <div className="results_list">
      {state.results.map((result: Result) => {
        const template = headlessResultTemplateManager.selectTemplate(result);
        return template ? template(result) : null;
      })}
    </div>
  );
};

const CardList = ({ sickness }: any) => {
  const options: ResultListOptions = {
    fieldsToInclude: ["movieimage", "moviereleasedate"],
  };
  const engine = useContext(EngineContext)!;
  const controller = buildResultList(engine, { options });

  return <ResultListRenderer key={sickness} controller={controller} />;
};

export default CardList;
