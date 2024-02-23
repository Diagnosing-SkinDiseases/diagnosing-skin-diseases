import "./App.css";
import NavBarComponent from "../NavBar/NavBar";
import { Routes, Route } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import Article from "../Article/Article";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/enums/ContentTypeEnum";
import testData from '../AdminDashboard/testData.json';

function App() {
  // test data for demo only
  const { trees, definitions, articles } = testData;
  return (
    <div className="app-container">
      <NavBarComponent></NavBarComponent>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage></Homepage>}></Route>
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
        <Route path="/article-list" element={<div>Article List</div>}></Route>
        {/* Glossary */}
        <Route path="/glossary" element={<div>Glossary</div>}></Route>
      </Routes>
      <footer className="footer">Footer</footer>
    </div>
  );
}

export default App;
