// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Orders = require('../models/Order');
// const firestore = firebase.firestore();
const { v4: uuidv4 } = require('uuid');
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();
// --------------------------------------------------------------

function CreateObject(snap) {
    return new Orders(
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
}

function CheckExis(key) {
    let array = [];
    firestore.collection('Order').get((doc) => {
        if (!doc.empty) {
            doc.forEach(docs => {
                array.push(docs.id);
            });
            return array.indexOf(key) != -1 ? true : false;
        }
    });
}
const createOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        let uuid = uuidv4();
        while (CheckExis(uuid)) {
            uuid = uuidv4();
        }
        // --------------------------------------------------------------

        // var OrderID = 0;
        // await firestore.collection("Order").get().then(function(querySnapshot) {
        //     OrderID = querySnapshot.size + 1;
        // });
        var documents = await firestore.collection('Order')
            .doc(uuid)
            .set(data)
            .then(() => {
                // // --------------------------------------------------------------
                firestore.collection('Order')
                    .doc(uuid)
                    .get()
                    .then((snap) => {
                        // --------------------------------------------------------------
                        if (!snap.exists) {
                            // --------------------------------------------------------------
                            return res.status(404).json({ status: "Fails", msg: 'No record found' });
                            // --------------------------------------------------------------
                        } else {
                            // --------------------------------------------------------------
                            const Order = CreateObject(snap);
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
                    const Order = CreateObject(doc);
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
const getAllOrderByCus = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const Order = await firestore.collection('Order');
        const userId = req.params.userId;
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await Order
            .where('CusId', "==", userId)
            .get().then((snap) => {
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
                        const Order = CreateObject(doc);
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
                const Order = CreateObject(snapshot);
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
    getAllOrderByCus,
    // --------------------------------------------------------------
    getOneOrder,
    // --------------------------------------------------------------
    UpdateOrder,
    // --------------------------------------------------------------
    deleteOrder
    // --------------------------------------------------------------
};