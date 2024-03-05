import React, { useEffect, useState } from "react";
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import ContentTypeEnum from "../enums/ContentTypeEnum";
import "../styles/List.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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

const List = ({ initialItems = [], contentType, searchQuery  }) => {
  const [items, setItems] = useState(initialItems);
  const navigate = useNavigate();

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

  const setRoute = (contentType, item) => {
    let path = "";
    switch (contentType) {
      case ContentTypeEnum.TREE:
        path = "/admin/trees/edit/";
        break;
      case ContentTypeEnum.ARTICLE:
        path = "/admin/articles/edit/";
        break;
      case ContentTypeEnum.DEFINITION:
        path = "/admin/definitions/edit/";
        break;
      default:
        console.log("Unknown content type");
        return;
    }
    navigate(`${path}${item.title}`, { state: { item } });;
  }

  // Handles the edit button click
  const handleEditBtn = (item, contentType) => {
    console.log("Edit clicked", item.title);
    // Implement logic to open edit screen
    setRoute(contentType, item);
  };

  // Handles the delete button click
  const handleDeleteBtn = (index) => {
    console.log("Delete clicked", index);
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
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
            onEdit={() => handleEditBtn(item, contentType)}
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
