import mongoose from "mongoose";

export const dbConnection = () => {
  console.log("Connecting with URI:", process.env.MONGO_URI); // Debug
  mongoose
    .connect(process.env.MONGO_URI, {
      
      dbName: "hospital_management",

    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};

