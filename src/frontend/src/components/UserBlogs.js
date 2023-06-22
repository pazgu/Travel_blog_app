import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";

const UserBlogs = () => {
  const id = localStorage.getItem("userId");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blog/user/${id}`);
        const data = res.data;
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); //set loading state to false after the request is complete
      }
    };
    fetchUserBlogs(); //call the function when the component mounts or when the id changes
  }, [id]); // The effect will re-run only when the ID changes

  return (
    <div>
      {loading ? (
        <p style={{ color: "white",fontSize: "32px"}}>Loading...</p>
      ) : (
        <div>
          { user?.blogs?.map((blog) => (
              <Blog
                key={blog._id}
                id={blog._id}
                isUser={true} //the current user can always delete his blogs
                title={blog.title}
                description={blog.description}
                imageURL={blog.image}
                userName={user.name}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs;
