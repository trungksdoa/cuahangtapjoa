'use strict';
const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    ACCESS_SERECT_TOKEN,
    ACCESS_SERECT_REFRESH_TOKEN,
    SALT,
    SERECT_KEY_TRUNG,
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    KEYENSCRYPTION
} = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

module.exports = {
    serecttoken: ACCESS_SERECT_TOKEN,
    requestSerectToken: ACCESS_SERECT_REFRESH_TOKEN,
    salt: SALT,
    serectKeyFromtrung: SERECT_KEY_TRUNG,
    port: PORT,
    host: HOST,
    url: HOST_URL,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    },
    KeyEncrypt: KEYENSCRYPTION
}