import { ethers } from 'ethers'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import {contractABI} from '../constants'

export default function Home() {
  const contractAddress = "0xD95ea200FbF977876c3fe00AE72A8dE59f06762F"
  const [currentAccount,setCurrentAccount] = useState("")
  const [name,setName] = useState("")
  const [message,setMessage] = useState("")
  const [messages,setMEssages] = useState([])
  const [loading,setLoading] = useState(false)
  const [balance,setBalance] = useState(0)
  const isWalletConnectetd = async () => {
    try{
      const {ethereum} = window
      const accounts = await ethereum.request({method:'eth_accounts'})
      if(accounts.length > 0){
        const account = accounts[0]
        console.log("wallet is connected ",account)
      }
      else{
        console.log("connect your metamask wallet")
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const connectWallet = async () => {
    try{
      const {ethereum} = window
      if(!ethereum) {
        window.alert("please install metamask")
        console.log("please install metamask")
      }
      const accounts = await ethereum.request({method:"eth_accounts"})
      setCurrentAccount(accounts[0])
    }
    catch(error){
      console.log(error)
    }
  }
  const buyCoffee = async () => {
    try{
      const {ethereum} = window
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum,"any")
        const signer = provider.getSigner()
        const buyMeACoffee = new ethers.Contract(contractAddress,contractABI,signer)
        const txn = await buyMeACoffee.buyCoffee(name ? name : "anonymous",message ? message : "enjoy",{value:ethers.utils.parseEther("0.001")})
        setLoading(true)
        await txn.wait()
        setLoading(false)
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const getBalance = async () => {
    try{
      const {ethereum} = window
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum, "any")
        const balance = await provider.getBalance(contractAddress)
        setBalance(balance);
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const getMessages = async () => {
    try{
      const {ethereum} = window
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const buyMeACoffee = new ethers.Contract(contractAddress,contractABI,signer)
        const messages = await buyMeACoffee.getMessages()
        setMEssages(messages)
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const onNameChange = (event) => {
    setName(event.target.value)
  }
  const onMessageChange = (event) => {
    setMessage(event.target.value)
  }
  useEffect(() => {
    let buyMeACoffee
    isWalletConnectetd()
    getMessages()
    const onNewMessage = () => {
      getMessages()
      getBalance()
    }
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      buyMeACoffee.on("NewMessage", onNewMessage);
    }
    return()=>{
      if(buyMeACoffee) {
        buyMeACoffee.off("NewMessage",onNewMessage)
      }
    }
  },[])
  const renderButton = () => {
    try{
      if(loading){
        return (
          <button> Loading... </button>
        )
      }
      else{
        return (
          <div>
                <button type="button" onClick={buyCoffee}>Send 1 Coffee for 0.001ETH</button>
          </div>
        )
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const withdrawFunds = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);
        await buyMeACoffee.withdawFunds();
        getBalance()
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Sharath a Coffee!</title>
        <meta name="description" content="Buy Me a Coffee website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Buy Sharath a Coffee!
        </h1>
        {currentAccount ? (
          <div>
            <p>Balance : {ethers.utils.formatEther(balance.toString())}</p>
            <p>Withdraw funds to 0xB2F183C5ba82eF8A0B2CbCD1C72029949b5F3304</p>
            <div><button onClick={withdrawFunds}> Withdraw </button></div>
            <br/>
            <form>
              <div className="formgroup">
                <label>
                  Name
                </label>
                <br/>
                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                  />
              </div>
              <br/>
              <div className="formgroup">
                <label>
                  Send Sharath a message
                </label>
                <br/>
                <textarea
                  rows={5}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                >
                </textarea>
              </div>
              {renderButton()}
            </form>
          </div>
        ) : (
          <button onClick={connectWallet}> Connect your wallet </button>
        )}
      </main>

      {currentAccount && (<h1>Messages received</h1>)}

      {currentAccount && (messages.map((message, id) => {
        return (
          <div key={id} style={{border:"1px solid", "borderRadius":"10px", padding: "5px", margin: "5px"}}>
            <p style={{fontWeight:"bold"}}>{message.message}</p>
            <p>From: {message.name} at {message.timestamp.toString()}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/Sharathguvvala"
          target="_blank"
        >
          Created by @Sharathguvvala for Alchemy's Road to Web3 lesson two!
        </a>
      </footer>
    </div>
  )
}
