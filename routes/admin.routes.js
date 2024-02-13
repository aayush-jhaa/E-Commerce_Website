const express = require("express"); //Importing the express package

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

// Since /admin are repeatedly used let's make it easier -- using filter

router.get("/products", adminController.getProducts); // /admin/products

router.get("/products/new", adminController.getNewProduct);

router.post("/products", imageUploadMiddleware, adminController.createNewProduct);

router.get("/products/:id", adminController.getUpdateProduct);

router.post("/products/:id", imageUploadMiddleware, adminController.updateProduct);

router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;
