import "./App.css";
import NavBarComponent from "../NavBar/NavBar";
import { Routes, Route } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import Article from "../Article/Article";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/ContentTypeEnum";
import testData from "../AdminDashboard/testData.json";
import ResearchArticles from "../ResearchArticles/ResearchArticles";
import Glossary from "../Glossary/Glossary";

function App() {
  return (
    <>
      <NavBarComponent></NavBarComponent>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage></Homepage>}></Route>
        {/* Article */}
        <Route path="/article" element={<Article></Article>}></Route>
        {/* Admin */}
        <Route path="/admin" element={<div>Admin</div>}></Route>
        {/* Article List */}
        <Route
          path="/article-list"
          element={<ResearchArticles></ResearchArticles>}
        ></Route>
        {/* Glossary */}
        <Route path="/glossary" element={<div>Glossary</div>}></Route>
      </Routes>
      <footer className="footer">Footer</footer>
    </>
  );
}

export default App;
