import { useEffect, useMemo, useState } from 'react';
import spot from './assets/spot.jpg';
import { remember } from './keepsakes.js';

const COLS = 4;
const ROWS = 5;
const TOTAL = COLS * ROWS;

const ordered = () => Array.from({ length: TOTAL }, (_, i) => i);

function shuffledTiles() {
  const a = ordered();

  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.every((v, i) => v === i));

  return a;
}

export default function Jigsaw({ solved = false, onComplete }) {
  const [ratio, setRatio] = useState(null);      // the photo's real width / height (null while loading)
  const [tiles, setTiles] = useState(() => (solved ? ordered() : shuffledTiles()));
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [complete, setComplete] = useState(solved);
  const [fresh, setFresh] = useState(false);     // true only when she solves it just now (plays the reveal animation)

  // Load the photo first, so the board is cut to its real proportions (no stretching)
  useEffect(() => {
    let live = true;
    const im = new Image();
    im.onload = () => live && setRatio(im.naturalWidth / im.naturalHeight || 0.8);
    im.onerror = () => live && setRatio(0.8);
    im.src = spot;
    return () => { live = false; };
  }, []);

  const isSolved = useMemo(
    () => tiles.every((tile, index) => tile === index),
    [tiles]
  );

    useEffect(() => {
    if (isSolved && !complete) {
      setComplete(true);
      setFresh(true);
      remember('puzzleMoves', moves);
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

      {ratio === null ? (
        <div className="sk sk-load jigsaw-skel"><span className="sk-shim" aria-hidden="true" /></div>
      ) : (
        <div className={'jigsaw-frame' + (complete && fresh ? ' won' : '')}>
          <div
            className={'jigsaw-board' + (complete ? ' solved' : '')}
            style={{ aspectRatio: ratio }}
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
                    backgroundPosition: `${sourceCol * (100 / (COLS - 1))}% ${sourceRow * (100 / (ROWS - 1))}%`,
                  }}
                >
                  {isSelected && <span className="piece-glow" />}
                </button>
              );
            })}
          </div>

          {/* Solved: the whole photo fades in over the board, so the seams and gaps disappear */}
          {complete && <img className={'jigsaw-reveal' + (fresh ? ' anim' : '')} src={spot} alt="The finished picture" />}
        </div>
      )}

      {!complete && (
        <div className="jigsaw-help">
          <span>🧩</span>
          Find the picture of the two of you.
        </div>
      )}
    </div>
  );
}