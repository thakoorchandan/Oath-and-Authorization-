const express = require("express");

const Product = require("../models/product.model")

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize")


const router = express.Router();

router.get("/new",(req,res)=>{
    return res.render("products/new")
})

router.get("/", authenticate, authorize(["user", "admin"]), async function(req,res){
    const products = await Product.find().lean().exec();
    const user = req.user;
    return res.status(200).send({user, products})
})

router.patch("/:id", authenticate, authorize(["seller", "admin"]), async(req,res)=>{
    const products = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean().exec();
    const user = req.user;
    return res.status(200).send({user, products})
})

router.delete("/:id", authenticate, authorize(["seller", "admin"]), async(req,res)=>{
    const products = await Product.findByIdAndDelete(req.params.id, req.body).lean();
    const user = req.user;
    return res.status(200).send({user, products})
})



module.exports = router;