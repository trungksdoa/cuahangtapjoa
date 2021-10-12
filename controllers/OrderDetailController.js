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
        const docmentred = await firestore.collection('OrderDetail').add(data);
        // --------------------------------------------------------------
        await docmentred.add(data);
        const id = docmentred.id;
        // --------------------------------------------------------------
        await docmentred.doc(id).get().then((snapshot) => {
            if (!snapshot.empty) {
                // --------------------------------------------------------------
                const OrderDetail = new OrderDetails(
                    snapshot.id,
                    snapshot.data().OrderID,
                    snapshot.data().ItemOrder
                );
                // --------------------------------------------------------------
                res.status(200).json({ status: "Success", msg: "Create OrderDetail success !", dataObject: OrderDetail });
                // --------------------------------------------------------------
            } else {
                res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            }
        }).catch((err) => { res.send(err) });
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
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
                    res.status(200).json({
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
                    res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: OrderDetailArray });
                }
            }).catch((err) => {
                res.send(err);
            });
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
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
                if (data.empty) {
                    // --------------------------------------------------------------
                    res.status(200).json({
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
                    res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: OrderDetail });
                    // --------------------------------------------------------------
                }
            }).catch((err) => {
                res.send(err);
            });
    } catch (error) {
        // --------------------------------------------------------------
        res.status(400).send(error.message);
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
                if (data.empty) {
                    // --------------------------------------------------------------
                    res.status(200).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    OrderDetail.update(databody);
                    // --------------------------------------------------------------
                    res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "" });
                    // --------------------------------------------------------------
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
                if (snapp.empty) {
                    // --------------------------------------------------------------
                    res.status(200).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                    // --------------------------------------------------------------
                } else {
                    ordertail.delete();
                    // --------------------------------------------------------------
                    res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "" });
                    // --------------------------------------------------------------
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
module.exports = {
    // --------------------------------------------------------------
    createOrderDetail,
    // --------------------------------------------------------------
    getAllOrderDetail,
    // --------------------------------------------------------------
    getOneOrderDetail,
    // --------------------------------------------------------------
    UpdateOrderDetail,
    // --------------------------------------------------------------
    deleteOrderDetail
    // --------------------------------------------------------------
};