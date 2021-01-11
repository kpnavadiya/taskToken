const express = require('express');
const router = express.Router();


const AppController = require('../controller/index');


router.get('/getTokenDetails', async (req, res, next) => {
    const appVar = new AppController(req, res, next);
    console.log('In route?????')
    try {
        console.log('In Router Try Block!!!')
        let result = await appVar.showTokenDetails();
        res.status(200).send({ "message": "Success", "data": result })
   
    } catch (error) {

        res.status(500).send({ "message": `${error}`, "data": {} })
    }

});

router.get('/checkTokenBalance/:address', async (req, res, next) => {
    const appVar = new AppController(req, res, next);
    try {
        console.log('In Router Try Block!!!')
        let address = req.params.address;
        console.log('..find Address:',address)
        let result = await appVar.checkTokenBalance(address);
        res.status(200).send({ "message": "Success", "data": result })
   
    } catch (error) {

        res.status(500).send({ "message": `${error}`, "data": {} })
    }

});

router.post('/transferToken', async (req, res, next) => {
    const appVar = new AppController(req, res, next);

    try {
        let result = await appVar.transferToken();
        res.status(200).send({ "message": "Success", "data": result })
   
    } catch (error) {

        res.status(500).send({ "message": `${error}`, "data": {} })
    }

});

router.post('/createWallet', async (req, res, next) => {
    const appVar = new AppController(req, res, next);

    try {
        let result = await appVar.createWallet();
        res.status(200).send({ "message": "Success", "data": result })
   
    } catch (error) {

        res.status(500).send({ "message": `${error}`, "data": {} })
    }

});


module.exports = router