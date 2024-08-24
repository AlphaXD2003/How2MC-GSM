

const router = require("express").Router();
const {
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
} = require("../../controllers/products/products.controller");


router.route("/product-category").post(createProductCategory);
router.route("/product-category/:id").get(getProductCategory).put(updateProductCategory).delete(deleteProductCategory);

router.route("/product").post(createProduct);
router.route("/product/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

router.route("/products").get(getAllProducts);
router.route("/products-category").get(getAllProductCategories);
router.route("/products/category/:id").get(getProductCategory);

router.route("/products-category/:id/products").get(getAllProductsByCategory);








module.exports = router;