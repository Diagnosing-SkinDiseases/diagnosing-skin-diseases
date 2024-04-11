import React from 'react';
import GlossaryItem from './GlossaryItem';

/**
 * GlossaryContent Component
 * 
 * Responsible for rendering the list of glossary items that are filtered based on selected letter and search term.
 * It organizes glossary items into groups by their starting letter after filtering and sorting, and then displays
 * each group with a heading for the letter and a list of items under that letter.
 *
 * Props:
 *   items (Array): Array of all glossary items to be displayed.
 *   selectedLetter (String): The letter selected by the user for filtering items.
 *   searchTerm (String): The search term entered by the user to filter items.
 *   selectedItems (Array): Array of items that have been selected or highlighted by the user.
 *   onSelectItem (Function): Handler function to be called when an item is selected, passed down to each GlossaryItem.
 *
 * Filtering Logic:
 *   - Filters items to include only those that start with the selected letter and contain the search term.
 *
 * Sorting Logic:
 *   - Sorts the filtered items alphabetically by their term.
 *
 * Grouping Logic:
 *   - Groups sorted items by their starting letter to facilitate display under categorized headers.
 */
function GlossaryContent({ items, selectedLetter, searchTerm, selectedItems, onSelectItem }) {
  // Filter items based on selectedLetter and searchTerm
  const filteredItems = items.filter(item => {
    const startsWithLetter = item.term.toLowerCase().startsWith(selectedLetter.toLowerCase());
    const includesSearchTerm = item.term.toLowerCase().includes(searchTerm.toLowerCase());
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
              <GlossaryItem key={index} item={item} onSelectItem={onSelectItem} selectedItems={selectedItems} className="glossary-list-item" />
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
}

export default GlossaryContent;

