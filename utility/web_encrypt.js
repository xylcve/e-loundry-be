const crypto = require('crypto');

const PASSPHRASE = "elaundry_higenncy"

/**
 * 
 * @returns {{publicKey: string, privateKey: string}}
 */
const getKeyPair = () => {
    const key_pair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: PASSPHRASE
        }
    })

    return key_pair;
}

/**
 * 
 * @param {string} payload 
 * @param {string} public_key 
 * @returns {string} hex formatted
 */
const encrypt = (payload, public_key) => {
    const encrypted = crypto.publicEncrypt(public_key, payload);
    return encrypted.toString('hex');
}

/**
 * 
 * @param {string} payload 
 * @param {string} private_key 
 * @returns {string} decrypted value
 */
const decrypt = (payload, private_key) => {
    const buffer = Buffer.from(payload, 'hex');
    const priv = crypto.createPrivateKey({ key: private_key, passphrase: PASSPHRASE });
    const decrypted = crypto.privateDecrypt(priv, buffer)
    return decrypted.toString()
}

module.exports = { getKeyPair, encrypt, decrypt }

