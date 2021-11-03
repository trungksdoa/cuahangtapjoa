// 'use strict';
/*jshint esversion: 9 */
const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
const Likes = require('../models/Likes');
const Testobject = require('../models/TestiObject');
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();

const { v4: uuidv4 } = require('uuid');
// --------------------------------------------------------------
function CreateObject(data) {
    return new Likes(
        data.id,
        data.data().CusId,
        data.data().productId,
    );
}

function CheckExis(key) {
    let array = [];
    firestore.collection('Likes').get((doc) => {
        if (!doc.empty) {
            doc.forEach(docs => {
                array.push(docs.id);
            });
            return array.indexOf(key) != -1 ? true : false;
        }
    });
}
const CreateLikes = async(req, res, next) => {

    try {
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const docmentred = await firestore.collection('Likes');
        let uuid = uuidv4();
        while (CheckExis(uuid)) {
            uuid = uuidv4();
        }
        // --------------------------------------------------------------
        await docmentred.doc(uuid).set(data).then((snapshot) => {
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
                    const Like = CreateObject(snapshot);
                    // --------------------------------------------------------------
                    return res.status(200).json({ status: "Success", msg: "Create Like success !", dataObject: Like });
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
const getAllLikeByCus = async(req, res, next) => {
    try {
        const cusId = req.params.cusId;
        // --------------------------------------------------------------
        const Like = await firestore.collection('Likes');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await Like.where('CusId', "==", cusId).get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const LikeArray = [];
                // --------------------------------------------------------------
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    const Like = CreateObject(doc);
                    // --------------------------------------------------------------
                    LikeArray.push(Like);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Get Data Successfully", dataList: LikeArray });
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
const getAllMostLike = async(req, res, next) => {
    try {

        // const cusId = req.params.cusId;
        // --------------------------------------------------------------
        const Like = await firestore.collection('Likes');
        // ------------------------------------------------------
        // --------------------------------------------------------------
        await Like.get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                const LikeArray = [];
                // --------------------------------------------------------------
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    LikeArray.push(doc.data().productId);
                    // --------------------------------------------------------------
                });
                // var counts = LikeArray.reduce((map, val) => { map[val] = (map[val] || 0) + 1; return map }, {});
                LikeArray.sort();
                let newArrays = [];
                var current = null;
                var cnt = 0;
                for (var i = 0; i < LikeArray.length; i++) {
                    if (LikeArray[i] != current) {
                        if (cnt > 0) {
                            var newDatas = new Testobject(
                                current, cnt
                            );
                            newArrays.push(newDatas);
                        }
                        current = LikeArray[i];
                        cnt = 1;
                    } else {
                        cnt++;
                    }
                }
                var newDatass = new Testobject(
                    current, cnt
                );
                newArrays.push(newDatass);
                // var newDatas = new Testobject(
                //     current, cnt
                // );
                // let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
                return res.status(200).json({ status: "Success", msg: "Get Data Successfully", dataList: newArrays });
                // --------------------------------------------------------------
                // return res.status(200).json({ status: "Success", msg: "Get Data Successfully", dataList: LikeArray });
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
const getOneLike = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const Like = await firestore.collection('Likes').where("productId", "==", id);
        // --------------------------------------------------------------
        const data = await Like.get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                let Like = null;
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    Like = CreateObject(doc);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: Like });
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

const SearchLikeByProIdAndCusID = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        const CusId = req.params.CusId;
        // --------------------------------------------------------------
        const Like = await firestore.collection('Likes')
            .where("productId", "==", id)
            .where("CusId", "==", CusId);
        // --------------------------------------------------------------
        const data = await Like.get().then((snapp) => {
            if (snapp.empty) {
                return res.status(404).json({
                    status: "Fails",
                    msg: 'No record found',
                });
            } else {
                let Like = null;
                snapp.forEach(doc => {
                    // --------------------------------------------------------------
                    Like = CreateObject(doc);
                    // --------------------------------------------------------------
                });
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Search Success", dataObject: Like });
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
const UpdateLike = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const data = req.body;
        // --------------------------------------------------------------
        const ducks = await firestore.collection('Likes').doc(id);
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
const deleteLike = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const datas2 = await firestore.collection('Likes').where("productId", "==", id);
        await datas2.get()
            .then((snapp) => {
                if (!snapp.empty) {
                    let newId = null;
                    snapp.forEach(doc => {
                        newId = doc.id;
                    });
                    firestore.collection('Likes').doc(newId).delete().then(() => {
                        return res.status(200).json({ status: "Success", msg: "Delete Success" });
                    });
                    // --------------------------------------------------------------
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
// const observer = firestore.collection('Like').onSnapshot(docSnapshot => {
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
    CreateLikes,
    getAllLikeByCus,
    deleteLike,
    getOneLike,
    getAllMostLike,
    SearchLikeByProIdAndCusID
    // --------------------------------------------------------------
};