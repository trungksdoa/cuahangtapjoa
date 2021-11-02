// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const OrderDetails = require('../models/OrderDetail');
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();

const { v4: uuidv4 } = require('uuid');
// --------------------------------------------------------------
function CreateObject(snapshot) {
    return new OrderDetails(
        snapshot.id,
        snapshot.data().OrderID,
        snapshot.data().ItemOrder
    );
}

function CheckExis(key) {
    let array = [];
    firestore.collection('OrderDetail').get((doc) => {
        if (!doc.empty) {
            doc.forEach(docs => {
                array.push(docs.id);
            });
            return array.indexOf(key) != -1 ? true : false;
        }
    });
}
const createOrderDetail = async(req, res, next) => {

    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const docmentred = await firestore.collection('OrderDetail');
        // --------------------------------------------------------------
        let uuid = uuidv4();
        while (CheckExis(uuid)) {
            uuid = uuidv4();
        }

        await docmentred
            .doc(uuid)
            .set(data)
            .then(() => {
                // --------------------------------------------------------------
                docmentred
                    .doc(uuid)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.exists) {
                            // --------------------------------------------------------------
                            const OrderDetail = CreateObject(snapshot);
                            // --------------------------------------------------------------
                            return res.status(200).json({ status: "Success", msg: "Create OrderDetail success !", dataObject: OrderDetail });
                            // --------------------------------------------------------------
                        } else {
                            return res.status(404).json({
                                status: "Fails",
                                msg: 'No record found',
                            });
                        }
                    }).catch((err) => { return res.send(err) });
            });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const getAllOrderDetail = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const OrderDetail = await firestore.collection('OrderDetail');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        const OrderDetailArray = [];
        await OrderDetail.get()
            .then((data) => {
                if (data.empty) {
                    // --------------------------------------------------------------
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    // --------------------------------------------------------------
                    data.forEach(doc => {
                        // --------------------------------------------------------------
                        const OrderDetail = CreateObject(doc);
                        // --------------------------------------------------------------
                        OrderDetailArray.push(OrderDetail);
                        // --------------------------------------------------------------
                    });
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: OrderDetailArray });
                }
            }).catch((err) => {
                return res.send(err);
            });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const getOneOrderDetail = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const OrderDetail = await firestore.collection('OrderDetail').doc(id);
        // --------------------------------------------------------------
        await OrderDetail.get()
            .then((data) => {
                // --------------------------------------------------------------
                if (!data.exists) {
                    // --------------------------------------------------------------
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    const OrderDetail = CreateObject(data);
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: OrderDetail });
                    // --------------------------------------------------------------
                }
            }).catch((err) => {
                return res.send(err);
            });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const getOneOrderDetailByOrder = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const OrderDetail = await firestore.collection('OrderDetail');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await OrderDetail.where("OrderID", "==", req.params.OrderID).get()
            .then((data) => {
                if (data.empty) {
                    // --------------------------------------------------------------
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    // --------------------------------------------------------------
                    var OrderDetail = null;
                    data.forEach(doc => {
                        // --------------------------------------------------------------
                        OrderDetail = CreateObject(doc);
                        // --------------------------------------------------------------
                        // --------------------------------------------------------------
                    });
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Get Data Successfully", dataObject: OrderDetail });
                }
            }).catch((err) => {
                return res.send(err);
            });
    } catch (error) {
        // --------------------------------------------------------------
        return res.status(400).send(error.message);
        // --------------------------------------------------------------
    }
};
// --------------------------------------------------------------
const UpdateOrderDetail = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const databody = req.body;
        // --------------------------------------------------------------
        const OrderDetail = await firestore.collection('OrderDetail').doc(id);
        // --------------------------------------------------------------
        await OrderDetail.get()
            .then((data) => {
                // --------------------------------------------------------------
                if (!data.exists) {
                    // --------------------------------------------------------------
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    OrderDetail.update(databody);
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "" });
                    // --------------------------------------------------------------
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
    // --------------------------------------------------------------
};

// --------------------------------------------------------------
const deleteOrderDetail = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const ordertail = await firestore.collection('OrderDetail').doc(id)

        await ordertail.get()
            .then((snapp) => {
                // --------------------------------------------------------------
                if (!snapp.exists) {
                    // --------------------------------------------------------------
                    return res.status(404).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    ordertail.delete();
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "" });
                    // --------------------------------------------------------------
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
module.exports = {
    // --------------------------------------------------------------
    createOrderDetail,
    // --------------------------------------------------------------
    getAllOrderDetail,
    // --------------------------------------------------------------
    getOneOrderDetail,
    getOneOrderDetailByOrder,
    // --------------------------------------------------------------
    UpdateOrderDetail,
    // --------------------------------------------------------------
    deleteOrderDetail
    // --------------------------------------------------------------
};