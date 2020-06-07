import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Identicon from 'react-identicons';
import Dp from './dp.png'
//import Navbar from './Navbar'
import Main from './main'
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    }
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non Ethereum Browser detected.')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    //console.log(networkID)
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, "0x23756A80D742B437b835394c9368a43f621B492F")
      console.log('contract deployed')
      this.setState({ socialNetwork})
      console.log(socialNetwork)
      const postCount = await socialNetwork.methods.postCount().call()
      console.log(postCount)
      this.setState({ postCount })
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({
        loading:false
      })
      console.log({
        post: this.state.posts
      })
    }
    else {
      window.alert('Contract not deployed here')
    }
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({from: this.state.account}).then(function(){this.setState({ loading: false })})
    
  }

  tipPost(id, tipAmount) {
    this.setState({
      loading: true
    })
    this.state.socialNetwork.methods.tipPost(id).send({from: this.state.account, value: tipAmount}).
    once('receipt', (receipt) => {
      this.setState({
        loading: false
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
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
            DarkBook by Aeonix
          </a>
        </nav>
        {this.state.loading?<div id="loader" className="text mt-5"><p><h1>Loading...</h1></p></div>:
        <Main createPost={this.createPost} posts={this.state.posts} tipPost={this.tipPost}/>}
      </div>
    );
  }
}

export default App;
