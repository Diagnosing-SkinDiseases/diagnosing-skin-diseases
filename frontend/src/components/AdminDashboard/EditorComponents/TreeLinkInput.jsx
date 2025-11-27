import React, { useEffect } from "react";
import Button from "../GeneralComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const TreeLinkInput = ({ block, updateBlock, remove }) => {
  // Parse JSON string safely
  const parseLinks = () => {
    try {
      const parsed = JSON.parse(block.value || "[]");

      // If old format (array of strings), convert them
      if (Array.isArray(parsed) && typeof parsed[0] === "string") {
        return parsed.map((str) => ({ label: "", link: str }));
      }

      return parsed;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    console.log("TreeLink raw state:", block.value);
  }, [block.value]);

  // Add a new blank label/link pair
  const addLink = () => {
    const links = parseLinks();
    const updated = [...links, { label: "", link: "" }];
    updateBlock(JSON.stringify(updated));
    console.log("Added new link object:", updated);
  };

  // Update one field of one link object
  const updateField = (index, field, value) => {
    const links = parseLinks();
    links[index][field] = value;

    const newString = JSON.stringify(links);
    console.log(`Updated link ${index} field "${field}" to:`, value);

    updateBlock(newString);
  };

  const links = parseLinks();

  const removeLink = (index) => {
    const links = parseLinks();
    const updated = links.filter((_, i) => i !== index);
    updateBlock(JSON.stringify(updated));
  };

  return (
    <div className="tree-link-input-container">
      <div className="art-tree-link">
        <h2 className="tree-link-header">Tree Links</h2>
      </div>

      <div className="tree-link-list">
        {links.map((item, i) => (
          <div key={i} className="tree-link-pair">
            <label className="tree-link-label">Label:</label>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateField(i, "label", e.target.value)}
              className="tree-link-input"
              placeholder={`Label ${i + 1}`}
            />

            <label className="tree-link-label">Link:</label>
            <input
              type="text"
              value={item.link}
              onChange={(e) => updateField(i, "link", e.target.value)}
              className="tree-link-input"
              placeholder={`Link ${i + 1}`}
            />
            <button className="delete-button" onClick={() => removeLink(i)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={addLink} className="button add-tree-link-btn">
        Add Tree Link
      </Button>

      <Button onClick={remove} className="delete-button">
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
    </div>
  );
};

export default TreeLinkInput;
