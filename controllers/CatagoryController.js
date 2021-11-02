// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Catagorys = require('../models/Catagory');
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();

const { v4: uuidv4 } = require('uuid');
// --------------------------------------------------------------
function CreateObject(data) {
    return new Catagorys(
        data.id,
        data.data().CataName,
        data.data().active
    );
}

function CheckExis(key) {
    let array = [];
    firestore.collection('Catagory').get((doc) => {
        if (!doc.empty) {
            doc.forEach(docs => {
                array.push(docs.id);
            });
            return array.indexOf(key) != -1 ? true : false;
        }
    });
}
const createCatagory = async(req, res, next) => {

    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const docmentred = await firestore.collection('Catagory');
        // --------------------------------------------------------------
        await docmentred.add(data).then((snaps) => {
            const id = snaps.id;
            // --------------------------------------------------------------
            docmentred.doc(id).get().then((snapshot) => {
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
                    let catagory = CreateObject(snapshot);
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Create Catagory success !", dataObject: catagory });
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
const getAllcatagory = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const Catagory = await firestore.collection('Catagory');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await Catagory.get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const CatagoryArray = [];
                // --------------------------------------------------------------
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    let catagory = CreateObject(doc);
                    // --------------------------------------------------------------
                    CatagoryArray.push(catagory);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: CatagoryArray });
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
const getOneCatagory = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;

        // --------------------------------------------------------------
        const Catagory = await firestore.collection('Catagory').doc(id);
        // --------------------------------------------------------------
        const data = await Catagory.get().then((snapp) => {
            if (!snapp.exists) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                let Catagory = CreateObject(snapp);
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: Catagory });
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
const UpdateCatagory = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const ducks = await firestore.collection('Catagory').doc(id);
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
const deleteCatagory = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const datas2 = await firestore.collection('Catagory').doc(id)
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
// const observer = firestore.collection('Catagory').onSnapshot(docSnapshot => {
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
    createCatagory,
    // --------------------------------------------------------------
    getAllcatagory,
    // --------------------------------------------------------------
    getOneCatagory,
    // --------------------------------------------------------------
    UpdateCatagory,
    // --------------------------------------------------------------
    deleteCatagory
    // --------------------------------------------------------------
};