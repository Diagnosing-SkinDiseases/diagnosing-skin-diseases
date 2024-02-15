import "./App.css";
import NavBarComponent from "../NavBar/NavBar";
import { Routes, Route } from "react-router-dom";
import Homepage from "../Homepage/homepage";
import Article from "../Article/Article";
import UserTree from "../UserTree/UserTree";

function App() {
  return (
    <>
      <NavBarComponent></NavBarComponent>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage></Homepage>}></Route>
        {/* User Tree */}
        <Route path="/user-tree" element={<UserTree></UserTree>}></Route>
        {/* Article */}
        <Route path="/article" element={<Article></Article>}></Route>
        {/* Admin */}
        <Route path="/admin" element={<div>Admin</div>}></Route>
        {/* Article List */}
        <Route path="/article-list" element={<div>Article List</div>}></Route>
        {/* Glossary */}
        <Route path="/glossary" element={<div>Glossary</div>}></Route>
      </Routes>
      <footer className="footer">Footer</footer>
    </>
  );
}

export default App;
