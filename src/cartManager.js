import fs from "fs"

export class CartManager {
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
    async addCart(object) {
        try {
            const data = await this.getCarts()
            if (data.length > 0) {
                const lastId = data[data.length - 1].id + 1
                const newCart = { ...object, id: lastId }
                data.push(newCart)
                const productsString = JSON.stringify(data, null, 2)
                fs.writeFileSync(this.path, productsString)
                return newCart
            } else {
                const newCart = { ...object, id: 1 }
                data.push(newCart)
                const productsString = JSON.stringify(data, null, 2)
                fs.writeFileSync(this.path, productsString)
                return newCart
            }
        } catch (err) {
            console.log(err)
        }
    }

    async getCartById(id) {
        try {
            const data = await this.getCarts()
            const cart = data.find((cart) => cart.id === id);
            if (cart) {
                return cart;
            } else {
                return (`No existe el carrito id: ${id}`);
            }
        } catch (err) {
            console.log(err)
        }
    }

    async updateCart(id, productId) {
        try {
            const data = await this.getCarts()
            const cart = data.find((cart) => cart.id == id);
            if (cart) {
                const product = cart.products.find((product) => product.idProduct == productId);
                if (product) {
                    product.quantity = product.quantity + 1
                    const index = cart.products.indexOf(product)
                    cart.products.splice(index, 1, product)
                    const indexCart = data.indexOf(cart)
                    data.splice(indexCart, 1, cart)
                    const productsString = JSON.stringify(data, null, 2)
                    fs.writeFileSync(this.path, productsString)
                    return product
                } else {
                    cart.products.push({idProduct: productId, quantity: 1})
                    const indexCart = data.indexOf(cart)
                    data.splice(indexCart, 1, cart)
                    const productsString = JSON.stringify(data, null, 2)
                    fs.writeFileSync(this.path, productsString)
                }
            } else {
                return ("No existe el carrito");
            }
        } catch (err) {
            console.log(err)
        }
    }

    async getCarts() {
        if (!fs.existsSync("carts.json")) {
            fs.writeFileSync("carts.json", "[]", "utf-8")
            return ("Carrito creado!!")
        } else {
            const read = await fs.promises.readFile(this.path, "utf-8")
            const data = JSON.parse(read)
            return data
        }
    }

    async deleteCart(id) {
        try {
            const data = await this.getCarts()
            const cart = data.find((cart) => cart.id == id);
            if (cart) {
                const index = data.indexOf(cart)
                data.splice(index, 1)
                const productsString = JSON.stringify(data, null, 2)
                fs.writeFileSync(this.path, productsString)
                return ("Carrito eliminado");
            } else {
                return ("No existe el carrito");
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAll() {
        try {
            fs.writeFileSync("carts.json", "[]", "utf-8")
            return ("Carritos eliminados");
        } catch (err) {
            console.log(err)
        }
    }
}



