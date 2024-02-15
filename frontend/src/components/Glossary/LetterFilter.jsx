import React from 'react';

function LetterFilter({ onSelectLetter, selectedLetter }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
      <div className="alphabet-selector">
        {letters.map(letter => (
          <button
            key={letter}
            onClick={() => onSelectLetter(letter)}
            className={selectedLetter === letter ? 'selected' : ''}
          >
            {letter}
          </button>
        ))}
      </div>
  );
}

export default LetterFilter;
