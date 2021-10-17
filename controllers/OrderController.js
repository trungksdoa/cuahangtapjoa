// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Orders = require('../models/Order');
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();
// --------------------------------------------------------------
const createOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        // --------------------------------------------------------------

        var OrderID = 0;
        await firestore.collection("Order").get().then(function(querySnapshot) {
            OrderID = querySnapshot.size + 1;
        });
        var documents = await firestore.collection('Order')
            .doc("" + OrderID + "")
            .set(data)
            .then(() => {
                // // --------------------------------------------------------------
                console.log(OrderID);
                var test = firestore.collection('Order')
                    .doc("" + OrderID + "")
                    .get()
                    .then((snap) => {
                        // --------------------------------------------------------------
                        if (!snap.exists) {
                            // --------------------------------------------------------------
                            return res.status(404).json({ status: "Fails", msg: 'No record found' });
                            // --------------------------------------------------------------
                        } else {
                            // --------------------------------------------------------------
                            const Order = new Orders(
                                snap.id,
                                snap.data().CusId,
                                snap.data().ShipPhone,
                                snap.data().ShipAddress,
                                snap.data().ShipDate,
                                snap.data().ShipNote,
                                snap.data().OrderDate,
                                snap.data().OrderState,
                                snap.data().PaymentMethod,
                                snap.data().ProcessStatus
                            );
                            // --------------------------------------------------------------
                            return res.status(200).json({ status: "Success", msg: "Create Order success !", dataObject: Order });
                            // --------------------------------------------------------------
                        }
                    }).catch((err) => {
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
const getAllOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const Order = await firestore.collection('Order');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await Order.get().then((snap) => {
            // --------------------------------------------------------------
            if (snap.empty) {
                // --------------------------------------------------------------
                return res.status(404).json({ status: "Fails", msg: 'No record found' });
                // --------------------------------------------------------------
            } else {
                const OrderArray = [];
                // --------------------------------------------------------------
                snap.forEach(doc => {
                    // --------------------------------------------------------------
                    const Order = new Orders(
                        doc.id,
                        doc.data().CusId,
                        doc.data().ShipPhone,
                        doc.data().ShipAddress,
                        doc.data().ShipDate,
                        doc.data().ShipNote,
                        doc.data().OrderDate,
                        doc.data().OrderState,
                        doc.data().PaymentMethod,
                        doc.data().ProcessStatus
                    );
                    // --------------------------------------------------------------
                    OrderArray.push(Order);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: OrderArray });
            }
        }).catch((err) => {
            return res.send(err);
        });
        // --------------------------------------------------------------
        // --------------------------------------------------------------
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const getOneOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const Order2 = await firestore.collection('Order').doc(id);
        // --------------------------------------------------------------
        await Order2.get().then((snapshot) => {
            // --------------------------------------------------------------
            if (!snapshot.exists) {
                // --------------------------------------------------------------
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                const Order = new Orders(
                    snapshot.id,
                    snapshot.data().CusId,
                    snapshot.data().ShipPhone,
                    snapshot.data().ShipAddress,
                    snapshot.data().ShipDate,
                    snapshot.data().ShipNote,
                    snapshot.data().OrderDate,
                    snapshot.data().OrderState,
                    snapshot.data().PaymentMethod,
                    snapshot.data().ProcessStatus
                );
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: Order });
                // --------------------------------------------------------------
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
const UpdateOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const Order = await firestore.collection('Order').doc(id);
        // --------------------------------------------------------------
        await Order.get().then((snapshot) => {
            if (snapshot.exists) {
                Order.update(data);
                return res.status(200).json({ status: "Success", msg: 'Record updated successfuly' });
            } else {
                return res.status(404).json({ status: "Fails", msg: 'No record found' });
            }
        }).catch((err) => { return res.send(err) });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
    // --------------------------------------------------------------
};

// --------------------------------------------------------------
const deleteOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const Order = await firestore.collection('Order').doc(id);
        // --------------------------------------------------------------
        await Order.get().then((snapshot) => {
            if (snapshot.exists) {
                Order.delete();
                return res.status(200).json({ status: "Success", msg: 'Delete Record successfuly' });
            } else {
                return res.status(404).json({ status: "Fails", msg: 'No record found' });
            }
        }).catch((err) => { return res.send(err) });
        // --------------------------------------------------------------
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// const observer = firestore.collection('Order').onSnapshot(docSnapshot => {
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
    createOrder,
    // --------------------------------------------------------------
    getAllOrder,
    // --------------------------------------------------------------
    getOneOrder,
    // --------------------------------------------------------------
    UpdateOrder,
    // --------------------------------------------------------------
    deleteOrder
    // --------------------------------------------------------------
};