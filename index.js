const express = require("express")
const path = require("path")

const app = express()

app.get("/", (req, res)=>{
    res.send("Hola mundo")
})

app.get("/products", (req, res)=>{
    console.log(__dirname)
    res.sendFile(path.join(__dirname + "./products.json"))
})

app.get("/product/:id", (req, res)=>{
    let productNew = new ProductManager("./products.json")
    let id = req.params.id
    const resp = productNew.getproduct(id)
    resp.then(pr =>{
        console.log(pr)
        let productos = JSON.parse(pr, null, 2)
        res.send({data:productos, menssage:"Peticion realizada"})
    }).catch(err => {
        console.log(err)
    })
})

app.listen(8080, () =>{
    console.log("Server run on port 8080")
}) 