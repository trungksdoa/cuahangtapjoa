// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Products = require('../models/Product');

const { v4: uuidv4 } = require('uuid');

const admin = require('firebase-admin')

// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();
// --------------------------------------------------------------
function CreateObject(snapshot) {
    return new Products(
        snapshot.id,
        snapshot.data().name,
        snapshot.data().quantity,
        snapshot.data().price_in,
        snapshot.data().price_out,
        snapshot.data().Catagory,
        snapshot.data().Payment,
        snapshot.data().status,
        snapshot.data().discount,
        snapshot.data().date_add
    );
}

function CheckExis(key) {
    let array = [];
    firestore.collection('Product').get((doc) => {
        if (!doc.empty) {
            doc.forEach(docs => {
                array.push(docs.id);
            });
            return array.indexOf(key) != -1 ? true : false;
        }
    });
}

const createProduct = async(req, res, next) => {

    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const docmentred = await firestore.collection('Product');
        var request = {
            name: data.name,
            quantity: data.quantity,
            price_in: data.price_in,
            price_out: data.price_out,
            Catagory: data.Catagory,
            Payment: data.Payment,
            status: data.status,
            discount: data.discount,
            date_add: new Date().toLocaleDateString()
        }
        let uuid = uuidv4();
        while (CheckExis(uuid)) {
            uuid = uuidv4();
        }
        // --------------------------------------------------------------
        await docmentred.doc(uuid).set(request).then(() => {
            // --------------------------------------------------------------
            docmentred.doc(uuid).get().then((snapshot) => {
                // --------------------------------------------------------------
                if (!snapshot.exists) {
                    // --------------------------------------------------------------
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    // --------------------------------------------------------------
                    const product = CreateObject(snapshot);
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Create product success !", dataObject: product });
                    // --------------------------------------------------------------
                }
            }).catch((err) => {
                console.log(err);
                return res.send(err);
            });
        });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
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
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const ProductArray = [];
                // --------------------------------------------------------------
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    const product = CreateObject(doc);
                    // --------------------------------------------------------------
                    ProductArray.push(product);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: ProductArray });
            }
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
        // --------------------------------------------------------------
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
// --------------------------------------------------------------
const getOneProduct = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const product = await firestore.collection('Product').doc(id);
        // --------------------------------------------------------------
        const data = await product.get().then((snapp) => {
            if (!snapp.exists) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const product = CreateObject(snapp);
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: product });
            }
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};

// --------------------------------------------------------------
const getProductByCata = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const cata = req.params.cataId;
        // --------------------------------------------------------------
        await firestore.collection('Product').where('Catagory', "==", cata).get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const ProductArray = [];
                snapp.forEach(doc => {
                    const product = CreateObject(doc);
                    ProductArray.push(product);
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found Success", dataList: ProductArray });
            }
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};

// --------------------------------------------------------------
const CheckrProductOnStock = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const data = req.body;

        console.log(data);
        // --------------------------------------------------------------
        await firestore.collection('Product').where(admin.firestore.FieldPath.documentId(), 'in', data.Proid).get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {

                const ProductArray = [];
                snapp.forEach(doc => {
                    const product = CreateObject(doc);
                    // --------------------------------------------------------------
                    ProductArray.push(product);
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found Success", dataList: ProductArray });
            }
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
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
            if (!snapshot.exists) {
                // --------------------------------------------------------------
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                ducks.update(data);
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Update record with ID:  " + id + "" });
                // --------------------------------------------------------------
            }
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
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
                if (snapp.exists) {
                    datas2.delete();
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Delete record with ID:  " + id + "" });
                } else {
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                }
            }).catch((err) => {
                return res.send(err);
            });
        // --------------------------------------------------------------
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
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

    getProductByCata,
    CheckrProductOnStock,
    // --------------------------------------------------------------
    UpdateProduct,
    // --------------------------------------------------------------
    deleteProduct
    // --------------------------------------------------------------
};