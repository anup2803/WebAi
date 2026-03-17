import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  changes,
  delpoy,
  generateWebsite,
  getAllWebsite,
  getBySlug,
  getWebsiteById,
} from "../controllers/website.controllers.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.post("/update/:id", isAuth, changes);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/get-all", isAuth, getAllWebsite);
websiteRouter.get("/deploy/:id", isAuth, delpoy);
websiteRouter.get("/get-by-slug/:slug", getBySlug);
export default websiteRouter;
