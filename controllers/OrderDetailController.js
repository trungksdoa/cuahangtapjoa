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
// --------------------------------------------------------------
const createOrderDetail = async(req, res, next) => {

    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const docmentred = await firestore.collection('OrderDetail');
        // --------------------------------------------------------------
        await docmentred
            .add(data)
            .then((snapshot) => {
                const id = snapshot.id;
                // --------------------------------------------------------------
                docmentred
                    .doc(id)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.exists) {
                            // --------------------------------------------------------------
                            const OrderDetail = new OrderDetails(
                                snapshot.id,
                                snapshot.data().OrderID,
                                snapshot.data().ItemOrder
                            );
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
                        const OrderDetail = new OrderDetails(
                            doc.id,
                            doc.data().OrderID,
                            doc.data().ItemOrder
                        );
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
                    const OrderDetail = new OrderDetails(
                        data.id,
                        data.data().OrderID,
                        data.data().ItemOrder
                    );
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
                        OrderDetail = new OrderDetails(
                            doc.id,
                            doc.data().OrderID,
                            doc.data().ItemOrder
                        );
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