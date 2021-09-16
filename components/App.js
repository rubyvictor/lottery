import React, { Component } from 'react';
import web3 from 'web3';

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
    if (typeof accounts[0] !== 'undefined') {
      //Get list of players in this lottery for this contract
      const players = await lottery.methods.getPlayers().call();

      //load balance
      const balance = await web3.eth.getBalance(accounts[0]);

      this.setState({
        account: accounts[0],
        players: players,
        balance: balance,
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
          There are currently {this.state.players.length} players in this round.{' '}
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
