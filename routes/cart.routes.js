const express = require("express"); //Importing the express package

const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", cartController.getCart); // /cart/

router.post("/items", cartController.addCartItem); // /cart/items //put or patch can be used

router.patch("/items", cartController.updateCartItem); // Put - when replace existing data -- patch - When update parts of existing data

module.exports = router;
