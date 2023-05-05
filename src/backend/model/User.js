import mongoose from "mongoose";

const Scheme = mongoose.Schema;

const userScheme = new Scheme({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, //email will be used as key
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  blogs: [
    {
      type: mongoose.Types.ObjectId, //define the type of data in the array as an ObjectId (a unique identifier in MongoDB)
      ref: "Blog", //specify the referenced to Blog collection
      required: true,
    },
  ], //user can have multiple blogs so all the blogs will be hold in an array
});
export default mongoose.model("User", userScheme);
//in mongodb it will stored as users

//a model represents a collection of documents in the MongoDB database and provides an interface for creating, reading, updating, and deleting those documents.

//A schema defines the structure of the documents that will be stored in the corresponding MongoDB collection.
//It includes the properties of the documents, their types, and any validation rules.

// Once the schema is defined, it can be used to create a new Mongoose model with the mongoose.model() function. This function takes two arguments: the name of the collection and the schema object.
// The resulting model can then be used to interact with the corresponding MongoDB collection.
