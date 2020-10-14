// Google Cloud Firstore setup
const admin = require('firebase-admin');
const serviceAccount = require('../houseMeetingDB.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function getAllHouseMeetings() {
    let snapshot = await db.collection('houseMeetings').get();
    let houseMeetings = [];

    snapshot.docs.forEach(doc => {
        houseMeetings.push(doc.data());
    })

    return houseMeetings;
}

async function getHouseMeeting(id) {
    let foundMeeting = await db.collection('houseMeetings').doc(id).get();

    if (foundMeeting) {
        return foundMeeting.data();
    }
    else {
        return;
    }
}

async function getUser(username) {
    let foundUser = await db.collection('users').doc(username).get();

    if (foundUser) {
        return foundUser.data();
    }
    else {
        return;
    }
}

async function getNamesOfUsers() {
    const userSnapshot = await db.collection('users').get();
    let namesOfUsers = []

    userSnapshot.forEach(user => {
        namesOfUsers.push(user.data().name);
    })

    return namesOfUsers;
}

async function createUser(name, username, hashObj, admin) {
    let userObj = { name: name, username: username, hashObj: hashObj, admin: admin };
    db.collection('users').doc(username).set(userObj);

    return userObj;
}

async function createHouseMeeting(agenda, mealPlan) {
    let dateObj = new Date();
    let date = dateObj.getDate();
    let month = dateObj.getMonth();
    let year = dateObj.getFullYear();

    if (month < 10) {
        month = '0' + month;
    }

    let shortDate = `${date}-${month}-${year}`;

    let houseMeetingObj = { id: shortDate, agenda: agenda, mealPlan: mealPlan };
    db.collection('houseMeetings').doc(shortDate).set(houseMeetingObj);
}

async function updatePoint(houseMeetingDate, title, description) {
    let updatedPoint = {};
    updatedPoint[`agenda.${title}`] = description

    db.collection('houseMeetings').doc(houseMeetingDate).update(updatedPoint);

    return updatedPoint;
}

async function updateDinner(houseMeetingDate, day, cook, dish, participants) {
    let dinnerObj = { cook: cook, dish: dish, participants: participants }
    let updatedDinner = {};
    updatedDinner[`mealPlan.${day}`] = dinnerObj;
    db.collection('houseMeetings').doc(houseMeetingDate).update(updatedDinner);

    return updatedDinner;
}

module.exports = { getAllHouseMeetings, getNamesOfUsers, getHouseMeeting, getUser, createUser, createHouseMeeting, updatePoint, updateDinner };