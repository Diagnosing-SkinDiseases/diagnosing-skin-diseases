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

  // Sort filtered items alphabetically by term
  const sortedItems = filteredItems.sort((a, b) => {
    return a.term.localeCompare(b.term);
  });

  // Group sorted items by their starting letter
  const groupedItems = sortedItems.reduce((groups, item) => {
    const letter = item.term[0].toUpperCase(); // Get the first letter and make it uppercase
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(item);
    return groups;
  }, {});

  return (
    <div>
      {Object.entries(groupedItems).sort(([a], [b]) => a.localeCompare(b)).map(([letter, items]) => (
        <React.Fragment key={letter}>
          <div className="letter-banner">{letter}</div>
          <ul className="glossary-list">
            {items.map((item, index) => (
              <GlossaryItem key={index} item={item} className="glossary-list-item" />
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
}

export default GlossaryContent;

