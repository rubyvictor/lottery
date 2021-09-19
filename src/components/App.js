import React, { Component } from 'react';
import { default as Web3 } from 'web3';
import lottery from '../abis/Lottery.json';
import './App.css';

class App extends Component {
  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData() {
    // Load account
    const accounts = await Web3.eth.getAccounts();

    if (typeof accounts[0] !== 'undefined') {
      const netId = await Web3.eth.net.getId();
      console.log(netId);

      //Make contract creator the organiser
      await lottery.methods.lottery().call();
      //Get list of players in this lottery for this contract
      const players = await lottery.methods.getPlayers().call();
      console.log(players);

      //load balance
      const balance = await Web3.eth.getBalance(accounts[0]);
      console.log(balance);

      //get address of organiser for this lottery
      const organiser = await lottery.methods.getOrganiser().call();
      console.log(organiser);
      this.setState({
        account: accounts[0],
        players: players,
        balance: balance,
        organiser: organiser,
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
      balance: '',
      value: '',
      message: '',
      organiser: '',
    };
  }

  submitLottery = async (event) => {
    //prevent default
    event.preventDefault();

    //get available accounts
    const accounts = await Web3.eth.getAccounts();

    //set message state
    this.setState({
      message: 'Submitting your lottery and awaiting confirmation...',
    });

    //Enter lottery
    await lottery.methods.enter().send({
      from: accounts[0],
      value: Web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({
      message: 'You have been entered into the lottery. Good luck!',
    });
    //Reset state
    this.setState(this.state);
  };

  pickWinner = async () => {
    //get list of accounts in metamask
    const accounts = await Web3.eth.getAccounts();

    this.setState({ message: 'Waiting for winner to be picked...' });

    //pick winner
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: 'Winner has been drawn!' });
  };

  render() {
    return (
      <div className="center-screen">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Lottery Blockchain</h1>
              <h1>
                There are currently {this.state.players.length} players in this
                lottery.
              </h1>
              <h1>Organiser's address: {this.state.organiser}.</h1>
              <h2>
                Size of Lottery:{' '}
                {Web3.utils.fromWei(this.state.balance, 'ether')} ETH
              </h2>
              <form onSubmit={this.submitLottery}>
                <h4>Are you feeling lucky?</h4>
                <label>Amount of ETH to enter:</label>
                <input
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                />
                <button type="submit">ENTER</button>
              </form>
              <h4>Ready to pick a winner?</h4>
              <button onClick={this.pickWinner}>End of lottery!</button>
              <h1>{this.state.message}</h1>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
