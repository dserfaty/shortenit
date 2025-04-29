import { Router } from "express";
import {createAccount, createToken, getAccount} from "../controllers/account.controller";

class AccountRoutes {
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/accounts/:id", getAccount);
        this.router.post("/accounts", createAccount);
        this.router.post("/accounts/tokens", createToken);
    }
}

export default new AccountRoutes().router;