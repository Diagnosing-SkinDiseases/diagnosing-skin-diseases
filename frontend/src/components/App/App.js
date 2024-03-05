import { Route, Routes } from "react-router-dom";
import About from "../AboutDSD/About";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminEditTrees from "../AdminDashboard/AdminEditTrees";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/enums/ContentTypeEnum";
import testData from "../AdminDashboard/testData.json";
import Article from "../Article/Article";
import Glossary from "../Glossary/Glossary";
import Homepage from "../Homepage/Homepage";
import Login from "../Login/Login";
import NavBarComponent from "../NavBar/NavBar";
import ArticlePage from "../ArticleList/ArticleList";
import UserTree from "../UserTree/UserTree";
import "./App.css";

// Test components - Sean
import TestAdminDashboard from "../SeanPrototypes/LoadArticles/AdminDashboard/AdminDashboard";
import TestResearchArticles from "../SeanPrototypes/LoadArticles/UserFacingArticles/ResearchArticles/ResearchArticles";
import CreateArticle from "../SeanPrototypes/CreateArticle/CreateArticle";
import TestGlossaryAdminDashboard from "../SeanPrototypes/LoadGlossary/AdminDashboard/AdminDashboard";
import TestGlossaryContentEditor from "../SeanPrototypes/CreateGlossary/AdminDashboard/ContentEditor";
import TestGlossary from "../SeanPrototypes/LoadGlossary/UserFacing/Glossary/Glossary";

// Test APIs Sean
import ArticleApiTests from "../SeanPrototypes/ApiTesting/ArticleApiTests";

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

        {/* Admin - Trees - Edit */}
        <Route path="/admin/trees/edit" element={<AdminEditTrees />}></Route>

        {/* Admin - Articles */}
        <Route
          path="/admin/articles"
          element={<AdminDashboard data={articles} />}
        ></Route>
        {/* Admin - Glossary - Add */}
        <Route
          path="/admin/articles/add"
          element={<ContentEditor contentType={ContentTypeEnum.ARTICLE} />}
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
        <Route path="/treatment" element={<ArticlePage />}></Route>

        {/* Glossary */}
        <Route path="/glossary" element={<Glossary></Glossary>}></Route>

        {/*Login*/}
        <Route path="/login" element={<Login></Login>}></Route>

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
              element={<ContentEditor contentType={ContentTypeEnum.ARTICLE} />}
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
              element={<TestGlossaryContentEditor></TestGlossaryContentEditor>}
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
          </Route>
        </Route>
      </Routes>

      <footer className="footer">Footer</footer>
    </div>
  );
}

export default App;
