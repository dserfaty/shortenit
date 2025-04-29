import express from "express";
import {Application} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Server from "./server";

// Create the express app and  import the type of app from express;
const app: Application = express();
dotenv.config();

const PORT: number = 8080;
const databaseUrl = process.env.DATABASE_URL as string;

// Listen the server
const server: Server = new Server(app);
app.listen(PORT, async () => {
    console.log(`🗄️  Server Fire on http:localhost//${PORT}`);

    // Connect To The Database
    try {
        console.log(`🛢️  Connecting to database url: ${databaseUrl}`);
        await mongoose.connect(databaseUrl);
        console.log("🛢️     ...connected.");
    } catch (error) {
        console.log("⚠️ Error to connect Database");
    }
});