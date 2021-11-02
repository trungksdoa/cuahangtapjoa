// 'use strict';
/*jshint esversion: 9 */
// const firebase = require('../db');
// --------------------------------------------------------------
const firebase_admin = require('../db_admin');
// --------------------------------------------------------------
// const firestore = firebase.firestore();
// --------------------------------------------------------------
const firestore = firebase_admin.firestore();
const Config = require('../config');
const jwt = require("jsonwebtoken");
const express = require("express");
var CryptoJS = require("crypto-js");
const Users = require('..//models//User');
const fs = require('fs');

var iss = "VoHoangTrung";
var sub = "trungksdoa@gmail.com";
var aud = "https://www.facebook.com/HoangTrung194499/";
var exp = "60s";

var signOption = {
    issuer: iss,
    subject: sub,
    audience: aud,
    expiresIn: exp,
    algorithm: 'RS256'
};

var iss2 = "VoHoangTrung";
var sub2 = "trungksdoa@gmail.com";
var aud2 = "https://www.facebook.com/HoangTrung194499/";
var exp2 = "7d";


var signOption2 = {
    issuer: iss2,
    subject: sub2,
    audience: aud2,
    expiresIn: exp2,
    algorithm: 'RS256'
};

var iss3 = "VoHoangTrung";
var sub3 = "trungksdoa@gmail.com";
var aud3 = "https://www.facebook.com/HoangTrung194499/";
var exp3 = "24h";

var signOption3 = {
    issuer: iss3,
    subject: sub3,
    audience: aud3,
    expiresIn: exp3,
    algorithm: 'RS256'
};

var iss4 = "VoHoangTrung";
var sub4 = "trungksdoa@gmail.com";
var aud4 = "https://www.facebook.com/HoangTrung194499/";
var exp4 = "7d";

var signOption4 = {
    issuer: iss4,
    subject: sub4,
    audience: aud4,
    expiresIn: exp4,
    algorithm: 'RS256'
};

// ------------------------------------------------------------------------

// ---------------------Key------------------------
//Public key None key

var privateTKKey = fs.readFileSync('private.key');

//Public key Refesh key

var privateRfKey = fs.readFileSync('RfPrivate.key');

//Public None key

var publicTkKey = fs.readFileSync('public.key');

//Public Refeshing key

var publicRfKey = fs.readFileSync('RfPublic.key');
// -------------------End--------------------------
const { v4: uuidv4 } = require('uuid');
// ----------------------------------------------

function CheckIsAdmin(array) {
    var a = array;
    var index = 0;
    var entry;
    for (index = 0; index < a.length; ++index) {
        entry = a[index];
        if (entry == "admin") {
            return true;
        }
    }
}

function CreateObject(data) {
    return new Users(
        data.id,
        data.data().username,
        data.data().email,
        data.data().password,
        data.data().roles,
        data.data().dateCreated,
    );
}
// ------------------------------------------------------------------------

