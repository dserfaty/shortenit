import { Application } from "express";
import urlRoutes from "./url.routes";
import accountRoutes from "./account.routes";

export default class Routes {
    constructor(app: Application) {
        app.use("/", urlRoutes);
        app.use("/api", accountRoutes);
    }
}