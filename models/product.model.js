const mongodb = require("mongodb"); // To create object Id based on string

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; // + forces a conversion to a number
    this.description = productData.description;
    this.image = productData.image; // This is the name of the image file
    // this.imagePath = `product-data/images/${productData.image}`;
    // this.imageUrl = `/products/assets/images/${productData.image}`; // Path for requesting that image
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      // We can handle error in controller -- but we're handling it here this time
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id ");
      error.code = 404; // -- Status Code for not found!// Property added code // -- This would be the code if someone added arbitrary id in url
      throw error;
    }

    // return product; // returns productDocument -- This case product doesn't have id field
    return new Product(product); // Now product hace id field i.e. product.id is available
  }

  static async findAll() {
    // We don't neet to create object -- It is useful here bcoz we have no product data we're looking for data instead
    const products = await db.getDb().collection("products").find().toArray(); // array of products

    return products.map(function (productDocument) {
      return new Product(productDocument);
    }); //anonymous function get executed by JS for every element of array
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });

    const products = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };
    // -- Check for whether we have an id saving a product already in db

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);
      //--If image is not selected then image should not be undefined -- therefore we delete the key value pair hence object won't have the image field
      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  } // Method talking to the database

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  // This remove method would elete a product but not delete the images
  remove() {
    const productId = new mongodb.ObjectId(this.id); // This could failed handled in admin.controller
    return db.getDb().collection("products").deleteOne({ _id: productId });
  } // async await can be used alternatively manually return the promise
}

module.exports = Product;
