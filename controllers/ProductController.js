// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Products = require('../models/Product');
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();
// --------------------------------------------------------------

const createProduct = async(req, res, next) => {

    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const docmentred = await firestore.collection('Product');
        // --------------------------------------------------------------
        await docmentred.add(data);
        const id = docmentred.id;
        // --------------------------------------------------------------
        await docmentred.doc(id).get().then((snapshot) => {
            // --------------------------------------------------------------
            if (snapshot.empty) {
                // --------------------------------------------------------------
                res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                // --------------------------------------------------------------
                const product = new Products(
                    snapshot.id,
                    snapshot.data().name,
                    snapshot.data().quantity,
                    snapshot.data().price_in,
                    snapshot.data().price_out,
                    snapshot.data().Payment,
                    snapshot.data().status
                );
                // --------------------------------------------------------------
                res.status(200).json({ status: "Success", msg: "Create product success !", dataObject: product });
                // --------------------------------------------------------------
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const getAllProduct = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const Product = await firestore.collection('Product');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await Product.get().then((snapp) => {
            if (snapp.empty) {
                res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const ProductArray = [];
                // --------------------------------------------------------------
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    const product = new Products(
                        doc.id,
                        doc.data().name,
                        doc.data().quantity,
                        doc.data().price_in,
                        doc.data().price_out,
                        doc.data().Payment,
                        doc.data().status
                    );
                    // --------------------------------------------------------------
                    ProductArray.push(product);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: ProductArray });
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
        // --------------------------------------------------------------
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const getOneProduct = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;

        // --------------------------------------------------------------
        const product = await firestore.collection('Product').doc(id);
        // --------------------------------------------------------------
        const data = await product.get().then((snapp) => {
            if (snapp.empty) {
                res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const product = new Products(
                    snapp.id,
                    snapp.data().name,
                    snapp.data().quantity,
                    snapp.data().price_in,
                    snapp.data().price_out,
                    snapp.data().Payment,
                    snapp.data().status
                );
                // --------------------------------------------------------------
                res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: product });
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const UpdateProduct = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const ducks = await firestore.collection('Product').doc(id);
        // --------------------------------------------------------------
        await ducks.get().then((snapshot) => {
            // --------------------------------------------------------------
            if (snapshot.empty) {
                // --------------------------------------------------------------
                res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                ducks.update(data);
                // --------------------------------------------------------------
                res.status(200).json({ status: "Success", msg: "Update record with ID:  " + id + "" });
                // --------------------------------------------------------------
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
    // --------------------------------------------------------------
};

// --------------------------------------------------------------
const deleteProduct = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const datas2 = await firestore.collection('Product').doc(id)
        await datas2.get()
            .then((snapp) => {
                if (!snapp.empty) {
                    datas2.delete();
                    // --------------------------------------------------------------
                    res.status(200).json({ status: "Success", msg: "Delete record with ID:  " + id + "" });
                } else {
                    res.status(200).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                }
            }).catch((err) => {
                res.send(err);
            });
        // --------------------------------------------------------------
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// const observer = firestore.collection('Product').onSnapshot(docSnapshot => {
//     let changes = docSnapshot.docChanges();
//     changes.forEach(change => {
//             console.log(change.doc.data());
//         })
//         // ...
// }, err => {
//     cpmsole.log(err)
// });
module.exports = {
    // --------------------------------------------------------------
    createProduct,
    // --------------------------------------------------------------
    getAllProduct,
    // --------------------------------------------------------------
    getOneProduct,
    // --------------------------------------------------------------
    UpdateProduct,
    // --------------------------------------------------------------
    deleteProduct
    // --------------------------------------------------------------
};