import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find(); //to attempt to retrieve all blogs from the database
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blogs Found" });
  }
  return res.status(200).json({ blogs }); //http status code of 200 means that the request has succeeded
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable To Find User By This Id" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    const session = await mongoose.startSession(); //represents a connection to the database
    session.startTransaction();
    await blog.save({ session }); // saves the blog to the db within the transaction started on the session
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
    /*
    By wrapping the operation in a session and transaction,
    I ensure that either all of the operations are successful or none of them are
    (important because the commands accessing and modifying the same data).

    For example, if the blog is successfully saved to the db but the reference to the blog isn't updated in the user object,
    I end up with a situation where the user has a blog that doesn't exist in the database.
    With a session and transaction, I'll avoid this situation.
    */
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
};

export const searchByTitleOrDescription = async (req, res, next) => {
  const query = req.query.q; // Get the search query from the request
  if (!query) {
    return res.status(400).json({ message: "Please Provide A Search Query" });
  }

  //another way to do so:
  /*
    const { title, description, location } = req.query;

  if (!title && !description && !location) {
    return res.status(400).json({ message: "Please provide at least one search query parameter" });
  }

  let blogs;
  try {
    blogs = await Blog.find({
      $or: [
        { title: new RegExp(title, "i") },
        { description: new RegExp(description, "i") },
        { location: new RegExp(location, "i") },
      ],
    }).populate("user");

  */

  // Define the search criteria using regular expression
  const searchCriteria = {
    $or: [
      { title: { $regex: query, $options: 'i' } }, // Search by title
      { description: { $regex: query, $options: 'i' } }, // Search by description
      { location: { $regex: query, $options: 'i' } }, // Search by location
    ],
  };
  try {
    // Search for blogs using the defined search criteria
    const blogs = await Blog.find(searchCriteria);

    // Return the search results as JSON
    res.status(200).json({ blogs });
  } catch (err) {
    return console.error(err);
  } 
  if (!blogs){
    return res.status(404).json({ message: "No Blog Found With This Search Query" });
  }
};


export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body; //for now I can only update this fields because image and user are frontend properties
  const blogId = req.params.id; // Extracts the blog id from the request parameters
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid Blog ID" });
  }
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      // Finds the blog by ID and updates the title and description
      title, //shorthand of title: title
      description,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable To Update The Blog" });
    //http status 500 indicates that there was an unexpected condition on the server side, and the server is unable to fulfill the request
  }
  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //checks if the id is a valid MongoDB object
    return res.status(400).json({ message: "Invalid Blog ID" });
  }
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog ID" });
  }
  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id).populate("user"); 
    //The populate method is used to retrieve the user property of the Blog model, associated with the deleted blog
    if (!blog) {
      return res.status(500).json({ message: "Blog Not Found" });
    }
    const blogIndex = blog.user.blogs.findIndex(
      (blogId) => blogId.toString() === id
    );
    //The toString method is used on the blogId to since blogId is a mongoose.Types.ObjectId object
    if (blogIndex !== -1) {
      await blog.user.blogs.splice(blogIndex, 1);
      await blog.user.save(); //ensures that the updated array is in the database
    }
    return res.status(200).json({ message: "Blog Was Successfully Deleted" });
  } catch (err) {
    return console.log(err);
  }
};

export const getBlogsByUserId = async (req, res, next) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid Blog ID" });
  }
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
    //The populate method is used to retrieve the blogs property of the User model, associated with the current user
  } catch (err) {
    return console.log(err);
  }
  if (!userId) {
    return res.status(404).json({ message: "Unable To Find User By This Id" });
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  const blogs = userBlogs.blogs; //So the response json body will inculde only the blogs details without the user credentials
  return res.status(200).json({ blogs });
};
