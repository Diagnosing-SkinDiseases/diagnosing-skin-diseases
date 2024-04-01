import React, { useEffect, useState, useCallback } from "react";
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import ContentTypeEnum from "../enums/ContentTypeEnum";
import "../styles/List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  apiDeleteGlossaryItem,
  apiUpdateGlossaryItem,
} from "../../../apiControllers/glossaryItemApiController";
import {
  apiDeleteArticle,
  apiUpdateArticle,
} from "../../../apiControllers/articleApiController";
import {
  apiDeleteTree,
  apiUpdateTree,
} from "../../../apiControllers/treeApiController";

// Item component to display each item in the list
const Item = ({ title, published, onPublish, onEdit, onDelete }) => (
  <div className="item">
    <span className="title">{title}</span>
    <span className={`publish-state ${published ? "published" : ""}`}>
      {published ? labels.publishState.published : labels.publishState.added}
    </span>
    <Button
      label={
        published
          ? labels.buttonLabels.publish.unpublish
          : labels.buttonLabels.publish.publish
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

// list component to display a list of items
const List = ({ initialItems = [], contentType, searchQuery }) => {
  const [items, setItems] = useState(initialItems);
  const navigate = useNavigate();

  // Effect hook to update state when initialItems prop changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Toggles the publish state of an item
  const handlePublishToggle = (index, item, contentType) => {
    let updatePromise;
    let newStatus = item.published ? "UNPUBLISHED" : "PUBLISHED";
    let updatedItem = { id: item.id, status: newStatus };

    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        updatePromise = apiUpdateGlossaryItem(updatedItem);
        break;
      case ContentTypeEnum.ARTICLE:
        updatePromise = apiUpdateArticle(updatedItem);
        break;
      case ContentTypeEnum.TREE:
        updatePromise = apiUpdateTree(updatedItem);
        break;
      default:
        console.log("Unknown content type for processing");
        return;
    }
    // Update the item status in the database
    updatePromise
      .then(() => {
        console.log("items", items);
        const newItems = items.map((item, i) => {
          if (i === index) {
            return { ...item, published: !item.published };
          }
          return item;
        });
        setItems(newItems);
      })
      .catch((error) => {
        console.error("Error updating item status", error);
      });
  };

  // Handles the edit button click
  const handleEditBtn = useCallback(
    (id) => {
      const path = `/admin/${contentType.toLowerCase()}s/edit/${id}`;
      navigate(path, { state: { id } });
    },
    [navigate, contentType]
  );

  // Handles the delete button click
  const handleDeleteBtn = (index, id) => {
    console.log("Delete clicked", id);
    let deletePromise;
    const newItems = items.filter((_, i) => i !== index);

    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        deletePromise = apiDeleteGlossaryItem(id);
        break;
      case ContentTypeEnum.ARTICLE:
        deletePromise = apiDeleteArticle(id);
        break;
      case ContentTypeEnum.TREE:
        deletePromise = apiDeleteTree(id);
        break;
      default:
        console.log("Unknown content type for processing");
        return;
    }
    // Delete the item from the database
    deletePromise
      .then((response) => {
        console.log("Deleted", response.data);
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
            onPublish={() => handlePublishToggle(index, item, contentType)}
            onEdit={() => handleEditBtn(item.id, contentType)}
            onDelete={() => handleDeleteBtn(index, item.id)}
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
