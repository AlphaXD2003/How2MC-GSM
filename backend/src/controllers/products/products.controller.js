const ProductCategory = require("../../models/productCategory.model");
const Product = require("../../models/products.model");
const { ApiResponse } = require("../../utils/ApiResponse");

const createProductCategory = async (req, res) => {
    try {
        const { name, description, image, nestId } = req.body;
        const productCategory = await ProductCategory.create({
            name,
            description,
            image,
            nestId
        })

        if(!productCategory){
            throw new Error("Product category not created");
        }
        res.status(200).json(new ApiResponse(200, productCategory, "Product category created"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while creating product"
            )
        );
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, price, currency,  parentProductCategory, resources, image, eggId } = req.body;
        const product = await Product.create({
            name,
            price,
            currency,
            eggId,
            parentProductCategory,
            resources,
            image
        
        })

        if(!product){
            throw new Error("Product not created");
        }
        res.status(200).json(new ApiResponse(200, product, "Product created"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while creating product"
            )
        );
    }
}

const getProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const productCategory = await ProductCategory.findById(id);
        if(!productCategory){
            throw new Error("Product category not found");
        }
        res.status(200).json(new ApiResponse(200, productCategory, "Product category fetched"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while fetching product category"
            )
        );
    }
}

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product){
            throw new Error("Product not found");
        }
        res.status(200).json(new ApiResponse(200, product, "Product fetched"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while fetching product"
            )
        );
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(new ApiResponse(200, products, "Products fetched"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while fetching products"
            )
        );
    }
}

const getAllProductCategories = async (req, res) => {
    try {
        const productCategories = await ProductCategory.find();
        res.status(200).json(new ApiResponse(200, productCategories, "Product categories fetched"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while fetching product categories"
            )
        );
    }
}

const getAllProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.find({ parentProductCategory: id });
        res.status(200).json(new ApiResponse(200, products, "Products fetched"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while fetching products"
            )
        );
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, currency, category, parentProductCategory } = req.body;
        const product = await Product.findByIdAndUpdate(id, {
            name,
            price,
            currency,
            category,
            parentProductCategory,
        
        })

        if(!product){
            throw new Error("Product not updated");
        }
        res.status(200).json(new ApiResponse(200, product, "Product updated"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while updating product"
            )
        );
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json(new ApiResponse(200, true, "Product deleted"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while deleting product"
            )
        );
    }    
}

const updateProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image } = req.body;
        const productCategory = await ProductCategory.findByIdAndUpdate(id, {
            name,
            description,
            image,
        
        })

        if(!productCategory){
            throw new Error("Product category not updated");
        }
        res.status(200).json(new ApiResponse(200, productCategory, "Product category updated"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while updating product category"
            )
        );
    }
}

const deleteProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductCategory.findByIdAndDelete(id);
        res.status(200).json(new ApiResponse(200, true, "Product category deleted"));
    } catch (error) {
        console.error(error);
        res
        .status(error.statusCode || 500)
        .json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Error while deleting product category"
            )
        );  


    }
}

module.exports = {
    createProductCategory,
    createProduct,
    getProductCategory,
    getProduct,
    getAllProducts,
    getAllProductCategories,
    getAllProductsByCategory,
    updateProduct,
    deleteProduct,
    updateProductCategory,
    deleteProductCategory
}