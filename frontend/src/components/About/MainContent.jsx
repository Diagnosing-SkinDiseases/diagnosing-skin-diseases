// import React, { useEffect, useState } from "react";

// // Function to fetch article ID from the backend
// const MainContent = () => {
//   const [articleId, setArticleId] = useState(null);

//   useEffect(() => {
//     const fetchArticleId = async () => {
//       try {
//         const id = await fetchArticleIdFromBackend();
//         setArticleId(id);
//       } catch (error) {
//         console.error("Error fetching article ID:", error);
//       }
//     };

//     fetchArticleId();
//   }, []);

//   // Render content based on the fetched article ID
//   return (
//     <div className="col-md-9 mt-4">
//       <div>
//         {articleId === 1 && (
//           <div>
//             <h2>About the Program</h2>
//             {/* Content for article with ID 1 */}
//           </div>
//         )}
//         {articleId === 2 && (
//           <div>
//             <h2>Another Article</h2>
//             {/* Content for article with ID 2 */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainContent;

// MainContent.js
// import React from "react";

// const MainContent = () => {
//   return (
//     <div className="col-md-9 mt-4">
//       <div>
//         <h2>About the Program</h2>
//         <p>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
//           nulla ut dolor condimentum fermentum. Proin tincidunt vehicula massa
//           vel fringilla. Nullam efficitur odio vel mauris eleifend, ac vehicula
//           enim tincidunt. Aliquam erat volutpat. Vestibulum ante ipsum primis in
//           faucibus orci luctus et ultrices posuere cubilia Curae; Mauris pretium
//           condimentum eros, in lobortis velit congue sit amet. Integer sodales
//           magna id metus suscipit, et tempus sem sollicitudin. Phasellus at urna
//           eget ligula congue venenatis.
//         </p>
//         <p>
//           Nullam efficitur felis nec neque fermentum, id fringilla elit
//           vestibulum. Vestibulum nec urna varius, sollicitudin risus id,
//           placerat libero. Maecenas vel lectus risus. Nam tincidunt orci auctor
//           nibh vehicula, sed luctus nunc suscipit. Aenean volutpat sagittis
//           odio, id lobortis tortor. Ut dignissim interdum sem, a tempor libero
//           varius non. Nullam ac turpis ultricies, condimentum velit eu, sagittis
//           neque. Nulla facilisi.
//         </p>
//         <p>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
//           nulla ut dolor condimentum fermentum. Proin tincidunt vehicula massa
//           vel fringilla. Nullam efficitur odio vel mauris eleifend, ac vehicula
//           enim tincidunt. Aliquam erat volutpat. Vestibulum ante ipsum primis in
//           faucibus orci luctus et ultrices posuere cubilia Curae; Mauris pretium
//           condimentum eros, in lobortis velit congue sit amet. Integer sodales
//           magna id metus suscipit, et tempus sem sollicitudin. Phasellus at urna
//           eget ligula congue venenatis.
//         </p>
//         <p>
//           Nullam efficitur felis nec neque fermentum, id fringilla elit
//           vestibulum. Vestibulum nec urna varius, sollicitudin risus id,
//           placerat libero. Maecenas vel lectus risus. Nam tincidunt orci auctor
//           nibh vehicula, sed luctus nunc suscipit. Aenean volutpat sagittis
//           odio, id lobortis tortor. Ut dignissim interdum sem, a tempor libero
//           varius non. Nullam ac turpis ultricies, condimentum velit eu, sagittis
//           neque. Nulla facilisi.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MainContent;
