import React, { Component } from 'react';
import './App.css';

const ipfsClient = require('ipfs-http-client')
// connect to ipfs daemon API server
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001,  protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       buffer: null,
       memeHash: 'QmWiqGAQJffEFNwzMTD1qVaFyfAJaNPiew4dBqoESZMgrf'
    }

    this.handleCaptureFile = this.handleCaptureFile.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleCaptureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)  
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
      //console.log('buffer', Buffer(reader.result))
    }

  }

  handleOnSubmit = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      if(error){
        console.log(error)
        return
      } 
      const memeHash = result[0].hash
      this.setState({memeHash})
      // TODO store file on the blockchain
      
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
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} className="App-logo" alt="logo" />
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
