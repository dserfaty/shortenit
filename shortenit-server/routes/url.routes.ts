import { Router } from "express";
import {createShortUrl, getShortUrl, home, redirectTo} from "../controllers/url.controller";

class UrlRoutes {
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", home);
        this.router.get("/r/:id", redirectTo);
        this.router.get("/api/urls/:id", getShortUrl);
        this.router.post("/api/urls", createShortUrl);
    }
}

export default new UrlRoutes().router;