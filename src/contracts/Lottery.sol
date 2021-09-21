pragma solidity ^0.5.0;

contract Lottery {
    address public organiser;
    address payable [] public players;

    //assign lottery organiser to contract creator
    function lottery() public payable {
        organiser = msg.sender;
    }

    //add player's address to the lottery pool
    function enter(uint256 _value) public payable {
        require(_value > 0.01 ether);
        require(_value <= msg.sender.balance);
        
        uint256 valueToWei = _value * (10**18);
        msg.sender.transfer(valueToWei);
        players.push(msg.sender);
    }

    //get list of players in the lottery
    function getPlayers() public view returns (address payable [] memory) {
        return players;
    }

    //get organiser's address in the lottery
    function getOrganiser() public view returns (address) {
        return organiser;
    }

    //Modifier to check that the organiser is the one calling the method to pick winner
    modifier organiserOnly() {
        require(msg.sender == organiser);
        _;
    }

    //Method to generate pseudo random number which uses block timestamp
    function randomize() public view returns(uint) {
        //use keccak256 hash
        //hash block difficulty + timestamp + player list
        bytes32 hash = keccak256(abi.encodePacked(block.difficulty, now, players));

        return uint(hash);
    }

    function pickWinner() public payable organiserOnly {
        //get random winning index using modulo of number of players
        uint winnerIndex = randomize() % players.length;

        //transfer lottery pool or contract balance to winning address
        players[winnerIndex].transfer(address(this).balance);

        //zerolise player list
        players = new address payable [](0);
    }

}