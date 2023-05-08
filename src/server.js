import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/cart.router.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.get("*"), (req, res, next) => {
    res.status(404).json({status: "error", msg: "Not Found", data: {} })
}