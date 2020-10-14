const express = require('express');
const router = express.Router();
const modelController = require('../../controllers/ModelController');
const dbController = require('../../controllers/DBController');

router.get('/', async (req, res) => {
    //Get most recent housemeeting from DB and display agenda and/or mealPlan
    res.render('FrontPage', {title: 'Forside'});
    res.end();
})


module.exports = router;