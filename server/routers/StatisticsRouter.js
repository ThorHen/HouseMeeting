const express = require('express');
const router = express.Router();
const modelController = require('../../controllers/ModelController');
const dbController = require('../../controllers/DBController');

router.get('/', (req,res) => {
    res.render('Statistics', {title: 'Statistik'});
    res.end();
})

module.exports = router;