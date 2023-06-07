// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    'key to account',
    'link to access node goerli'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[1]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['noted'] })
    .send({ gas: '1000000', from: accounts[1] });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};
deploy();