import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Meme from '../abis/Meme.json'

const ipfsClient = require('ipfs-http-client')
// connect to ipfs daemon API server
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001,  protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       buffer: null,
       memeHash: '',
       account: '',
       contract: null
    }

    this.handleCaptureFile = this.handleCaptureFile.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockcahinData()
    await this.loadMemeHash()
  }
  
  
  async loadBlockcahinData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]

    if(networkData){
      //fetch contract
      const contract = await new web3.eth.Contract(Meme.abi,networkData.address)
      this.setState({contract})
    }else{
      window.alert('Smart contract not deployed to detected network')
    }
  }

  async loadMemeHash() {
    const {contract} = this.state
    if(contract){
      const memeHash = await contract.methods.get().call()
      this.setState({memeHash})
    }

  }


  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use metamask')
    }
  }

  handleCaptureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)  
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
    }

  }

  handleOnSubmit = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, async (error, result) => {
      if(error){
        console.log(error)
        return
      } 
      const memeHash = result[0].hash
  
      const { contract } = this.state
      // TODO store file on the blockchain
      if(contract){
        await contract.methods.set(memeHash).send({
          from: this.state.account
        }).then((r) => {
          console.log("Result: ", r)
        })
      }
    })
  }
  

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meme of the day
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-smnone d-sm-block"> 
               <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.state.memeHash && <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} className="App-logo" alt="logo" /> }
                </a>
                <p>&nbsp;</p>
                <h2>Change Meme</h2>
                <form onSubmit={this.handleOnSubmit}>
                  <input type="file" onChange={this.handleCaptureFile}/>
                  <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
