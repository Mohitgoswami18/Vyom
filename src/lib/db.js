import mongoose from "mongoose";

const mongoDBURI = process.env.MONGO_DB_URI;

const connectToDatabase = async () => {
    try{ 
        console.log("Attempting to connect to MongoDB...");
        const response = await mongoose.connect(mongoDBURI);
        if (response) {
            console.log("Connected to MongoDB");
        } else {
            throw new Error("Failed to connect to MongoDB");
        }
    } catch (err) {
        console.log("an error while connecting to the database", err)
    }
};

export default connectToDatabase; 
