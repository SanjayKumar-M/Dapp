import React, { useContext } from "react";


import Button from 'react-bootstrap/Button';

import '../style/header.css'

import 'bootstrap/dist/css/bootstrap.min.css'

import Footer from "./Footer";

import Services from "./Services"

import { NextPage } from "next";
import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const Header = () => {

    const [account, setAccount] = useState("");
    const [connection, setConnection] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
  
    async function getWeb3Modal() {
      let Torus = (await import("@toruslabs/torus-embed")).default;
      const web3modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: false,
        providerOptions: {
          torus: {
            package: Torus,
          },
        },
      });
      return web3modal;
    }
  
    async function connect() {
      const web3modal = await getWeb3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setConnection(connection);
      setAccount(accounts[0]);
    }
  
    async function Login() {
      const authData = await fetch(`/api/authenticate?address=${account}`);
      const user = await authData.json();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(user.nonce.toString());
      const response = await fetch(
        `/api/verify?address=${account}&signature=${signature}`
      );
      const data = await response.json();
      setLoggedIn(data.authenticated);
    }


    
   

    return (

        <><div className="header">

            <nav>
                <div class="logo">
                    <a href="/">
                        <img src="https://raw.githubusercontent.com/SanjayKumar-M/Web-Ui/main/QUASAR-removebg-preview.png" alt=""></img>
                    </a>
                </div>
                <ul>
                    <li><a href="">Payment</a></li>
                    <li><a href="/">Storage</a></li>
                    <li><a href="/">About</a></li>
                    {!connection && (
                    <Button variant="outline-primary" onClick={connect}> Log In</Button>
                    )}

                    {connection && !loggedIn && (
        
                     <button className={styles.button} onClick={Login}>
                            Login
                    </button>
        
                    )}
                    {loggedIn && <h2>Let's get started, {account}</h2>}
                    

                </ul>

            </nav>

            <div className="content">

                <h1>The Next Generation <br/> Decentralized payments </h1>
                <p>Pay your tution fee from anywhere at anytime</p>

                
            </div>

            <Services/>

            <Footer/>
            

        </div>
        

        
      </>
    )
}

export default Header;