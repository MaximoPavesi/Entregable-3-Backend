const ProductManager = require("./ProductManager")

const express = require("express")
const path = require("path")

const app = express()

app.get("/", (req, res)=>{
    let productNew = new ProductManager("./products.json")
    const resp = productNew.getProducts()
    resp.then(pr => {
        console.log(pr)
        let productos = JSON.parse(pr, null, 2) 
        res.send({data:productos, menssage:"Peticion existosa"})
    }).catch(err => {
        console.log(err)
    })
})

app.listen(8080, () =>{
    console.log("Server run on port 8080")
}) 