import { Router } from "express";
import {createShortUrl, getPopularUrls, getShortUrl, home, redirectTo} from "../controllers/url.controller";

class UrlRoutes {
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", home);
        this.router.get("/r/:slug", redirectTo);
        this.router.get("/api/urls/popular", getPopularUrls);
        this.router.get("/api/urls/byids/:id", getShortUrl);
        this.router.post("/api/urls", createShortUrl);
    }
}

export default new UrlRoutes().router;