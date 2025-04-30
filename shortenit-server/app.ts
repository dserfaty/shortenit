import express from "express";
import {Application} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Server from "./server";
import logger from './services/logger';

// Create the express app and  import the type of app from express;
const app: Application = express();
dotenv.config();

const PORT = parseInt(process.env.PORT as string, 10) || 8080
const DATABASE_URL = process.env.DATABASE_URL as string;

// Listen the server
const server: Server = new Server(app);
app.listen(PORT, async () => {
    logger.info(`🗄️  Server Fire on http:localhost//${PORT}`);

    // Connect To The Database
    try {
        logger.info(`🛢️  Connecting to database url: ${DATABASE_URL}`);
        await mongoose.connect(DATABASE_URL);
        logger.info("🛢️     ...connected.");
    } catch (error) {
        console.log("⚠️ Error connecting to Database");
        logger.error('Error connecting to Database', error);
    }
});