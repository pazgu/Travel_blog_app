import Express from "express";
import { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getBlogsByUserId, uploadImage } from "../controllers/blog-controller";
const blogRouter = Express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog); //The value of the :id parameter available in the req.params object
//A put request used to update a resource on a server 
blogRouter.get("/:id", getById); 
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", getBlogsByUserId);
blogRouter.post('/upload', uploadImage);

export default blogRouter;
