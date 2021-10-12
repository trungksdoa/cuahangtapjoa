const firebase = require('firebase');
const config = require('./config');
const admin = require('firebase-admin');

const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;