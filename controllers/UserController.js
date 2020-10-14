const bcrypt = require('bcrypt');
const dbController = require('./DBController');

const saltRounds = 12;

async function saltAndHashPassword(plaintextPassword) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    const hashObj = { salt: salt, hashedPassword: hashedPassword };

    return hashObj;
}

async function comparePassword(plaintextPassword, hashedPassword) {
    const isSame = await bcrypt.compare(plaintextPassword, hashedPassword);

    return isSame;
}

async function login(username, plaintextPassword) {
    //Contact db for any users with given username (should utilize DBController function?)
    let returnedUserPrivileges = await getSpecificUserPassword(username);
    
    if (typeof returnedUserPrivileges === 'undefined') {
        return { validLogin: false, admin: 0 };
    }

    let validLogin = await comparePassword(plaintextPassword, returnedUserPrivileges.hashedPassword);

    return { validLogin: validLogin, admin: returnedUserPrivileges.admin };
}
async function createUser(username, plaintextPassword) {
    let hashObj = await saltAndHashPassword(plaintextPassword);
    let createdUser = dbController.createUser(username, hashObj);

    return createdUser;
}

async function getSpecificUserPassword(username) {
    const returnedUser = await dbController.getUser(username);

    if (!returnedUser) {
        return;
    }
    else {
        return { admin: returnedUser.admin, hashedPassword: returnedUser.hashObj.hashedPassword };
    }
}

async function createUser(name, username, plaintextPassword, admin) {
    let hashObj = await saltAndHashPassword(plaintextPassword);

    dbController.createUser(name, username, hashObj, admin);
}

module.exports = { saltAndHashPassword, createUser, comparePassword, login, getSpecificUserPassword };