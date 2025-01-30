import { Product } from "../model/product.model.js";

export const add = async (req, res, next) => {
  try {
    const { email, images, title, description, brand, dealer } = req.body;

    const product = Product.create({
      email,
      images,
      title,
      description,
      brand,
      tags,
      dealer,
    });
    res.status(200).send(`Successfully added ${title}`);
  } catch (error) {
    next(error);
  }
};
export const fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products)
      return res.status(409).json({ message: "No product Found!" });

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
};
export const fetchProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await Product.findById({ _id: id });
    if (!products) res.status(409).json({ message: "No product Found!" });

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
};
export const removeProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
      return res.status(409).json({ message: "No product Found!" });
    }

    res.status(200).send({
      success: true,
      message: `${product.title} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
export const UpdateProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updateProduct = await Product.findOneAndUpdate({ _id: id }, updates, {
      new: true,
      runValidators: true,
    });

    if (!updateProduct)
      return res.status(409).json({ message: "No product Found!" });

    res
      .status(200)
      .send(`Product ${updateProduct.title} is updated successfully`);
  } catch (error) {
    next(error);
  }
};
