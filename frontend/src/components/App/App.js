import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import About from "../AboutDSD/About";
import Article from "../Article/Article";
import Glossary from "../Glossary/Glossary";
import Homepage from "../Homepage/Homepage";
import Login from "../Login/Login";
import Logout from "../Logout/Logout";
import NavBarComponent from "../NavBar/NavBar";
import ArticlePage from "../ArticleList/ArticleList";
import UserTree from "../UserTree/TreeComponents/UserTree";
import WhiteMacules from "../UserTree/UserTrees/WhiteMacules";
import Signup from "../SignUp/SignUp";
import "./App.css";

// Admin Imports
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminEditTrees from "../AdminDashboard/AdminEditTrees";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/enums/ContentTypeEnum";
import testData from "../AdminDashboard/testData.json";

// Test components - Sean
import TestAdminDashboard from "../SeanPrototypes/LoadArticles/AdminDashboard/AdminDashboard";
import TestResearchArticles from "../SeanPrototypes/LoadArticles/UserFacingArticles/ResearchArticles/ResearchArticles";
import CreateArticle from "../SeanPrototypes/CreateArticle/CreateArticle";
import TestGlossaryAdminDashboard from "../SeanPrototypes/LoadGlossary/AdminDashboard/AdminDashboard";
import TestGlossaryContentEditor from "../SeanPrototypes/CreateGlossary/AdminDashboard/ContentEditor";
import TestGlossary from "../SeanPrototypes/LoadGlossary/UserFacing/Glossary/Glossary";

// Test APIs Sean
import ArticleApiTests from "../SeanPrototypes/ApiTesting/ArticleApiTests";
import GlossaryItemApiTests from "../SeanPrototypes/ApiTesting/GlossaryItemApiTests";
import TreeApiTests from "../SeanPrototypes/ApiTesting/TreeApiTests";

// This function wraps your Routes and uses useAuth to access the auth state
function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth(); // Use the isLoggedIn state from AuthContext
  if (isLoading) {
    return <div>Loading...</div>; // Or some loading spinner
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  // test data for demo only
  const { trees, definitions, articles } = testData;

  return (
    <AuthProvider>
      <div className="app-container">
        <NavBarComponent></NavBarComponent>
        <Routes>
          {/* Admin */}
          {/* Admin - Trees */}
          <Route
            path="/admin/trees"
            element={
              <ProtectedRoute>
                <AdminDashboard data={trees} />
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
            path="/admin/trees/edit"
            element={
              <ProtectedRoute>
                <AdminEditTrees />
              </ProtectedRoute>
            }
          ></Route>

          {/* Admin - Articles */}
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <AdminDashboard data={articles} />
              </ProtectedRoute>
            }
          />
          {/* Admin - Articles - Add */}
          <Route
            path="/admin/articles/add"
            element={
              <ProtectedRoute>
                <ContentEditor contentType={ContentTypeEnum.ARTICLE} />
              </ProtectedRoute>
            }
          ></Route>

          {/* Admin - Glossary */}
          <Route
            path="/admin/definitions"
            element={
              <ProtectedRoute>
                <AdminDashboard data={definitions} />
              </ProtectedRoute>
            }
          ></Route>

          {/* Admin - Glossary - Add */}
          <Route
            path="/admin/definitions/add"
            element={
              <ProtectedRoute>
                <ContentEditor contentType={ContentTypeEnum.DEFINITION} />{" "}
              </ProtectedRoute>
            }
          ></Route>

          {/* User Routes */}
          {/* Homepage */}
          <Route path="/" element={<Homepage></Homepage>}></Route>

          {/* User - Trees */}
          <Route path="/user/trees" element={<UserTree></UserTree>}></Route>

          {/* User - Trees - White Macules */}
          <Route
            path="/user/trees/white_macules"
            element={<WhiteMacules></WhiteMacules>}
          ></Route>

          {/* Article List */}
          <Route path="/treatment" element={<ArticlePage />}></Route>

          {/* Article */}
          <Route path="/treatment/:id" element={<Article />}></Route>

          {/* Glossary */}
          <Route path="/glossary" element={<Glossary></Glossary>}></Route>

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

          {/* Testing - Sean*/}
          <Route path="/test">
            <Route path="admin">
              {/* Test admin - articles */}
              <Route
                path="articles"
                element={<TestAdminDashboard></TestAdminDashboard>}
              ></Route>
              {/* Test admin - articles - add */}
              <Route
                path="articles/add"
                element={<CreateArticle></CreateArticle>}
              ></Route>
              {/* Test reference */}
              <Route
                path="add/sample"
                element={
                  <ContentEditor contentType={ContentTypeEnum.ARTICLE} />
                }
              ></Route>
              {/* Test admin - definitions (glossary) */}
              <Route
                path="definitions"
                element={
                  <TestGlossaryAdminDashboard></TestGlossaryAdminDashboard>
                }
              ></Route>
              {/* Test admin - definitions - add */}
              <Route
                path="definitions/add"
                element={
                  <TestGlossaryContentEditor></TestGlossaryContentEditor>
                }
              ></Route>
            </Route>
            {/* Test user - articles */}
            <Route
              path="article-list"
              element={<TestResearchArticles></TestResearchArticles>}
            ></Route>
            {/* Test user - glossary */}
            <Route
              path="glossary"
              element={<TestGlossary></TestGlossary>}
            ></Route>
            {/* Test APIs */}
            <Route path="api">
              {/* Test Articles API */}
              <Route
                path="articles"
                element={<ArticleApiTests></ArticleApiTests>}
              ></Route>
              {/* Test Glossary API */}
              <Route
                path="glossary"
                element={<GlossaryItemApiTests></GlossaryItemApiTests>}
              ></Route>
              {/* Test Tree API */}
              <Route
                path="trees"
                element={<TreeApiTests></TreeApiTests>}
              ></Route>
            </Route>
          </Route>
        </Routes>

        <footer className="footer">Footer</footer>
      </div>
    </AuthProvider>
  );
}

export default App;
