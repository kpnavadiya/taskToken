const express = require('express');
const router = express.Router();


const BlockchainMiddleware = require('../../middleware/blockchain/index')

let blockchainMiddleware = new BlockchainMiddleware()
 
module.exports = class AppController {

    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
    }
    
    async showTokenDetails() {
        try {

            return new Promise(async (resolve, reject) => {
                
                console.log('Token Details console in controller!!')
                // let blockchainMiddleware = new BlockchainMiddleware()
                let result = await blockchainMiddleware.tokenDetails()

                resolve(result)

            })
        } catch (err) {
            console.log('Some error', err)
            throw new Error("found exception :", err.message)
        }

    }
    async checkTokenBalance(address) {
        try {

            return new Promise(async (resolve, reject) => {
                
                console.log('Token Balance console in controller!!')
                // let blockchainMiddleware = new BlockchainMiddleware()
                let result = await blockchainMiddleware.getTokenBalance(address)

                resolve(result)

            })
        } catch (err) {
            console.log('Some error', err)
            throw new Error("found exception :", err.message)
        }

    }
    async transferToken() {
        try {

            return new Promise(async (resolve, reject) => {

                let senderAddress = this.req.body.sender
                let senderKey = this.req.body.key
                let receiverAddress = this.req.body.receiver
                let amount = this.req.body.tokenAmount

                let result = await blockchainMiddleware.transferTaskTokens(senderAddress, senderKey, receiverAddress, amount)

                resolve(result)

            })
        } catch (err) {
            console.log('Some error', err)
            throw new Error("found exception :", err.message)
        }
    }
    async createWallet() {
        try {
            return new Promise(async (resolve, reject) => {

                let result = await blockchainMiddleware.createWallet()
                resolve(result)

            })
        } catch (err) {
            console.log('Some error', err)
            throw new Error("found exception :", err.message)
        }
    }

}