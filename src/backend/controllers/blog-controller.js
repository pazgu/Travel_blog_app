import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";
import multer from 'multer';

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user"); 
    //attempt to retrieve all blogs from the database (populate user to get his credentials to each post)
  } catch (err) {
    return console.error(err);
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
    return console.error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable To Find User By This Id" });
  }
  const blog = new Blog({
    title,
    description,
    image: image.replace(/\\/g, '/'), // Replace double backslashes with forward slashes for Windows compatibility
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
    console.error(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body; //Only the specified fields can be updated 
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
    }, { new: true, runValidators: true }); // //so the new object will be returned and Mongoose will check its new values 
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return console.error(err);
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
    return console.error(err);
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
    return console.error(err);
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
  } catch (err) {
    return console.error(err);
  }
  if (!userId) {
    return res.status(404).json({ message: "Unable To Find User By This Id" });
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ user: userBlogs });
};

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Define the destination directory where the uploaded files will be stored
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    // Define the filename for the uploaded file
    callback(null, file.originalname);
  },
});

// Create the Multer upload instance with the specified storage configuration
const upload = multer({ storage: storage });

export const uploadImage = (req, res, next) => {
  try {
    // Use the upload middleware to handle the image upload
    upload.single('image')(req, res, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
      } else {
        // Access the uploaded file through req.file
        const filePath = req.file.path;
        const fileName = req.file.originalname; // Get the original filename
        res.status(200).json({ message: 'Image uploaded successfully', fileName: fileName, filePath: filePath });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

