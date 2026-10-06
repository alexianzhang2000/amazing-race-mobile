import { useEffect, useMemo, useState } from 'react';
import spot from './assets/spot.jpg';

const COLS = 4;
const ROWS = 5;
const TOTAL = COLS * ROWS;

function shuffledTiles() {
  const a = Array.from({ length: TOTAL }, (_, i) => i);

  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.every((v, i) => v === i));

  return a;
}

export default function Jigsaw({ solved = false, onComplete }) {
  const [tiles, setTiles] = useState(() => shuffledTiles());
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [complete, setComplete] = useState(solved);

  const isSolved = useMemo(
    () => tiles.every((tile, index) => tile === index),
    [tiles]
  );

  useEffect(() => {
    if (isSolved && !complete) {
      setComplete(true);
      onComplete?.();
    }
  }, [isSolved, complete, onComplete]);

  function tap(index) {
    if (complete) return;

    if (selected === null) {
      setSelected(index);
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    const next = [...tiles];
    [next[selected], next[index]] = [next[index], next[selected]];

    setTiles(next);
    setSelected(null);
    setMoves((m) => m + 1);
  }

  function reset() {
    setTiles(shuffledTiles());
    setSelected(null);
    setMoves(0);
    setComplete(false);
  }

  return (
    <div className="jigsaw">
      <div className="jigsaw-head">
        <div>
          <strong>
            {complete ? 'You found it! 🎉' : 'Piece it together'}
          </strong>

          <span>
            {complete
              ? 'That looks familiar...'
              : 'Tap two pieces to swap them'}
          </span>
        </div>

        {!complete && (
          <div className="jigsaw-count">
            {moves} {moves === 1 ? 'move' : 'moves'}
          </div>
        )}
      </div>

      <div
        className={'jigsaw-board' + (complete ? ' solved' : '')}
      >
        {tiles.map((tile, position) => {
          const sourceRow = Math.floor(tile / COLS);
          const sourceCol = tile % COLS;

          const isSelected = selected === position;
          const isCorrect = tile === position;

          return (
            <button
              key={position}
              className={
                'jpiece' +
                (isSelected ? ' selected' : '') +
                (complete ? ' completed' : '') +
                (isCorrect && !complete ? ' correct' : '')
              }
              onClick={() => tap(position)}
              aria-label={`Puzzle piece ${position + 1}`}
              style={{
                backgroundImage: `url(${spot})`,
                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `
                  ${sourceCol * (100 / (COLS - 1))}%
                  ${sourceRow * (100 / (ROWS - 1))}%
                `,
              }}
            >
              {isSelected && <span className="piece-glow" />}
            </button>
          );
        })}
      </div>

      {!complete && (
        <div className="jigsaw-help">
          <span>🧩</span>
          Find the picture of the two of you.
        </div>
      )}

      {complete && (
        <button className="jigsaw-reset" onClick={reset}>
          Mix it up again
        </button>
      )}
    </div>
  );
}