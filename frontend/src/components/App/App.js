import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminTree from "../AdminDashboard/AdminTrees";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/ContentTypeEnum";
import testData from "../AdminDashboard/testData.json";
import Article from "../Article/Article";
import Glossary from "../Glossary/Glossary";
import Homepage from "../Homepage/Homepage";
import Login from "../Login/Login";
import NavBarComponent from "../NavBar/NavBar";
import TreatmentArticle from "../TreatmentArticles/TreatmentArticles";
import UserTree from "../UserTree/UserTree";
import "./App.css";

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
        <Route path="/admin/trees" element={<AdminTree />}></Route>
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
          element={<TreatmentArticle></TreatmentArticle>}
        ></Route>
        {/* Glossary */}
        <Route path="/glossary" element={<Glossary></Glossary>}></Route>
        {/*Login*/}
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>

      <footer className="footer">Footer</footer>
    </div>
  );
}

export default App;
