import "./App.css";
import NavBarComponent from "../NavBar/NavBar";
import { Routes, Route } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import Article from "../Article/Article";
import Glossary from "../Glossary/Glossary";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/ContentTypeEnum";
import testData from "../AdminDashboard/testData.json";
import ResearchArticles from "../ResearchArticles/ResearchArticles";
import UserTree from "../UserTree/UserTree";
import Login from "../Login/Login";
import TestAdminDashboard from "../SeanPrototypes/LoadArticles/AdminDashboard/AdminDashboard";
import TestResearchArticles from "../SeanPrototypes/LoadArticles/UserFacingArticles/ResearchArticles/ResearchArticles";

function App() {
  // test data for demo only
  const { trees, definitions, articles } = testData;

  return (
    <div className="app-container">
      <NavBarComponent></NavBarComponent>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage></Homepage>}></Route>
        {/* User - Trees */}
        <Route path="/user/trees" element={<UserTree></UserTree>}></Route>
        {/* Article */}
        <Route path="/article" element={<Article></Article>}></Route>
        {/* Admin */}
        {/* Admin - Trees */}
        <Route
          path="/admin/trees"
          element={<AdminDashboard data={trees} />}
        ></Route>
        {/* Admin - Articles */}
        <Route
          path="/admin/articles"
          element={<AdminDashboard data={articles} />}
        ></Route>
        {/* Admin - Glossary */}
        <Route
          path="/admin/definitions"
          element={<AdminDashboard data={definitions} />}
        ></Route>
        {/* Admin - Glossary - Add */}
        <Route
          path="/admin/definitions/add"
          element={<ContentEditor contentType={ContentTypeEnum.DEFINITION} />}
        ></Route>
        {/* Article List */}
        <Route
          path="/article-list"
          element={<ResearchArticles></ResearchArticles>}
        ></Route>
        {/* Glossary */}
        <Route path="/glossary" element={<Glossary></Glossary>}></Route>
        {/*Login*/}
        <Route path="/login" element={<Login></Login>}></Route>

        {/* Testing */}
        <Route path="/test">
          {/* Test admin - articles */}
          <Route path="admin">
            <Route
              path="articles"
              element={<TestAdminDashboard></TestAdminDashboard>}
            ></Route>
          </Route>
          {/* Test user - articles */}
          <Route
            path="article-list"
            element={<TestResearchArticles></TestResearchArticles>}
          ></Route>
        </Route>
      </Routes>

      <footer className="footer">Footer</footer>
    </div>
  );
}

export default App;
