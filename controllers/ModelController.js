//require firebase controller function with collection and object to be uploaded as parameters
const dbController = require('./DBController'); 

let agenda = new Map();
let mealPlan = new Map();

function resetAgendaAndMealPLan() {
        agenda = new Map();
        mealPlan = new Map();
}
async function createHouseMeeting() {
    let houseMeeting = {agenda: Object.fromEntries(agenda), mealPlan: Object.fromEntries(mealPlan)};
    let jsonHouseMeeting = await dbController.createDoc('houseMeetings', houseMeeting);

    resetAgendaAndMealPLan();

    return jsonHouseMeeting;
}

function setDinner(day, cook, dish, participants) {
    let newDinner = {day: day, cook: cook, dish: dish, participants: participants};
    mealPlan.set(day, newDinner);

    return newDinner;
}

function setPoint(title, description) {
    agenda.set(title, description);
}

function deleteHouseMeeting(date) {
    //query housemeeting docs for given date. If any exists, delete it
    let returnedHouseMeeting // = db.collection('cities').doc('DC').delete();

    return returnedHouseMeeting;
}

function getContent() {
    return {agenda: Object.fromEntries(agenda), mealPlan: Object.fromEntries(mealPlan)};
}

module.exports = {createHouseMeeting, setPoint, setDinner, getContent};