import React, { Component } from 'react';
import web3 from 'web3';
import lottery from './Lottery';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.web3.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. Consider using MetaMask :)');
    }
  }

  async loadBlockchainData() {
    // Load account
    const accounts = await web3.eth.getAccounts()

    if (typeof accounts[0] !== 'undefined') {

      //Make contract creator the organiser
      await lottery.methods.lottery().call();
      //Get list of players in this lottery for this contract
      const players = await lottery.methods.getPlayers().call();
      console.log(players);

      //load balance
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log(balance);

      //get address of organiser for this lottery
      const organiser = await lottery.methods.getOrganiser().call();
      console.log(organiser);
      this.setState({
        account: accounts[0],
        players: players,
        balance: balance,
        organiser: organiser
      });
    } else {
      window.alert('Please login with Metamask');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      players: [],
      balance: 0,
      value: '',
      message: '',
      organiser: ''
    };
  }

  submitLottery = async (event) => {
    //prevent default
    event.preventDefault();

    //get available accounts
    const accounts = await web3.eth.getAccounts();

    //set message state
    this.setState({
      message: 'Submitting your lottery and awaiting confirmation...',
    });

    //Enter lottery
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({
      message: 'You have been entered into the lottery. Good luck!',
    });
    //Reset state
    this.setState(this.state);
  };

  pickWinner = async () => {
    //get list of accounts in metamask
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting for winner to be picked...' });

    //pick winner
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: 'Winner has been drawn!' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Blockchain</h2>
        <p>
          There are currently {this.state.players.length} players in this lottery.
          <br></br>
          Organiser's address: {this.state.organiser}.
          <br></br>
          <br></br>
          Size of Lottery: {web3.utils.fromWei(this.state.balance, 'ether')} ETH
        </p>
        <hr />
        <form onSubmit={this.submitLottery}>
          <h4>Are you feeling lucky?</h4>
          <div>
            <label>Amount of ETH to enter:</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button type="submit">ENTER</button>
        </form>
        <br></br>
        <br></br>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.pickWinner}>End of lottery!</button>
        <br></br>
        <br></br>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
