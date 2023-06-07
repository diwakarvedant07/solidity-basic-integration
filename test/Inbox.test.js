// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
// compile.js creates two file ABI js interface and byte code
//we will import both of these properties into file 
const { interface, bytecode } = require('../compile');
/*

sample testing code 

class Car{
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car; // now this variable has a bigger scope and can be
//accessed inside decribe and it.

beforeEach(() => {
    car = new Car();
});

describe('Car', () => {
    it('testing park function', () => {
        //test setup and assertion logic
        assert.equal(car.park(), 'stopped');
    });
    it('testing drive function', () => {
        //test setup and assertion logic
        assert.equal(car.drive(), 'vroom');
    });
});

*/
let accounts;
let inbox;

beforeEach(async () => {
    //get a list of all accounts
    /*  testing how promises work
    web3.eth.getAccounts().then(fetchedAccounts => {
        console.log(fetchedAccounts);
        });
    */

    accounts = await web3.eth.getAccounts();
    // await can only be used before a asynchronous function.
    //use one of those accounts to deploy 
    // the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['lesgo'] })
        .send({ from: accounts[1], gas: '1000000' })
});

describe('Inbox testing', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
        // 'ok' makes sure that the value exists
        // if not the test will fail
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'lesgo');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[1] })
        // no need to check if this works or not by storing the
        //ouput data in a variable and checking it
        // this line will throw an error and test will fail.
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');


    });
});