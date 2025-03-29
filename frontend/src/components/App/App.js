import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import About from "../About/About";
import Article from "../Article/Article";
import ArticlePage from "../ArticleList/ArticleList";
import "../CSS/App.css";
import Glossary from "../Glossary/Glossary";
import Homepage from "../Homepage/Homepage";
import Login from "../Login/Login";
import Logout from "../Logout/Logout";
import NavBarComponent from "../NavBar/NavBar";
import Signup from "../SignUp/SignUp";
import {
  default as BuildUserTree,
  default as UserTree,
} from "../UserTree/UserTrees/BuildUserTree";
import { AuthProvider, useAuth } from "./AuthContext";
import NotFoundPage from "../Error/NotFound";

// Admin Imports
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/enums/ContentTypeEnum";
import UserTreeV2 from "../UserTreeV2/UserTreeV2";

// This function wraps your Routes and uses useAuth to access the auth state
function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth(); // Use the isLoggedIn state from AuthContext
  if (isLoading) {
    return <div>Loading...</div>; // Or some loading spinner
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <NavBarComponent></NavBarComponent>
        <div className="content-container">
          <Routes>
            {/* Admin */}
            {/* Admin - Trees */}
            <Route
              path="/admin/trees"
              element={
                <ProtectedRoute>
                  <AdminDashboard contentType={ContentTypeEnum.TREE} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Trees - Add */}
            <Route
              path="/admin/trees/add"
              element={
                <ProtectedRoute>
                  <ContentEditor contentType={ContentTypeEnum.TREE} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Trees - Edit */}
            <Route
              path="/admin/trees/edit/:id"
              element={
                <ProtectedRoute>
                  <ContentEditor
                    contentType={ContentTypeEnum.TREE}
                  ></ContentEditor>
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Trees - Preview */}
            <Route
              path="/admin/trees/preview"
              element={
                <ProtectedRoute>
                  {/* <BuildUserTree></BuildUserTree> */}
                  <UserTreeV2></UserTreeV2>
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Articles */}
            <Route
              path="/admin/articles"
              element={
                <ProtectedRoute>
                  <AdminDashboard contentType={ContentTypeEnum.ARTICLE} />
                </ProtectedRoute>
              }
            ></Route>
            {/* Admin - Articles - Add */}
            <Route
              path="/admin/articles/add"
              element={
                <ProtectedRoute>
                  <ContentEditor contentType={ContentTypeEnum.ARTICLE} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Articles - Edit */}
            <Route
              path="/admin/articles/edit/:id"
              element={
                <ProtectedRoute>
                  <ContentEditor contentType={ContentTypeEnum.ARTICLE} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Articles - Preview */}
            <Route
              path="admin/articles/preview"
              element={
                <ProtectedRoute>
                  <Article />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Glossary */}

            <Route
              path="/admin/definitions"
              element={
                <ProtectedRoute>
                  <AdminDashboard contentType={ContentTypeEnum.DEFINITION} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Glossary - Add */}
            <Route
              path="/admin/definitions/add"
              element={
                <ProtectedRoute>
                  <ContentEditor contentType={ContentTypeEnum.DEFINITION} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Glossary - Edit */}
            <Route
              path="/admin/definitions/edit/:id"
              element={
                <ProtectedRoute>
                  <ContentEditor contentType={ContentTypeEnum.DEFINITION} />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin - Glossary - Preview */}
            <Route
              path="admin/definitions/preview"
              element={
                <ProtectedRoute>
                  <Glossary />
                </ProtectedRoute>
              }
            ></Route>

            {/* User Routes */}
            {/* Homepage */}
            <Route path="/" element={<Homepage></Homepage>}></Route>

            {/* User - Trees */}
            <Route path="/trees" element={<UserTree></UserTree>}></Route>

            {/* User - Trees - White Macules */}
            <Route
              path="/trees/:id"
              element={
                // <BuildUserTree />
                <UserTreeV2 />
              }
            ></Route>

            {/* User - Trees - OldVer */}
            <Route
              path="v1/trees/:id"
              element={
                <BuildUserTree />
                // <UserTreeV2 />
              }
            ></Route>

            {/* Article List */}
            <Route path="/treatment" element={<ArticlePage />}></Route>

            {/* Article */}
            <Route path="/treatment/:title/:id" element={<Article />}></Route>

            {/* Glossary */}
            <Route path="/glossary" element={<Glossary></Glossary>}></Route>

            {/* How To */}
            <Route path="/how-to/:title/:id" element={<Article />}></Route>
            <Route
              path="/how-to-understand-skin/:title/:id"
              element={<Article />}
            ></Route>
            <Route
              path="/how-to-diagnose/:title/:id"
              element={<Article />}
            ></Route>
            <Route
              path="/how-to-treat/:title/:id"
              element={<Article />}
            ></Route>

            {/*Login*/}
            <Route path="/login" element={<Login></Login>}></Route>

            {/*Logout*/}
            <Route path="/logout" element={<Logout />}></Route>

            {/*Signup*/}
            <Route
              path="/signup"
              element={
                <ProtectedRoute>
                  <Signup></Signup>
                </ProtectedRoute>
              }
            ></Route>

            {/* About DSD */}
            <Route path="/about" element={<About />}></Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        {/* <div className="footer-placeholder"></div> */}
        <footer className="footer">
          © 2024 Diagnosing Skin Diseases and Dr. Eileen Murray.
          Questions?&nbsp;
          <a href="/about?selectedItem=Contact" className="footer-link">
            Contact us.
          </a>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
