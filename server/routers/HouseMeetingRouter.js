const express = require('express');
const router = express.Router();
const modelController = require('../../controllers/ModelController');
const dbController = require('../../controllers/DBController');

router.get('/all', async (req, res) => {
    let houseMeetings = await dbController.getAllHouseMeetings();
    res.render('HouseMeetingOverview', { title: 'Husmødeoversigt', houseMeetings: houseMeetings });
});

router.post('/updatePoint', async (req, res) => {
    let houseMeetingDate = req.body.houseMeeting;
    let title = req.body.title;
    let description = req.body.description;

    let updatedPoint = await dbController.updatePoint(houseMeetingDate, title, description);

    setTimeout(() => {
        res.redirect(`/housemeetings/hm/${houseMeetingDate}`);
    }, 200)

})

router.post('/updateDinner', async (req, res) => {
    let houseMeetingDate = req.body.houseMeeting;
    let day = req.body.day;
    let cook = req.body.cook;
    let dish = req.body.dish;
    let participants = req.body.participants;

    let updatedDinner = await dbController.updateDinner(houseMeetingDate, day, cook, dish, participants);
    
    setTimeout(() => {
        res.redirect(`/housemeetings/hm/${houseMeetingDate}`);
    }, 200)
})

router.get('/hm/:id', async (req, res) => {
    let houseMeeting = dbController.getHouseMeeting(req.params.id);
    let users = dbController.getNamesOfUsers();

    let promises = await Promise.all([houseMeeting, users])
    res.render('HouseMeeting', {title: 'Husmøde d. ' + req.params.id, houseMeeting: promises[0], users: promises[1]})
})

router.get('/create', async (req, res) => {
    let contentObj = modelController.getContent();
    contentObj.title = 'Opret husmøde';

    contentObj.users = await dbController.getNamesOfUsers();

    console.log(contentObj);
    res.render('CreateHouseMeeting', contentObj);
})

router.post('/create/setPoint', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;

    modelController.setPoint(title, description);
    
    res.redirect('/housemeetings/create');
})

router.post('/create/setDinner', (req, res) => {
    let day = req.body.day;
    let cook = req.body.cook;
    let dish = req.body.dish;
    let participants = req.body.participants;

    console.log(modelController.setDinner(day, cook, dish, participants));

    res.redirect('/housemeetings/create');
})

router.post('/create/confirm', (req, res) => {
    //create new document in houseMeetings with current values in ModelController
})

module.exports = router;