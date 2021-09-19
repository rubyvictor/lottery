import { default as Web3 } from "web3";

const Lottery = artifacts.require("../src/abis/Lottery.json");

export default async function(callback) {
    try {
        // Get Accounts
        const accounts = await Web3.eth.getAccounts()

        // Get network ID
        const netId = await Web3.eth.net.getId()
        // Fetch deployed contract
        const contract = await Lottery.abi.deployed()
        const networkAddress = await Lottery.abi.networks[netId].address
        console.log("Contract:",contract)
        console.log('Contract fetched from network address with accounts:', networkAddress + " "+ accounts)
    }
    catch(error) {
        console.log(error)
    }
    callback()
}