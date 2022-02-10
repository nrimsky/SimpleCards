import Latex from "react-latex";
import { useEffect, useState } from "react";

const FLASHCARD_FILENAMES = [
  "Optimisation.txt",
  "InformationTheory.txt",
  "ComputerVision.txt",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function FlashCards(props) {
  const [front, setFront] = useState(true);

  const [idx, setIdx] = useState(getRandomInt(props.cards.length));
  const flip = () =>
    setFront((f) => {
      return !f;
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

  return (
    <div>
      <p className="flashcard-title">{props.filename.split(".")[0]}</p>
      <div
        className={`flashcard ${front ? "" : "flashcard-back"}`}
        onClick={flip}
      >
        <p>
          <Latex>{front ? props.cards[idx][0] : props.cards[idx][1]}</Latex>
        </p>
      </div>
      <button onClick={next} className="flashcard-button">
        Next
      </button>
      <button onClick={flip} className="flashcard-button">
        Flip
      </button>
    </div>
  );
}

const SPLIT_1 = "\n-----";
const SPLIT_2 = "\n\n\n";

function App() {
  const [data, setData] = useState([]);
  const [random, setRandom] = useState(true);

  async function processTexts(parsedText) {
    const flashData = parsedText.map((t) => {
      return t.split(SPLIT_2).map((l) => l.split(SPLIT_1));
    });
    setData(flashData);
    console.log(flashData);
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
        <p>
          SimpleCards - some random flashcards, formatted with{" "}
          <Latex>$\LaTeX$</Latex>. Because flashcard apps annoy me.
        </p>

        <button
          onClick={() => {
            setRandom((r) => {
              return !r;
            });
          }}
          className="random-button"
        >
          {random ? "Order sequentially" : "Order randomly"}
        </button>
      </div>

      {data.map((d, i) => {
        return (
          <FlashCards
            cards={d}
            key={i}
            filename={FLASHCARD_FILENAMES[i]}
            random={random}
          />
        );
      })}
    </div>
  );
}

export default App;
