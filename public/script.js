const { default: Web3 } = require("web3");

const Lottery = artifacts.require("./contracts/Lottery.sol");

module.exports = async function(callback) {
    try {
        // Get Accounts
        const accounts = await Web3.eth.getAccounts()

        // Fetch deployed contract
        const contract = await Lottery.deployed()
        console.log('Contract fetched', contract.address)
    }
    catch(error) {
        console.log(error)
    }
    callback()
}