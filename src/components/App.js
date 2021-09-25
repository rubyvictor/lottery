import React, { Component } from 'react';
import Web3 from 'web3';
import lottery from '../abis/Lottery.json';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      contract: null,
      accounts: null,
      players: [],
      balance: '',
      lotteryValue: 0,
      message: '',
      organiser: null,
      lottery: null,
    };
  }

  async componentDidMount() {
    try {
      this.loadWeb3();

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts();
      const netId = await web3.eth.net.getId();
      const network = lottery.networks[netId];
      const contract = new web3.eth.Contract(lottery.abi, network.address);

      const players = await contract.methods.getPlayers().call();

      const thisLottery = await contract.methods.lottery().call();

      const balance = await web3.eth.getBalance(accounts[0]);

      //set contract creator address to organiser
      await contract.methods.lottery();
      

      this.setState({
        web3: web3,
        contract: contract,
        accounts: accounts,
        players: players,
        balance: balance,
        organiser: accounts,
        lottery: thisLottery,
      });
      console.log(this.state);
      console.log("account[o] address is:",this.state.balance);
    } catch (error) {
      window.alert('Failed to load web3, accounts or contract.');
      console.log('Component did not load:', error);
    }
  }

  async loadWeb3() {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        //initialise web3
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
        } catch (err) {
          console.log('Could not enable window ethereum', err);
        }
        console.log('Ethereum enabled with web3:', web3);
      } else if (window.web3) {
        // User metamask provider
        const web3 = window.web3;
        console.log('Injected web3 detected:', web3);
      } else {
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:7545'
        );
        const web3 = new Web3(provider);
        console.log(web3, 'is not a metamask provider');
        window.alert('Please login with Metamask');
      }
    });
  }

  submitLottery = async (event) => {
    //prevent default
    event.preventDefault();
    event.persist();

    const { accounts, contract} = this.state;
    //Enter lottery
    try {
      //set message state
      this.setState({
        message: 'Submitting your lottery and awaiting confirmation...',
      });
      await contract.methods.enter().send({
        from: accounts[0],
        value: Web3.utils.toWei('20', 'finney')
      });

      // const response = await contract.methods.getValue().call()
      //figure out why build json not updated with this new function

      this.setState({
        message: 'You have been entered into the lottery. Good luck!'
      });
      this.setState(this.state);
    } catch (error) {
      console.log('Error entering lottery', error);
    }
  };

  pickWinner = async () => {
    const { accounts, contract } = this.state;
  
    this.setState({ message: 'Waiting for winner to be picked...' });

    try {
      //pick winner
      await contract.methods.pickWinner().send({
        from: accounts[0],
        value: Web3.utils.toWei('20', 'finney'),
        gas: 50000
      });
      this.setState({ message: 'Winner has been drawn!' });
    } catch (error) {
      console.log('Error on picking winner:', error);
    }
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
                Your Balance:{' '}
                {Web3.utils.fromWei(this.state.balance)} ETH
              </h2>
              <h2>
                Lottery value:{' '}
                {this.state.lotteryValue} ETH
              </h2>
              <form onSubmit={this.submitLottery}>
                <h4>Are you feeling lucky?</h4>
                <label>Amount of ETH to enter:</label>
                <input
                  value={this.state.lotteryValue}
                  onChange={(event) =>
                    this.setState({ lotteryValue: event.target.value })
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