const Login = async(req, res, next) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        // const data = await firestore.collection('User').where('email', '==', email).get();

        await firestore.collection('User').where('email', '==', email).get().then(async(respones) => {
            if (respones.empty) {
                return res.status(404).json({ status: "Fails", msg: 'Login fails,No account found' });
            } else {
                let user = "";
                respones.forEach((doc) => {
                    user = CreateObject(doc);
                });
                jsonString = JSON.stringify(user);
                Usersdata = JSON.parse(jsonString);
                var bytes = CryptoJS.Rabbit.decrypt(Usersdata.password, Config.KeyEncrypt);
                var originalPass = bytes.toString(CryptoJS.enc.Utf8);
                if (originalPass != password) {
                    return res.status(500).json({ status: "Fails", msg: "Password invalid" });
                } else {
                    var Username = Usersdata.username;

                    // -----------------------
                    var payload = {};
                    payload.id = Usersdata.id;

                    payload.username = Username;

                    payload.roles = Usersdata.roles;

                    var token = null;
                    if (CheckIsAdmin(Usersdata.roles)) {


                        token = jwt.sign(payload, privateTKKey, signOption3);

                        const Refreshtoken = jwt.sign(payload, privateRfKey, signOption4);
                        const requestDatas = {
                            id: Usersdata.id,
                            status: "Success",
                            msg: "Welcome back my Boss ,Have a nine day",
                            token: token,
                            Refreshtoken: Refreshtoken,
                            username: Username,
                            email: email,
                            Roles: "admin"
                        };
                        return res.status(200).json({ status: "Success", msg: "Login success !", dataObject: requestDatas });
                    } else {
                        token = jwt.sign(payload, privateTKKey, signOption);

                        const Refreshtoken = jwt.sign(payload, privateRfKey, signOption2);
                        const requestDatas = {
                            id: Usersdata.id,
                            status: "Success",
                            msg: "Welcome back user ,Have a nine day",
                            token: token,
                            Refreshtoken: Refreshtoken,
                            username: Username,
                            email: email,
                            Roles: "user"
                        };
                        return res.status(200).json({ status: "Success", msg: "Login success !", dataObject: requestDatas });
                    }
                }
            }
        }).catch((err) => {
            console.log(err)
            return res.send(err);
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

function CheckExis(key) {
    let array = [];
    firestore.collection('User').get((doc) => {
        if (!doc.empty) {
            doc.forEach(docs => {
                array.push(docs.id);
            });
            return array.indexOf(key) != -1 ? true : false;
        }
    });
}

const Register = async(req, res, next) => {
    try {

        const data = req.body;
        await firestore.collection('User').where('email', '==', data.email).get().then(async(snapshot) => {
            if (!snapshot.empty) {
                return res.status(200).json({
                    status: "Fails",
                    msg: "Email already exists in system",
                });
            } else {

                var ciphertext = CryptoJS.Rabbit.encrypt(data.password, Config.KeyEncrypt).toString();

                // // now we set user password to hashed password
                const newpass = ciphertext;
                let date_ob = new Date();

                let dataobj = {
                    username: data.username,
                    email: data.email,
                    password: newpass,
                    roles: data.roles,
                    dateCreated: date_ob.toLocaleDateString()
                };
                let uuid = uuidv4();
                while (CheckExis(uuid)) {
                    uuid = uuidv4();
                }
                firestore.collection('User').doc(uuid).set(dataobj).then(() => {
                    return res.status(200).json({
                        status: "Success",
                        msg: "Register success",
                    });
                });
            }
        }).catch((err) => {
            console.log(err)
            return res.send(err);
        });
    } catch (error) {

        return res.status(400).send(error.message);

    }
};
// ------------------------------------------------------------------------
// ===========================Request Token================================
// ------------------------------------------------------------------------
const RequestToken = async(req, res, next) => {
    try {
        const refreshToken = req.body.token;

        if (!refreshToken || !refreshToken.includes(refreshToken)) {
            return res.status(403).json({ status: "denied", message: "User not authenticated" })
        }

        await jwt.verify(refreshToken, publicRfKey, signOption2, (err, user) => {
            if (!err) {
                var payload = {};
                payload.id = user.id;

                payload.username = user.username;

                payload.roles = user.roles;

                var accessToken = jwt.sign(payload, privateTKKey, signOption);
                let date_ob = new Date();
                return res.status(200).json({
                    status: "Success",
                    token: accessToken,
                    TKexpiresIn: 10800000,
                    issuedday: date_ob.getTime()
                });
            } else {
                return res.status(403).json({ status: "No permission", message: "User not authenticated" })
            }
        });
    } catch (error) {

        return res.status(400).send(error.message);

    }
};
// ------------------------------------------------------------------------
// ===========================Select All================================
// ------------------------------------------------------------------------
const FindALl = async(req, res, next) => {
    try {
        const useraray = [];
        await firestore.collection('User').get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    return res.status(200).json({
                        status: "Fails",
                        msg: 'No record found',
                    });
                } else {
                    snapshot.forEach((doc) => {
                        let user = CreateObject(doc);
                        useraray.push(user);
                    });
                    return res.status(200).json({ status: "Success", msg: "Get All Data Successfully", dataList: useraray });
                }
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                return res.send(err);
            });


    } catch (error) {

        return res.status(400).send(error.message);

    }
};
const getOne = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;

        // --------------------------------------------------------------
        const users = await firestore.collection('User').doc(id);
        // --------------------------------------------------------------
        await users.get().then((snapshot) => {
            // --------------------------------------------------------------
            if (snapshot.empty) {
                // --------------------------------------------------------------
                return res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                let user = CreateObject(snapshot);
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Found record with ID:  " + id + "", dataObject: User });
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
};
const update = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        const data = req.body;
        // --------------------------------------------------------------
        const users = await firestore.collection('User').doc(id);
        // --------------------------------------------------------------
        await users.get().then((snapshot) => {
            // --------------------------------------------------------------
            if (snapshot.empty) {
                // --------------------------------------------------------------
                return res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                users.update(data);
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
};
const deletes = async(req, res, next) => {
    try {
        // --------------------------------------------------------------
        const id = req.params.id;
        // --------------------------------------------------------------
        const users = await firestore.collection('User').doc(id);
        await users.get().then((snapshot) => {
            // --------------------------------------------------------------
            if (snapshot.empty) {
                // --------------------------------------------------------------
                return res.status(200).json({
                    status: "Fails",
                    msg: 'No record found',
                });
                // --------------------------------------------------------------
            } else {
                users.delete();
                // --------------------------------------------------------------
                return res.status(200).json({ status: "Success", msg: "Delete record with ID:  " + id + "" });
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
};
module.exports = {
    getOne,
    update,
    deletes,
    Login,
    RequestToken,
    Register,
    FindALl
};