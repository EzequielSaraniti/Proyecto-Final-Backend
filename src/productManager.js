
import fs from "fs"
import express from "express"

const app = express()
const port = 3000

class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            const productsString = fs.readFileSync(this.path, "utf-8")
            const productsFile = JSON.parse(productsString)
            this.products = productsFile
        } else {
            fs.writeFileSync(path, "[]")
            this.products = []
        }


    }

    //method to add products to our variable products
    async addProduct(title, description, price, thumbnail, code, stock) {
        if (title && description && price && thumbnail && code && stock) {
            if (this.products.find((product) => product.code === code)) {
                return ("The product already exists");
            } else {
                this.products.push({
                    id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock,
                });
                const productsString = JSON.stringify(this.products, null, 2)
                await fs.promises.writeFile(this.path, productsString)
            }
        }
    }

    //method to know products within our variable products
    async getProducts() {
        const productsString = await fs.promises.readFile(this.path, "utf-8")
        const productsFile = JSON.parse(productsString)
        return productsFile
    }

    //method to know a product within our variable products
    async getProductById(id) {
        const productsString = await fs.promises.readFile(this.path, "utf-8")
        const productsFile = JSON.parse(productsString)
        const product = productsFile.find((product) => product.id === id);
        if (product) {
            return product;
        } else {
            return ("No existe el producto");
        }
    }

    //method for update product
    async updateProduct(id, object) {
        const productsString = await fs.promises.readFile(this.path, "utf-8")
        const productsFile = JSON.parse(productsString)
        const product = productsFile.find((product) => product.id === id);
        if (product) {
            const updateProduct = { ...product, ...object }
            const index = productsFile.indexOf(product)
            productsFile.splice(index, 1, updateProduct)
            const productsString = JSON.stringify(productsFile, null, 2)
            await fs.promises.writeFile(this.path, productsString)
            return product
        }
    }

    //method for delete product
    async deleteProduct(id) {
        const productsString = await fs.promises.readFile(this.path, "utf-8")
        const productsFile = JSON.parse(productsString)
        const product = productsFile.find((product) => product.id === id);
        if (product) {
            const index = productsFile.indexOf(product)
            productsFile.splice(index, 1)
            const productsString = JSON.stringify(productsFile, null, 2)
            await fs.promises.writeFile(this.path, productsString)
            return product
        }
    }
}

//we add product
const productManager = new ProductManager("productos.json");


app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

app.get('/products', (req, res) => {
    const limit = req.query.limit

    if (limit) {
        const products = productManager.getProducts()
        products.then((products) => {
            return res.json(products.slice(0, limit))
        })
    } else {
        const products = productManager.getProducts()
        products.then((products) => {
            return res.json(products)
        })
    }
}
)

app.get('/products/:pid', (req, res) => {
    const id = req.params.pid
    const product = productManager.getProductById(parseInt(id));
    product.then((product) => {
        return res.json(product)
    })
}
)


