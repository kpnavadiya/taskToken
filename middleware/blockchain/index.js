const Web3 = require('web3');
require('dotenv').config();


// const web3 = new Web3('https://ropsten.infura.io/v3/9af6296169654cb3acb784324a8eb701')
const web3 = new Web3(process.env.INFURA_ENDPOINT)

const ABI = require('../../src/abi');
// const router = require('../../version1/route');
// const contractAddress = '0x37b8e13f85b4f395bcd53ca247df629b987332fa'
const contractAddress = process.env.CONTRACT_ADDRESS

  module.exports = class BlockchainMiddleware { 

    async tokenDetails() {
        console.log('Token details in Middleware!!!')
        
        return new Promise(async (resolve, reject) => {
        
            const contractInstance = new web3.eth.Contract(ABI, contractAddress);

            let name = await contractInstance.methods.name().call();
            let symbol = await contractInstance.methods.symbol().call();
            let decimals = await contractInstance.methods.decimals().call();

            let dataObj = {}

            dataObj['name'] = name
            dataObj.symbol = symbol
            dataObj.decimals = decimals

            resolve(dataObj)
            console.log('\n Contract Information From Blockchain ::', dataObj)
            // console.log('\n \n')
        });

    }

    async getTokenBalance(address) {

        console.log('Owner Token Balance!!!:  \n')
        return new Promise(async (resolve, reject) => {
            const contractInstance = new web3.eth.Contract(ABI, contractAddress);
            let tokenBalance = await contractInstance.methods.balanceOf(address).call();

            let totalSupply = await contractInstance.methods.totalSupply().call();

            let netToken = Number(tokenBalance / 100000000)
            let totalS = Number(totalSupply / 100000000)

            let tokenObj = {}
            tokenObj.address = address
            tokenObj['tokenBalance'] = netToken
            tokenObj['totalSupply'] = totalS

            console.log(tokenObj)
            resolve(tokenObj)
            // console.log('Token Balance :', netToken, 'TotalSupply :',totalS);
        });
    }

    async createWallet() {

        return new Promise(async (resolve, reject) => {
            let createWallet = await web3.eth.accounts.wallet.create(2562);

            let walletInfo = {}
            walletInfo['publicKey'] = createWallet[0].address;
            walletInfo['privateKey'] = createWallet[0].privateKey;
            resolve(walletInfo)

            console.log('\n Wallet Information ::', walletInfo)
        });
    }

    async transferTaskTokens(senderAddress, senderKey, receiverAddress, amount) {

        // try {
        console.log('------- Transfering Token --------- \n')
        return new Promise(async (resolve, reject) => {
            
            const contractInstance = new web3.eth.Contract(ABI, contractAddress);
            let tokenBalance = await contractInstance.methods.balanceOf(senderAddress).call();
                
            if(amount <= tokenBalance){

                let transfer = contractInstance.methods.transfer(receiverAddress, amount);
                let encodedABI = transfer.encodeABI();

                const txnNonce = await web3.eth.getTransactionCount(senderAddress, 'pending');
                console.log('Get Number Of Transactions From Wallet Address', txnNonce);

                if (txnNonce == 0 || txnNonce == null) {
                    console.log("If not any transction done than it revert!!")
                }
                else if (txnNonce) {

                    let txnObject = {
                        from: senderAddress,
                        to: contractAddress,    //  Contract Address
                        gasPrice: web3.utils.toHex(web3.utils.toWei('1000', 'Gwei')),
                        gas: web3.utils.toHex('75000'), // Gas limit
                        value: "0x0",
                        nonce: web3.utils.toHex(txnNonce),
                        data: encodedABI
                    };

                    const Tx = require('ethereumjs-tx').Transaction

                    // Object to be signed 
                    let tx = new Tx(txnObject, { chain: 'ropsten', hardfork: 'petersburg' });

                    // Private key of the sender
                    const sender_pvtkey = Buffer.from(senderKey, 'hex');

                    tx.sign(sender_pvtkey);
                    let serializedTx = tx.serialize();

                    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                        .on('receipt', function (transactionDetails) {
                            console.log("Transaction Details ", transactionDetails);
                            resolve(transactionDetails)

                        }).on('error', function (err) {
                         console.log("Error Called: " + err);
                    })
                }
            } 
            else {

                let resObject = {}
                resObject['info'] = ' Insufficient balance!!'
                resObject.tokenBalance = tokenBalance
                resolve(resObject)
                
                console.log('Insufficient balance!!', tokenBalance)
            }
        });
    }
}
//   module.exports =  tokenDetails()

// tokenDetails();
// getToken();
// sendTaskTokens();
// createWallet();