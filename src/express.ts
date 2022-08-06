/**
 * Import primary dependencies
 */
import express, { Application } from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import helmet from "helmet";
import cors from "cors";
import { main } from "./controllers";

/**
 * Declare express app
 */
const app: Application = express();

/**
 * Get the current working directory
 */
const CURRENT_WORKING_DIR = process.cwd();

/**
 * parse body params and attache them to req.body
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

/**
 * Secure apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * enable CORS - Cross Origin Resource Sharing
 */
app.use(cors());

/**
 * Compile to dist directory
 */
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

/**
 * Mount Routes
 *
 */
app.get("/api/billable", main);
// app.use("/", threadRoutes);
// app.use("/", authRoutes);
// app.use("/", messageRoutes);

export default app;
