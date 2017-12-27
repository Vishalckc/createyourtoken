// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");
var mnemonic = "curtain soccer jungle tag crime smoke select slender critic reject hollow energy";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");
var provider_url = "https://rinkeby.infura.io/wm2m24dkpMCrDfrYqDns";
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
var engine = new ProviderEngine();
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new FiltersSubprovider());
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(provider_url)));
engine.addProvider(new FilterSubprovider());
engine.on('error', function(err) {
    // report connectivity errors
    console.error(err.stack)
});
engine.start();

module.exports = {  
  networks: {
    test: {
        host: "localhost",
        port: 8545,
        //provider: engine,
        //network_id: 15,
        gas:4712388
        //from: address
    },
    development: {
        host: "localhost",
        port: 8545,
        //provider: engine,
        network_id: 15,
        gas:4712388
        //from: address
    },
    rinkeby: {
      host: "https://rinkeby.infura.io/wm2m24dkpMCrDfrYqDns",
      network_id: 4,    // Official kovan network id
      provider: engine, // Use our custom provider
      from: address,     // Use the address we derived
      gas: 3000000
    }
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};

    // test: {
    //     host: "192.168.0.36",
    //     port: 8545,
    //     //provider: engine,
    //     network_id: 2017,
    //     gas:4712300,
    //     //from: address
    // },