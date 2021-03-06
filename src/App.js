import Latex from "react-latex";
import { useEffect, useState } from "react";

const FLASHCARD_FILENAMES = [
  "InformationTheoryReduced.txt",
  "InformationTheory.txt",
  "Optimisation.txt",
  "ComputerVision.txt",
  "PatternRecognition.txt",
];

const SPLIT_1 = "\n-----";
const SPLIT_2 = "\n\n\n";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function FlashCards(props) {
  const [front, setFront] = useState(true);
  const [seeList, setSeeList] = useState(false);
  const [idx, setIdx] = useState(0);
  const flip = () =>
    setFront((f) => {
      return !f;
    });

  const toggleList = () =>
    setSeeList((s) => {
      return !s;
    });

  const next = () => {
    if (props.random) {
      setIdx(getRandomInt(props.cards.length));
    } else {
      setIdx((idx) => {
        return (idx + 1) % props.cards.length;
      });
    }
    setFront(true);
  };

  const seeListButton = (
    <p className="see-list" onClick={toggleList}>
      {seeList ? "Hide list" : "See list"}
    </p>
  );

  const title = (
    <p className="flashcard-title">
      {props.filename.split(".")[0]}{" "}
      {seeList
        ? `(${props.cards.length})`
        : `(#${idx + 1}/${props.cards.length})`}
    </p>
  );

  if (!(props.curr === props.filename)){
    return <></>;
  }

  if (!seeList) {
    return (
      <div>
        {title}
        <div
          className={`flashcard ${front ? "" : "flashcard-back"}`}
          onClick={flip}
        >
          <p>
            <Latex>{front ? props.cards[idx][0] : props.cards[idx][1]}</Latex>
          </p>
        </div>
        <button onClick={next} className="flashcard-button">
          Next <b>{"→"}</b>
        </button>
        <button onClick={flip} className="flashcard-button">
          Flip <b>{"⇅"}</b>
        </button>
        {seeListButton}
      </div>
    );
  }

  return (
    <div>
      {title}
      {seeListButton}
      <table>
        <thead>
          <tr>
            <th>Front</th>
            <th>Back</th>
          </tr>
        </thead>
        <tbody>
          {props.cards.map((c, i) => {
            return (
              <tr key={i}>
                <td>
                  <Latex>{c[0]}</Latex>
                </td>
                <td>
                  <Latex>{c[1]}</Latex>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {seeListButton}
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [random, setRandom] = useState(true);
  const [currSet, setCurrSet] = useState(FLASHCARD_FILENAMES[0]);

  async function processTexts(parsedText) {
    const flashData = parsedText.map((t) => {
      return t.split(SPLIT_2).map((l) => l.split(SPLIT_1));
    });
    setData(flashData);
  }

  useEffect(() => {
    Promise.all(
      FLASHCARD_FILENAMES.map((filename) =>
        fetch(`flashcard_data/${filename}`).then((x) => x.text())
      )
    ).then((parsedText) => processTexts(parsedText));
  }, []);

  return (
    <div>
      <div className="title">
        <p>Choose set</p>

        <select value={currSet} onChange={(e) => {setCurrSet(e.target.value)}} className="select">
          {FLASHCARD_FILENAMES.map((f) => {
            return <option value={f} key={f}>{f.split(".")[0]}</option>
          })}
        </select>

        <p>Ordering</p>

        <button
          onClick={() => {
            setRandom((r) => {
              return !r;
            });
          }}
          className="random-button"
        >
          {random ? "Sequential" : "Random"}
        </button>
      </div>

      {data.map((d, i) => {
        return (
          <FlashCards
            cards={d}
            key={i}
            filename={FLASHCARD_FILENAMES[i]}
            random={random}
            curr={currSet}
          />
        );
      })}
    </div>
  );
}

export default App;
