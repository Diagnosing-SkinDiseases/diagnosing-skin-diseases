import React from 'react';
import GlossaryItem from './GlossaryItem';

function GlossaryContent({ items, selectedLetter, searchTerm }) {
  // Filter items based on selectedLetter and searchTerm
  const filteredItems = items.filter(item => {
    // Check if item starts with the selected letter
    const startsWithLetter = item.term.toLowerCase().startsWith(selectedLetter.toLowerCase());
    // Check if item includes the search term
    const includesSearchTerm = item.term.toLowerCase().includes(searchTerm.toLowerCase());
    // Return true if both conditions are met
    return startsWithLetter && includesSearchTerm;
  });

  return (
    <div>
      {selectedLetter && (
        <div className="selected-letter-banner">
          {selectedLetter.toUpperCase()}
        </div>
      )}
      <ul className="glossary-list">
        {filteredItems.map((item, index) => (
          <GlossaryItem key={index} item={item} className="glossary-list-item" />
        ))}
      </ul>
    </div>
  );
}

export default GlossaryContent;

