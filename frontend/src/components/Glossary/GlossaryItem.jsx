import React, { useState } from 'react';

function GlossaryItem({ item, onSelectItem, selectedItems }) {
  const isSelected = selectedItems.some(selectedItem => selectedItem.term === item.term);

  return (
    <li onClick={() => onSelectItem(item)} style={{ cursor: 'pointer', background: isSelected ? 'grey' : 'none' }}>
      <h3>{item.term}</h3>
      {isSelected && <p>{item.definition}</p>}
    </li>
  );
}

export default GlossaryItem;
