const express = require('express');
const router = express.Router();
const userController = require('../../controllers/UserController');
const dbController = require('../../controllers/DBController');

router.use('/admin/:path', function (req, res, next) {
    if(req.session.admin === 1) {
        next();
    }
    else {
        res.send('Du har ikke admin rettigheder!');
        res.end();
    }
})

router.get('/admin/create', (req, res) => {
    res.render('CreateUser', {title: 'Opret bruger'});
})

router.post('/admin/createuser', async (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    let admin = 0;
    
    if(req.body.admin) {
        admin = Number(req.body.admin);
    }

    userController.createUser(name, username, password, admin);

    res.send('Bruger oprettet!');
    res.end();
})

router.get('/login', (req, res) => {
    res.render('Login', {title: 'Login'})
});

router.post('/auth', async (req, res) => {
    const username = req.body.username;
    const plaintextPassword = req.body.password;

    let authentication = await userController.login(username, plaintextPassword);

    console.log(authentication);

    if (authentication.validLogin) {
        req.session.isLoggedIn = true;
        req.session.admin = authentication.admin;
        console.log(req.session.admin);
        
        res.redirect('/');
    }
    else {
        res.render('Login', { title: 'Login', error: 'Ugyldigt username eller password' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
});


module.exports = router;