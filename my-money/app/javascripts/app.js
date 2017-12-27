// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { kjua } from 'kjua';
import { default as contract } from 'truffle-contract'
import { Credentials, SimpleSigner, Contract  } from 'uport'
import { Connect, SimpleSigner } from 'uport-connect'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import abi from '../../Metacoinabi.json'


import { Connect, SimpleSigner } from 'uport-connect'



    const uport = new Connect('myMoney', {
      clientId: '2oqpf3QTGG1hcqJ1hj2qXZKHkf5B2LNiUBj',
      network: 'rinkeby',
      signer: SimpleSigner('bee207f81e0faa1d9c31cff8cc8bad62163130b4b325254d58ba7b5f299297fe')
    });

    //let web3 = uport.getWeb3();
    console.log('web3.currentProvider')
    console.log(web3.currentProvider)

// function MyContractSetup () {
//   let MyContractABI = web3.eth.contract(abi)
//   let MyContractObj = MyContractABI.at(0xb349a2e7ae2eb6ea46cec5aac5df2359c9d59125)
//   return MyContractObj
// }

// const MyContract = MyContractSetup();


// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;



window.App = {
  start: function() {
    var self = this;
    //--------------------------------------------------------
 
  uport.requestCredentials({
    requested: ['name', 'phone', 'country'],
    notifications: true // We want this if we want to recieve credentials
  })
  .then((credentials) => {
  // Do something
    console.log("Credenials:", credentials);
    // globalState.uportId = credentials.address;
    // globalState.uportName = credentials.name;
    // globalState.uportCountry = credentials.country;
    // globalState.uportPhone = credentials.phone;
    //render();
    }, (err) => {
        console.log("Error:", err);
    })


    // var amount = parseInt(document.getElementById("amount").value);
    // var receiver = '0x'+document.getElementById("receiver").value;
    // receiver=parseInt(receiver);
    // receiver=receiver.toString(16);
    // console.log(receiver);



// uport.attestCredentials({
//   sub: '0x2onQuuETAjua1XR63tLJQY3BHV7UqB1YMEs', // uport address of user
//   claims: {name:'Vishal Verma'}
// }).then(attestation => {
//   console.log('Attestation.............');
//   console.log(attestation);
// }, (err) => {
//         console.log("Error:", err);
//     })

   // uport.attestCredentials({
   //    sub: '0x2onQuuETAjua1XR63tLJQY3BHV7UqB1YMEs',
   //    claim: {
   //      'phone': '+918142924809'
   //    },
   //    exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
   //  })


//--------------------------------------------------------

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
    console.log('web3.currentProvider');
    console.log(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      // console.log("Current account is: ........................"+accs)
      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;
    console.log(receiver);

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });

//         MyContract.sendCoin('0xB6dA1524241B5f05E192E5315A9f15e7eD587530', amount, function(error, txHash) {
//   if (error) { 
//     self.setStatus("Error sending coin; see log.");
//     throw error 
//   }
//     waitForMined(txHash, { blockNumber: null }, // see next area
//     function pendingCB () {
//       //   self.setStatus("Waiting for mining");
//       // for a block confirmation
//     },
//     function successCB (data) {
//       self.setStatus("Transaction complete!");
//       self.refreshBalance();
//       // Great Success!
//       // Likely you'll call some eventPublisherMethod(txHash, data)
//     }
//   )
// })

  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/wm2m24dkpMCrDfrYqDns"));
  }

  App.start();
});
