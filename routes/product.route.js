import express from "express";
import {
  add,
  fetchAllProducts,
  fetchProduct,
  removeProducts,
  UpdateProducts,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/add", add);
router.patch("/edit", UpdateProducts);
router.delete("/remove", removeProducts);
router.get("/allProducts", fetchAllProducts);
router.get("/products/:id", fetchProduct);

export default router;
