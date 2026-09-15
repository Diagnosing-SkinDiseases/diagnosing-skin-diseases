import React, { useState } from 'react';

/**
 * GlossaryItem Component
 * 
 * This component represents a single item in the glossary list. It displays the term and, if selected,
 * shows its definition. It can be clicked to toggle the display of the definition based on its selection status.
 *
 * Props:
 *   item (Object): The glossary item containing at least 'term' and 'definition' properties.
 *   onSelectItem (Function): Function to call when an item is clicked. This function is responsible
 *                             for updating the selection state in the parent component.
 *   selectedItems (Array): Array of currently selected items. Used to determine if 'item' is selected.
 *
 * Behavior:
 *   - The component checks if the 'item' is currently selected by comparing against 'selectedItems'.
 *   - On click, it triggers 'onSelectItem' to toggle the selection status of the item.
 *   - Displays the item's definition if it is selected.
 */
function GlossaryItem({ item, onSelectItem, selectedItems }) {
  // Determine if the current item is selected by checking if it exists in selectedItems
  const isSelected = selectedItems.some(selectedItem => selectedItem.term === item.term);

  return (
    <li onClick={() => onSelectItem(item)} className={`glossary-list-item ${isSelected ? 'selected' : ''}`}>
      <h3>{item.term}</h3>
      {isSelected && <p>{item.definition}</p>}
    </li>
  );
}

export default GlossaryItem;
