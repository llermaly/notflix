import { useState, useEffect, FunctionComponent } from "react";
import { ResultList as HeadlessResultList } from "@coveo/headless";
import TinderCard from "react-tinder-card";
import Rating from "@material-ui/lab/Rating";

import "./SwipeResults.css";

interface ResultListProps {
  controller: HeadlessResultList;
  setSickness: any;
}

const SwipeResults: FunctionComponent<ResultListProps> = (props) => {
  const { controller, setSickness } = props;
  const [state, setState] = useState(controller.state);
  const [currentCard, setCurrentCard] = useState(state.results[0] as any);
  const [_, setLastDirection] = useState();

  const swiped = (direction: any, nameToDelete: string) => {
    const index = state.results.findIndex((el) => el.uniqueId === nameToDelete);
    setLastDirection(direction);
    if (direction === "right") {
      const favs: any = localStorage.getItem("likes");
      const parsed = favs ? JSON.parse(favs) : [];
      const newLikes = [...parsed, nameToDelete];
      localStorage.setItem("likes", JSON.stringify(newLikes));
    }
    setCurrentCard(state.results[index + 1]);
  };

  const outOfFrame = (name: string) => {
    console.log(name);
  };

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  useEffect(() => {
    setCurrentCard(state.results[0]);
  }, [state]);

  if (!state.results || state.results.length === 0 || !currentCard) {
    return <></>;
  }
  return (
    <div className="swipe_wrapper">
      <div style={{ marginBottom: "100px" }}>
        <link
          href="https://fonts.googleapis.com/css?family=Damion&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
          rel="stylesheet"
        />
        <h1>Swipe it !</h1>
        <div className="cardContainer">
          {[...state.results].reverse().map((r) => (
            <TinderCard
              key={r.uniqueId}
              onSwipe={(dir) => swiped(dir, r.uniqueId)}
              onCardLeftScreen={() => outOfFrame(r.uniqueId)}
            >
              <div
                style={{ backgroundImage: "url(" + r.raw.movieimage + ")" }}
                className="card"
              >
                <h3>{r.title}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
      <div>
        <h1 className="swipe_title" style={{ marginLeft: "34px" }}>
          {" "}
          <a href={currentCard?.clickUri} target="_blank" rel="noreferrer">
            {currentCard?.title} (
            {new Date(currentCard?.raw?.moviereleasedate as any).getFullYear()})
          </a>
        </h1>
        <ul className="movie_specs">
          <li>
            <span>Cast</span> <p>{currentCard?.raw?.movieactors?.join(", ")}</p>
          </li>
          <li>
            <span>Genre</span> <p>{currentCard?.raw?.moviegenre?.join(", ")}</p>
          </li>
          <li>
            <span>Writer</span>{" "}
            <p>{currentCard?.raw?.moviewriter?.join(", ")}</p>
          </li>
          <li>
            <span>Runtime</span> <p>{currentCard?.raw?.movieruntime}</p>
          </li>
          <li>
            <span>Excerpt</span> <p>{currentCard?.excerpt}</p>
          </li>
          <Rating
            name="half-rating-read"
            value={parseInt(currentCard?.raw?.moviescore) / 2}
            precision={0.5}
            readOnly
          />
        </ul>
      </div>
    </div>
  );
};

export default SwipeResults;
