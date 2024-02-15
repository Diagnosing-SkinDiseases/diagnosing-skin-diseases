import React, { useState } from 'react';

function GlossaryItem({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
      <h3>{item.term}</h3>
      {isExpanded && <p>{item.definition}</p>}
    </li>
  );
}

export default GlossaryItem;