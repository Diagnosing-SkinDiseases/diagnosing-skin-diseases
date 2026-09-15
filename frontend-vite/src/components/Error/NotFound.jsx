import React from 'react';
import "../CSS/Error.css";

/**
 * NotFoundPage Component
 * 
 * Renders a 404 error page when a user navigates to a route that does not exist within the application.
 * This component is typically used in conjunction with routing logic to display a user-friendly error
 * message indicating that the requested page could not be found.
 *
 * Structure:
 * - A div container with a class 'error' which styles the error message according to Error.css.
 * - An h1 header that displays '404 - Not Found!' to clearly indicate that the page is missing.
 * - A paragraph element that provides a more detailed explanation, informing the user that the
 *   page they are looking for does not exist.
 *
 * Usage:
 * - This component should be rendered by the router in response to any undefined paths accessed by the user.
 * 
 * Styling:
 * - Styles are defined in 'Error.css', which typically sets the font, alignment, and other visual aspects
 *   to distinguish this error page from other pages within the application.
 */
const NotFoundPage = () => {
  return (
    <div className='error'>
      <h1>404 - Not Found!</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFoundPage;
