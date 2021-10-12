// Import dependencies
const jwt = require("jsonwebtoken");
const fs = require('fs');
var iss = "VoHoangTrung";
var sub = "trungksdoa@gmail.com";
var aud = "https://www.facebook.com/HoangTrung194499/";
var exp = "3h";
module.exports = async(req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send({
        status: "denied",
        msg: "Access denied. No token provided"
    });

    try {
        var verifyOption = {
            issuer: iss,
            subject: sub,
            audience: aud,
            expiresIn: exp,
            algorithm: 'RS256'
        }
        var publicKey = fs.readFileSync('public.key');
        const decoded = await jwt.verify(token, publicKey, verifyOption);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({
            status: "expired",
            msg: "Unauthorized access"
        });
    }
}