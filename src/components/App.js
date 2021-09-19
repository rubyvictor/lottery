import React, { Component } from 'react';
import Web3 from 'web3';
import lottery from '../abis/Lottery.json';
import './App.css';

class App extends Component {
  async componentDidMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    if (typeof web3 !== 'undefined') {
      //initialise web3
      // const web3 = new Web3(Web3.currentProvider); deprecated
      const web3 = new Web3(Web3.givenProvider);
      // Load account
      const accounts = web3.eth.getAccounts(console.log);

      const netId = await web3.eth.net.getId();
      console.log(netId);

      //Make contract creator the organiser
      if (this.state.lottery !== 'null') {
        try {
          const players = await this.state.lottery.methods.getPlayers().call();
          console.log(players);

          //load balance
          const balance = await web3.eth.getBalance(accounts[0]);
          console.log(balance);

          //get address of organiser for this lottery
          const organiser = await this.state.lottery.methods
            .getOrganiser()
            .call();
          console.log(organiser);
          this.setState({
            account: accounts[0],
            players: players,
            balance: balance,
            organiser: organiser,
          });
        } catch (error) {
          console.log('Error with lottery', error);
        }
      }
    } else {
      const web3 = new Web3(
        new Web3.providers.HttpProvider('https://localhost:7545')
      );
      console.log(web3, 'is not a metamask provider');
      window.alert('Please login with Metamask');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: 'undefined',
      account: '',
      players: [],
      balance: '',
      value: '',
      message: '',
      organiser: '',
      lottery: null,
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
    try {
      await this.state.lottery.methods.enter().send({
        from: accounts[0],
        value: Web3.utils.toWei(this.state.value, 'ether'),
      });
      this.setState({
        message: 'You have been entered into the lottery. Good luck!',
      });
      //Reset state
      this.setState(this.state);
    } catch (error) {
      console.log('Error entering lottery', error);
    }
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
