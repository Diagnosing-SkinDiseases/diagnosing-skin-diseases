import ArticleBG from "./ArticleBG";
import ContentType from "./enums";
import "./article.css";
import { useEffect } from "react";

function convertImageToBase64(filePath) {
  return new Promise((resolve, reject) => {
    // Create a new image element
    const img = new Image();

    // Set the src attribute to the file path
    img.src = process.env.PUBLIC_URL + filePath;

    // Define onload event handler
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");

      // Set the canvas dimensions to match the image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Get the 2D context of the canvas
      const ctx = canvas.getContext("2d");

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get the base64 encoded data URL of the image from the canvas
      const base64String = canvas.toDataURL("image/jpeg");

      // Resolve the Promise with the base64 encoded string
      resolve(base64String);
    };

    // Define onerror event handler
    img.onerror = () => {
      // Reject the Promise with an error message
      reject(new Error("Failed to load the image."));
    };
  });
}

// Example usage:
const imagePath = "./sample_image.jpg"; // Replace with the actual image file path
let img_string_64;
await convertImageToBase64(imagePath)
  .then((base64String) => {
    img_string_64 = base64String;
  })
  .catch((error) => {
    console.error("Error converting image to base64:", error);
  });

const sampleData = {
  id: 1,
  title: "Sample Title",
  totalContent: [
    {
      type: ContentType.HEADER,
      content: "Sample Header 1",
    },
    {
      type: ContentType.TEXT,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet quam eget arcu
              pellentesque pellentesque. Ut euismod pretium est, eget pulvinar ligula tristique ac. Proin in
              lacus leo. Nullam gravida ligula vitae eros eleifend, ac posuere mauris fringilla. Morbi sit
              amet dui quis nulla facilisis bibendum eget sit amet sem. Suspendisse potenti. Sed varius justo
              et erat posuere varius. Pellentesque tincidunt metus nec quam eleifend, eget faucibus ligula
              eleifend. Fusce ut dictum ligula. Nullam convallis elit ac accumsan faucibus. Sed ut ultricies
              nulla.`,
    },
    {
      type: ContentType.TEXT,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet quam eget arcu
              pellentesque pellentesque. Ut euismod pretium est, eget pulvinar ligula tristique ac. Proin in
              lacus leo. Nullam gravida ligula vitae eros eleifend, ac posuere mauris fringilla. Morbi sit
              amet dui quis nulla facilisis bibendum eget sit amet sem. Suspendisse potenti. Sed varius justo
              et erat posuere varius. Pellentesque tincidunt metus nec quam eleifend, eget faucibus ligula
              eleifend. Fusce ut dictum ligula. Nullam convallis elit ac accumsan faucibus. Sed ut ultricies
              nulla.`,
    },
    {
      type: ContentType.TEXT,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet quam eget arcu
              pellentesque pellentesque. Ut euismod pretium est, eget pulvinar ligula tristique ac. Proin in
              lacus leo. Nullam gravida ligula vitae eros eleifend, ac posuere mauris fringilla. Morbi sit
              amet dui quis nulla facilisis bibendum eget sit amet sem. Suspendisse potenti. Sed varius justo
              et erat posuere varius. Pellentesque tincidunt metus nec quam eleifend, eget faucibus ligula
              eleifend. Fusce ut dictum ligula. Nullam convallis elit ac accumsan faucibus. Sed ut ultricies
              nulla.`,
    },
    {
      type: ContentType.IMAGE,
      content: img_string_64,
    },
  ],
};

console.log("Rendering...");

const greet = () => {
  console.log("Hello world");
};

const Article = () => {
  useEffect(() => {
    greet();
  }, []);

  return (
    <>
      <ArticleBG data={sampleData}></ArticleBG>
    </>
  );
};

export default Article;
