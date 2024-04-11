import React from 'react';

/**
 * LetterFilter Component
 * 
 * Provides an alphabetical selector interface for filtering glossary items by the first letter. This component
 * displays buttons for each letter from A to Z. When a button is clicked, it updates the filter criteria in the
 * parent component through a callback function.
 *
 * Props:
 *   onSelectLetter (Function): A callback function that is called when a letter is selected. It receives the
 *                              selected letter as an argument.
 *   selectedLetter (String): The currently selected letter, used to highlight the active button.
 *
 * Behavior:
 *   - Renders a button for each letter in the English alphabet.
 *   - Clicking a button calls `onSelectLetter` with the letter as its parameter.
 *   - The button for the currently selected letter is highlighted to provide visual feedback.
 */
function LetterFilter({ onSelectLetter, selectedLetter }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Generate an array of alphabet letters

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
