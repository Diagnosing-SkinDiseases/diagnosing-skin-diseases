import Paragraph from "./ContentTypes/Paragraph";
import "./CreateArticle.css";
import ButtonGroup from "./ButtonGroup";
import { useEffect, useState } from "react";
import ArticleContentType from "./articleContentType";
import axios from "axios";
import apiUrl from "../../../api";

/**
const ArticleContentType = {
  HEADER1: "HEADER1",
  HEADER2: "HEADER2",
  PARAGRAPH: "PARAGRAPH",
  PNG: "PNG",
  JPEG: "JPEG",
  GIF: "GIF",
  VIDEO: "VIDEO",
};
 */
const renderContent = (content, index, onContentChange) => {
  const { type } = content;
  const identifier = `${type}${index}`;

  switch (type) {
    case ArticleContentType.PARAGRAPH:
      return (
        <Paragraph
          id={identifier}
          key={identifier}
          onChange={(event) => {
            onContentChange(event, index);
          }}
        ></Paragraph>
      );
    default:
      return <div key={identifier}></div>;
  }
};

const CreateArticle = () => {
  const [content, setContent] = useState([]);
  const [title, setTitle] = useState("");

  const addContent = (newType) => {
    setContent((prevContent) => [
      ...prevContent,
      { type: newType, content: "" },
    ]);
  };

  const onContentChange = (event, index) => {
    const updatedContent = [...content];
    const newContent = updatedContent[index];
    newContent.content = event.target.value;
    updatedContent[index] = newContent;
    setContent(updatedContent);
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const publish = () => {
    const payload = {
      title,
      content,
      published: "published",
    };

    console.log(payload);

    axios
      .post(`${apiUrl}/article/create`, payload)
      .then((response) => {
        console.log("Success:", response);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error.response.data);
      });
  };

  useEffect(() => {
    console.log(title);
    console.log(content);
  });

  return (
    <>
      <div className="container mt-5">
        <div className="my-3">
          <label
            htmlFor="title"
            className="d-block form-label create-article-label"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            onChange={onTitleChange}
          ></input>
        </div>
        {content.map((content, index) => {
          return renderContent(content, index, onContentChange);
        })}
        <div>
          <button
            className="btn btn-primary"
            onClick={() => addContent("PARAGRAPH")}
          >
            Add section
          </button>
        </div>
        <ButtonGroup content={content} publish={publish}></ButtonGroup>
      </div>
    </>
  );
};

export default CreateArticle;
