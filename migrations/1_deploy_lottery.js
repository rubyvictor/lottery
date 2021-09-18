const Lottery = artifacts.require('./Lottery.sol');

module.export = function (deployer) {
  deployer.deploy(Lottery);
};
