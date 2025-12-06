import Product from "../models/product.js";
import cloudinary from "../configs/cloudinaryConfig.js";
import fs from "fs";

export const createProduct = async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    // Create product in DB
    const product = await Product.create({
      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
      type: req.body.type,
      imageUrl: result.secure_url, // store Cloudinary URL
    });

    // remove temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ✅ Delete a product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete image from Cloudinary if available
    if (product.imageUrl) {
      const publicId = product.imageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (err) {
        console.warn("Cloudinary deletion error:", err.message);
      }
    }

    // Delete from database
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
