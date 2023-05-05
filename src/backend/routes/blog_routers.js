import Express from "express";
import { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getBlogsByUserId, searchByTitleOrDescription } from "../controllers/blog-controller";

const blogRouter = Express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);
blogRouter.get("/search", searchByTitleOrDescription);
blogRouter.put("/update/:id", updateBlog); //The value of the :id parameter available in the req.params object
//A put request used to update a resource on a server 
blogRouter.get("/:id", getById); //The : before id is a syntax used by Express to define a URL parameter
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", getBlogsByUserId);

export default blogRouter;
