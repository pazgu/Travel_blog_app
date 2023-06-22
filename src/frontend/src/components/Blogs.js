import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";

const Blogs = () => {
  const [blogs, setblogs] = useState();
  const [loading, setLoading] = useState(true);
  const sendRequestFetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blog"); //sends request to the API to get the blogs
      const data = await res.data;
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); //set to false after the request is complete (to get the loading message off)
    }
  };
  useEffect(() => {
    //the trigerred effect is fetching data from the API
    sendRequestFetchBlogs().then((data) => setblogs(data.blogs)); //updates the blogs state with the retrieved data
  }, []); //empty array so the effect will be triggered just once when the component mounts (does not need to re-run in case values change)
  return (
    <div>
      {loading ? (
        <p style={{ color: "white", fontSize: "32px" }}>Loading...</p>
      ) : (
        <div>
          {blogs &&
            blogs.map((blog) => (
              //verifies that there are blogs to avoid errors
              <Blog
                isUser={localStorage.getItem("userId") === blog.user._id} //to let the user delete his own blogs only
                key={blog._id}
                id={blog._id}
                title={blog.title}
                description={blog.description}
                imageURL={blog.image}
                userName={blog.user.name}
              />
            ))}
        </div>
      )}
    </div>
  );
};  
export default Blogs;
