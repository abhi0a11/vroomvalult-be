import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    images: {
      type: [],
      required: [true, "Images are required"],
    },
    title: {
      type: String,
      required: [true, "Title cannot be blank"],
    },
    description: {
      type: String,
      required: [true, "Description cannot be blank"],
    },
    brand: {
      type: String,
      required: [true, "Brand cannot be blank"],
    },
    tags: {
      type: String,
    },
    dealer: {
      type: String,
    },
  },
  {
    collection: "cars",
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
