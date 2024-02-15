import React, { useState } from 'react';

function GlossaryItem({ item, onSelectItem, selectedItems }) {
  const isSelected = selectedItems.some(selectedItem => selectedItem.term === item.term);

  return (
    <li onClick={() => onSelectItem(item)} className={`glossary-list-item ${isSelected ? 'selected' : ''}`}>
      <h3>{item.term}</h3>
      {isSelected && <p>{item.definition}</p>}
    </li>
  );
}

export default GlossaryItem;
