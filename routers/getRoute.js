const express = require('express');
const TronWeb = require('tronweb');
var crypto = require('crypto');

const route = express.Router();

const proxyWallets = require('../model/proxyWallets');

route.post('/createWallet', async(req, res) => {
    // create new tron wallet
    var privateKey = crypto.randomBytes(32).toString('hex');
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.nileex.io");
    const solidityNode = new HttpProvider("https://api.nileex.io");
    const eventServer = new HttpProvider("https://event.nileex.io");
    const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
    const wallet = await tronWeb.createAccount();

    var proxyWalletData = proxyWallets({
        username: req.body.name,
        amount: String(1000000 * parseFloat(req.body.amount)),
        wallet: JSON.stringify({
            address: wallet.address.base58,
            private: wallet.privateKey
        }),
        status: "fail",
        transaction: ""
    });

    var finalData = await proxyWalletData.save();

    console.log("final:", finalData)

    if(finalData)    
        return res.status(200).send(JSON.parse(finalData.wallet).address);

    return res
        .status(400)
        .send("error");

});

module.exports = route;
