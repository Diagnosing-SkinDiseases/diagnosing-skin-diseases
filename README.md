# Diagnosing Skin Diseases

## Overview

Our application aims to revolutionize skin disease diagnosis with an intuitive interface and advanced diagnostic tree. Traditional methods often lead to high rates of misdiagnosis, highlighting the critical need for specialized solutions. Developed by dermatologist Dr. Eileen Murray, David Stambler, and our dedicated team, our application provides precise assessments, empowering healthcare professionals with confidence. Seamlessly integrating React and MongoDB, our user-friendly platform sets a new standard for diagnostic accuracy. Supplementary articles offer invaluable insights into diseases and treatments, promoting proactive skin health management.

## Technologies Used

- **MongoDB**: NoSQL database used for storing user data and application information.
- **Express.js**: Web application framework for building APIs.
- **React**: Frontend framework for building user interfaces.
- **Node.js**: JavaScript runtime environment used for server-side development.
- **Javascript**: enable dynamic content on the client-side, enhancing interactivity for users
- **HTML/CSS**: Markup and styling languages used for frontend development.
- **Vercel**: Deployment platform for hosting the application.

## Website

The application is deployed and accessible at [https://diagnosing-skin-diseases.vercel.app/](https://diagnosing-skin-diseases.vercel.app/).

## Contributors

- **Shuyi Liu** - [GitHub](https://github.com/maz-slo)
- **Jason Shi** - [GitHub](https://github.com/jaason-shi)
- **Sean Sollestre** - [GitHub](https://github.com/SSollestre)
- **Emily Tran** - [GitHub](https://github.com/Emildore)
- **Olga Zimina** - [GitHub](https://github.com/olgazim)

## Contact Information

### Project Owners

- **Dr. Eileen Murray** - Email: <heileenmurray@gmail.com>
- **David Stambler** - Email: <stambler@telus.net>

## User Roles

### General User

- **Functionality**: Access, answer diagnostic questions on a tree, view diagnostic trees, articles, glossary items, and visual tree representations.
- **Access Level**: Standard user privileges.

### Admin User

- **Functionality**: Create, edit, delete diagnostic trees, articles, and glossary items. Manage item publication status, and access admin-specific features.
- **Access Level**: Elevated permissions for administrative tasks

## Supported Browsers

This application is optimized for and best viewed on the following browsers:

- Google Chrome
- Mozilla Firefox
- Safari

## How to Use

1. **Setup**:

- Clone this repository to your local machine.
- Windows, Mac, or Linux OS
- Node.js
- npm
- [MongoDB](https://account.mongodb.com/account/login)
  - Sign in using the client’s credentials
  - Ensure that “Cluster0” is live

2. **Dependencies**: Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

3. **Configurations**:
   Please check the Vercel deployment for .env variables, or request them from the client:

- backend/.env
- frontend/.env
- backend/.vercel.json

4. **Installation**: Please ensure you have backend/.env and frontend/.env installed

- Open two terminals
  - Terminal 1 Commands:
    - cd backend
    - npm i
    - npm start
  - Terminal 2 Commands:
    - cd frontend
    - npm i
    - npm start
- This starts a localhosted instance of your Server (backend) and Client (frontend)
- Please change frontend\src\api.js when using a localhosted Server
- Assign “testApi” to “apiUrl”, replacing “hostedApi”
- When ready for deployment, assign “hostedApi” back to “apiUrl” to ensure the hosted Client uses the hosted Server

5. **Running the Application**:

- Start the React frontend by running `npm start` in the project directory.
- Ensure MongoDB is running locally or configure the application to connect to a remote MongoDB instance.

6. **Usage**:

- Access the application through your browser (by default, it should be available at <http://localhost:3000>).
- Answer the prompted questions with yes or no responses.
- Based on your inputs, the application will provide a diagnosis and recommended treatment.
- Explore supplementary articles for detailed information on specific diseases and treatments.

## Contribution

Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is protected under standard copyright laws. All rights reserved.
