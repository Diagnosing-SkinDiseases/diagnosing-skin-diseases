import { Route, Routes } from "react-router-dom";
import About from "../AboutDSD/About";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminEditTrees from "../AdminDashboard/AdminEditTrees";
import ContentEditor from "../AdminDashboard/ContentEditor";
import ContentTypeEnum from "../AdminDashboard/ContentTypeEnum";
import testData from "../AdminDashboard/testData.json";
import Article from "../Article/Article";
import Glossary from "../Glossary/Glossary";
import Homepage from "../Homepage/Homepage";
import Login from "../Login/Login";
import NavBarComponent from "../NavBar/NavBar";
import TreatmentArticles from "../TreatmentArticles/TreatmentArticles";
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
        <Route path="/treatment" element={<TreatmentArticles />}></Route>

        {/* Glossary */}
        <Route path="/glossary" element={<Glossary></Glossary>}></Route>

        {/*Login*/}
        <Route path="/login" element={<Login></Login>}></Route>

        {/* About DSD */}
        <Route path="/about" element={<About />}></Route>
      </Routes>

      <footer className="footer">Footer</footer>
    </div>
  );
}

export default App;
