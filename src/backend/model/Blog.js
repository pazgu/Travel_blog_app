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

export default mongoose.model("Blog", blogScheme);
//in mongodb it will stored as blogs