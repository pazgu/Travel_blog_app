import mongoose from "mongoose";

const Scheme =mongoose.Schema;

const blogScheme = new Scheme({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    }, 
    user: { //So each blog will contain only one user
        type: mongoose.Types.ObjectId,
        ref: "User", //ref is the property name to reference another schema
        required: true
    }
});


//this code snippet handles errors may occur with duplicate key. Also, I refer to validation errors when I tried save new blog (see middleware function "addBlog") 
blogScheme.post("save", function(error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) { // If the error is a MongoDB error with code 11000, it indicates a duplicate key error
    next(new Error("Duplicate key error")); // Create a new error object and pass it to the next middleware function
  } else {
    next(error); //handle other errors
  }
});

export default mongoose.model("Blog", blogScheme);
//in mongodb it will stored as blogs