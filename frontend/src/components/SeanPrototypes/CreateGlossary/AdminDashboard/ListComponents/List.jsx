import React, { useEffect, useState } from "react";
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import "../styles/List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { apiDeleteGlossaryItem } from "../../../glossaryItemApiController";

const Item = ({ title, published, onPublish, onEdit, onDelete }) => (
  <div className="item">
    <span className="title">{title}</span>
    <span className={`publish-state ${published ? "published" : ""}`}>
      {published ? labels.publishState.published : labels.publishState.added}
    </span>
    <Button
      label={
        published
          ? labels.buttonLabels.publish.publish
          : labels.buttonLabels.publish.unpublish
      }
      onClick={onPublish}
      className="button"
    />
    <Button onClick={onEdit} className="edit-button">
      <FontAwesomeIcon icon={faPen} className="fa-edit" />
    </Button>
    <Button onClick={onDelete} className="delete-button">
      <FontAwesomeIcon icon={faTrashAlt} className="fa-trash-alt " />
    </Button>
  </div>
);

const List = ({ initialItems = [], searchQuery }) => {
  const [items, setItems] = useState(initialItems);

  // Effect hook to update state when initialItems prop changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Toggles the publish state of an item
  const handlePublishToggle = (index) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, published: !item.published };
      }
      return item;
    });
    setItems(newItems);
  };

  // Handles the edit button click
  const handleEditBtn = (index) => {
    console.log("Edit clicked", index);
    // Implement logic to open edit screen
  };

  // Handles the delete button click
  const handleDeleteBtn = (index) => {
    console.log("Delete clicked", index);
    console.log(items[index]);
    apiDeleteGlossaryItem(items[index]._id)
      .then((response) => {
        console.log("Deleted", response.data);
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className="list">
      {items.length > 0 ? (
        items.map((item, index) => (
          <Item
            key={index}
            title={item.title}
            published={item.published}
            onPublish={() => handlePublishToggle(index)}
            onEdit={() => handleEditBtn(index)}
            onDelete={() => handleDeleteBtn(index)}
          />
        ))
      ) : (
        <div className="item">
          <span className="title">No search results found.</span>
        </div>
      )}
    </div>
  );
};

export default List;
