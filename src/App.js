
import './App.css';
import { AddTicket } from './components/addTicket';
import Tickets from './components/ticketsDisplay';
import { NavigationBar } from './components/navBar';
import { useState, useEffect, useCallback } from "react";



import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import movieticket from "./contracts/MOVIETICKET.abi.json";
import IERC from "./contracts/IERC.abi.json";





const ERC20_DECIMALS = 18;

const contractAddress = "0x8e8DB5ad6696EFE76F747E5e40Fd1aD7A507FD0f";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [tickets, setTickets] = useState([]);
 


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(movieticket, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);


  


  const getTickets = useCallback(async () => {
    const ticketsLength = await contract.methods.getTicketsLength().call();
    const tickets = [];
    for (let index = 0; index < ticketsLength; index++) {
      let _tickets = new Promise(async (resolve, reject) => {
      let ticket = await contract.methods.getMovieticket(index).call();

        resolve({
          index: index,
          Admin: ticket[0],
          name: ticket[1],
          image: ticket[2],
          filmIndustry: ticket[3],
          genre: ticket[4],
          description: ticket[5],
          price: ticket[6], 
          sold: ticket[7],
          ticketsAvailable: ticket[8],
          forSale: ticket[9],   
        });
      });
      tickets.push(_tickets);
    }


    const _tickets = await Promise.all(tickets);
    setTickets(_tickets);
  }, [contract]);


  const addTicket = async (
            _name,
            _image,
            _filmIndustry,
            _genre,
            _description,
            _price,
            _ticketsAvailable,
  ) => {
   


    try {
      let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
      await contract.methods.addMovie(_name, _image, _filmIndustry, _genre, _description, price, _ticketsAvailable)
        .send({ from: address });
      getTickets();
    } catch (error) {
      alert(error);
    }
  };

  const changeForsale = async (
    _index
  ) => {
    try {
      await contract.methods
        .changeForsale(_index)
        .send({ from: address });
      getTickets();
    } catch (error) {
      alert(error);
    }
  };


  


  const addmoreTickets = async (
    _index,
    _tickets
  ) => {
    try {
      await contract.methods
        .addTickets(_index, _tickets)
        .send({ from: address });
      getTickets();
    } catch (error) {
      alert(error);
    }
  };



        const BuyTicket = async (_index) => {
          const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
          try {
            
            await cUSDContract.methods
              .approve(contractAddress, tickets[_index].price)
              .send({ from: address });
            await contract.methods.buyMovieTicket(_index).send({ from: address });
            getTickets();
            getBalance();
            alert("you have successfully purchased a ticket");
          } catch (error) {
            alert(error);
          }};

          


    

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getTickets();
    }
  }, [contract, getTickets]);
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <AddTicket addTicket={addTicket}/>
      <Tickets  
      buyTicket={BuyTicket} 
      walletAddress={address} 
      tickets={tickets} 
      changeForsale={changeForsale}
      addmoreTickets={addmoreTickets}
       />
    </div>
  );
}

export default App;
