import React, { useEffect, useState, useCallback } from "react";
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import ContentTypeEnum from "../enums/ContentTypeEnum";
import "../../CSS/Admin/List.css";
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

/**
 * Item component displays a single item with its title, publication state, and action buttons.
 *
 * @param {string} props.title The title of the item.
 * @param {boolean} props.published The publication state of the item, true for published.
 * @param {Function} props.onPublish The function to call when the publish/unpublish button is clicked.
 * @param {Function} props.onEdit The function to call when the edit button is clicked.
 * @param {Function} props.onDelete The function to call when the delete button is clicked.
 * @returns {JSX.Element} The rendered item component.
 */
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

/**
 * List component manages and displays a list of items.
 *
 * @param {Array} props.initialItems The initial list of items to be displayed.
 * @param {string} props.contentType The type of content being managed, based on ContentTypeEnum.
 * @param {string} [props.searchQuery] The query used to filter the list of items. Optional.
 * @returns {JSX.Element} The rendered list of items.
 */
const List = ({ initialItems = [], contentType, searchQuery }) => {
  const [items, setItems] = useState(initialItems);
  const navigate = useNavigate();

  /**
   * Effect hook to set the initial list of items.
   * It updates the state of `items` whenever `initialItems` changes.
   */
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  /**
   * Toggles the publish status of an item and updates its state in the database.
   * Depending on the content type, it calls the respective API controller to update the item.
   *
   * @param {number} index - The index of the item in the list.
   * @param {Object} item - The item whose publish status is to be toggled.
   * @param {string} contentType - The type of content, used to determine the appropriate API controller.
   */
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
        console.error("Unknown content type for processing");
        return;
    }
    // Update the item status in the database
    updatePromise
      .then(() => {
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

  /**
   * Handles the edit button click event by navigating to the edit page for the item.
   *
   * @param {number} id - The id of the item to be edited.
   */
  const handleEditBtn = useCallback(
    (id) => {
      const path = `/admin/${contentType.toLowerCase()}s/edit/${id}`;
      navigate(path, { state: { id } });
    },
    [navigate, contentType]
  );

  /**
   * Deletes an item from the list and updates its state in the database.
   *
   * @param {number} index - The index of the item in the list.
   * @param {number} id - The id of the item to be deleted.
   */
  const handleDeleteBtn = (index, id) => {
    // Show the confirmation alert
    const confirmDelete = window.confirm(
      "This will permanently delete the item."
    );

    // If the user clicks "Yes" (OK), proceed with the delete
    if (confirmDelete) {
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
          console.error("Unknown content type for processing");
          return;
      }

      // Delete the item from the database
      deletePromise
        .then((response) => {
          setItems(newItems);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // If the user clicks "No" (Cancel), do nothing
      return;
    }
  };

  /**
   * Renders a list of items, each with actions to publish/unpublish, edit, or delete.
   *
   * @returns {JSX.Element} The list of items with their actions or a message indicating no items.
   */
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
