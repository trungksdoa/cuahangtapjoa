// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Addresss = require('../models/Address');
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();
// --------------------------------------------------------------
const createAddress = async(req, res, next) => {

    try {

        const data = req.body;

        const docmentred = await firestore.collection('Address');

        await docmentred.add(data).then((snapshot) => {

            const id = snapshot.id;
            docmentred.doc(id).get()
                .then((snap) => {
                    // --------------------------------------------------------------
                    if (snap.empty) {
                        // --------------------------------------------------------------
                        res.status(404).json({ msg: 'No record found' });
                        // --------------------------------------------------------------
                    } else {
                        // --------------------------------------------------------------
                        const Address = new Addresss(
                            snap.id,
                            snap.data().CusId,
                            snap.data().Fullname,
                            snap.data().PhoneNum,
                            snap.data().Stage,
                            snap.data().Address,
                            snap.data().used
                        );
                        // --------------------------------------------------------------
                        res.status(200).json({ status: "Success", msg: "Create Address success !", data: Address });
                        // --------------------------------------------------------------
                    }
                }).catch((err) => {
                    res.send(err);
                });
        });

    } catch (error) {

        res.status(400).send(error.message);

    }
};
// --------------------------------------------------------------
const getAllAddress = async(req, res, next) => {
    try {

        const Address = await firestore.collection('Address');
        // ------------------------------------------------------
        const AddressArray = [];
        await Address.get()
            .then((snap) => {
                // --------------------------------------------------------------
                if (snap.empty) {
                    // --------------------------------------------------------------
                    res.status(404).json({ status: "Fails", msg: 'No record found' });
                    // --------------------------------------------------------------
                } else {
                    // --------------------------------------------------------------
                    snap.forEach(doc => {

                        const Address = new Addresss(
                            doc.id,
                            doc.data().CusId,
                            doc.data().Fullname,
                            doc.data().PhoneNum,
                            doc.data().Stage,
                            doc.data().Address,
                            doc.data().used
                        );

                        AddressArray.push(Address);

                    });

                    res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: AddressArray });
                    // --------------------------------------------------------------
                }
            }).catch((err) => {
                res.send(err);
            });

    } catch (error) {

        res.status(400).send(error.message);

    }
};
// --------------------------------------------------------------
const getOneAddress = async(req, res, next) => {
    try {

        const id = req.params.id;

        const Address = await firestore.collection('Address').doc(id);

        await Address.get().then((snap) => {
            // --------------------------------------------------------------
            if (snap.empty) {
                // --------------------------------------------------------------
                res.status(404).json({ status: "Fails", msg: 'No record found' });
                // --------------------------------------------------------------
            } else {
                // --------------------------------------------------------------
                const Address = new Addresss(
                    snap.id,
                    snap.data().CusId,
                    snap.data().Fullname,
                    snap.data().PhoneNum,
                    snap.data().Stage,
                    snap.data().Address,
                    snap.data().used
                );

                res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: Address });
                // --------------------------------------------------------------
            }
        }).catch((err) => {
            res.send(err);
        });
    } catch (error) {

        res.status(400).send(error.message);

    }
};
// --------------------------------------------------------------
const UpdateAddress = async(req, res, next) => {
    try {

        const id = req.params.id;

        const data = req.body;

        const Address = await firestore.collection('Address').doc(id);
        await Address.get().then((snap) => {
            // --------------------------------------------------------------
            if (snap.empty) {
                // --------------------------------------------------------------
                res.status(404).json({ status: "Fails", msg: 'No record found' });
                // --------------------------------------------------------------
            } else {
                Address.update(data);

                res.status(200).json({ status: "Success", msg: 'Record updated successfuly' });
                // --------------------------------------------------------------
            }
        }).catch((err) => {
            res.send(err);
        });
    } catch (error) {

        res.status(400).send(error.message);

    };
    // --------------------------------------------------------------
};

// --------------------------------------------------------------
const deleteAddress = async(req, res, next) => {
    try {

        const id = req.params.id;

        const Address = await firestore.collection('Address').doc(id);
        await Address.get().then((snap) => {
            // --------------------------------------------------------------
            if (snap.empty) {
                // --------------------------------------------------------------
                res.status(404).json({ status: "Fails", msg: 'No record found' });
                // --------------------------------------------------------------
            } else {
                Address.delete();

                res.status(200).json({ status: "Success", msg: 'Record delete successfuly' });
                // --------------------------------------------------------------
            }
        }).catch((err) => {
            res.send(err);
        });
    } catch (error) {

        res.status(400).send(error.message);

    }
};

//-------------------------------------------------------------
const GetAllDataBycus = async(req, res, next) => {
    try {
        const id = req.params.id;
        var arraydata = [];
        await firestore.collection('Address').where("CusId", '==', id).get()
            .then((snapp) => {
                if (snapp.empty) {

                    res.status(404).json({ status: "Fails", msg: 'No record found' });

                } else {

                    snapp.forEach(doc => {

                        const Address = new Addresss(
                            doc.id,
                            doc.data().CusId,
                            doc.data().Fullname,
                            doc.data().PhoneNum,
                            doc.data().Stage,
                            doc.data().Address,
                            doc.data().used
                        );

                        arraydata.push(Address);

                    });

                    res.status(200).json({ status: "Success", msg: "Get All Data Successfully", data: arraydata });
                }
            }).catch((err) => {
                res.send(err);
            });

    } catch (error) {

        res.status(400).send(error.message);

    }
};
// --------------------------------------------------------------
module.exports = {
    // --------------------------------------------------------------
    createAddress,
    // --------------------------------------------------------------
    getAllAddress,
    // --------------------------------------------------------------
    getOneAddress,
    // --------------------------------------------------------------
    // --------------------------------------------------------------
    UpdateAddress,
    // --------------------------------------------------------------
    deleteAddress,
    // --------------------------------------------------------------
    GetAllDataBycus
    // --------------------------------------------------------------
};