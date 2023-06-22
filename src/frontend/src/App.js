import Header from "./components/Header";
import Blogs from "./components/Blogs";
import UserBlogs from "./components/UserBlogs";
import BlogDetail from "./components/BlogDetail";
import AddBlog from "./components/AddBlog";
import NotFound from "./components/NotFound"; // Import the 404 page component
import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store";
function App() {
  const dispath = useDispatch();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  console.log(isLoggedIn);
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispath(authActions.login());
    }
  }, [dispath]);
  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main
        style={{
          backgroundImage: `url("map.jpeg")`,
          backgroundRepeat: "repeat",
          backgroundPosition: "top",
          backgroundSize: "100%",
          minHeight: "100vh",
          paddingTop: "0.2px",
        }}
      >
        <Routes>
          {!isLoggedIn ? (
            <>
            <Route path="/" element={<Navigate to="/auth" />} /> {/* first page*/}
            <Route path="/auth" element={<Auth />} />
          </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/blogs" />} /> {/* when trying to navigate to non existing page */}
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/add" element={<AddBlog />} />
              <Route path="/myBlogs" element={<UserBlogs />} />
              <Route path="/myBlogs/:id" element={<BlogDetail />} />{" "}
            </>
          )}
          {/* fallback route for handling 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;






