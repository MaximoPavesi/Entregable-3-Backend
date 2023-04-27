const fs = require("fs/promises");

class ProductManager {
  constructor() {
    this.path = "./products.json"
    this.products = [];
    this.productId = 1;
}

 async getProducts() {
    try {
      const data = await fs.readFile(this.path);
      this.products = JSON.parse(data);
    } catch (err) {
    if (err.code === "ENOENT") {
        // Si el archivo no existe, no hay productos todavía
        this.products = [];
    } else {
        throw err;
     }
    }
    return this.products;
  }

  async addProduct(product) {
    const id = this.productId++;
    product.id = id;
    await this.getProducts();
    this.products.push(product);
    await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
  }

  async getProductById(id) {
    await this.getProducts();
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProduct(id, updates) {
    await this.getProducts();
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updatedProduct = Object.assign({}, this.products[productIndex], updates);
    this.products[productIndex] = updatedProduct;
    await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
  }

  async deleteProduct(id) {
    await this.getProducts();
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    this.products.splice(productIndex, 1);
    await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
  }
}

const productManager = new ProductManager();

(async () => {
  console.log(await productManager.getProducts()); // []

  const productToAdd = {
    title: "Nike phanthom",
    description: "Botin para mediocampistas los juegadores destacados que los usan son: Enzo Fernandez, Miguel Borja, Juan Fernando Quintero entre muchos otros ",
    price: 20000,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  };
  await productManager.addProduct(productToAdd);
  console.log(await productManager.getProducts()); // [ { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 } ]

  const productId = 1;
  const productToUpdate = {
    price: 30000,
    stock: 10,
  };
  await productManager.updateProduct(productId, productToUpdate);
  console.log(await productManager.getProducts()); // [ { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 300, thumbnail: 'Sin imagen', code: 'abc123', stock: 10 } ]

  await productManager.deleteProduct(productId);
  console.log(await productManager.getProducts()); // []
})();