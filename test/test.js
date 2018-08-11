var Executor = artifacts.require('./Executor.sol');

/*
//var EIP20TokenMock = artifacts.require('./EIP20TokenMock.sol');

var secp256k1 = require('secp256k1');


var CryptoJS = require('crypto-js');

var web3Klass = require('web3');
var web3Obj = new web3Klass(new web3.providers.HttpProvider("http://localhost:8545"));
var utils = require('ethereumjs-util');

const leftPad = require('left-pad')


function pad(n) {
    assert.equal(typeof(n), 'string', "Passed in a non string")
    let data
    if (n.startsWith("0x")) {
        data = '0x' + leftPad(n.slice(2), '64', '0')
        assert.equal(data.length, 66, "packed incorrectly")
        return data;
    } else {
        data = '0x' + leftPad(n, '64', '0')
        assert.equal(data.length, 66, "packed incorrectly")
        return data;
    }
}


contract('Executor', function(accounts) {
    var executor;
	describe ('test', async () => {
		before(async () => {
            executor = await Executor.new();
		});

        it("t", async () => {

            var functionName = "a";
            var functionTypes = ["uint256"];
            var functionParams = [0];

            var fullName = functionName + '(' + functionTypes.join() + ')';
            var signature = web3Obj.utils.sha3(fullName).slice(0, 8);
            var dataHex = signature + web3Obj.eth.abi.encodeParameters(functionTypes, functionParams);
            data = '0x' + dataHex;


            nonce = 0;
            hashInput = '0x1900' + 0 + accounts[1].slice(2) + pad(nonce.toString('16')).slice(2)
                + executor.address.slice(2) + data.slice(2);

            console.log("hashInput: ",hashInput);

            var sig = await web3Obj.eth.sign(hashInput, accounts[1]);
            console.log("sig: ",sig);
            //var sig = secp256k1.sign(new Buffer(hashInput.slice(2), 'hex'), new Buffer("8fbbbaceff30d4eea3e2ffa2dfedc3c053f78c1f53103e4ddc31309e6b1d5ea1", 'hex'));

            //var sig = secp256k1.sign(dataHex, "0x8fbbbaceff30d4eea3e2ffa2dfedc3c053f78c1f53103e4ddc31309e6b1d5ea0");

            var ret = {};
            ret.r = sig.slice(0, 32);
            ret.s = sig.slice(32, 64);
            ret.v = sig + 27;


            var pub = utils.ecrecover(new Buffer(dataHex, 'hex'), ret.v, ret.r, ret.s);

            var recoveredAddress = '0x' + utils.pubToAddress(pub).toString('hex')

            console.log('recoveredAddress: ',   recoveredAddress);



            console.log("ret: ",ret);

        })

	})
})



*/


/*

var secp256k1 = require('secp256k1');


exports.ecsign = function (msgHash, privateKey) {
    var sig = secp256k1.sign(msgHash, privateKey);

    var ret = {};
    ret.r = sig.signature.slice(0, 32);
    ret.s = sig.signature.slice(32, 64);
    ret.v = sig.recovery + 27;
    return ret;
};


await txRelay.relayMetaTx(p.v, p.r, p.s, p.dest, p.data, 0, {from: sendingAddr})

async function signPayload(signingAddr, txRelay, whitelistOwner, destinationAddress, functionName,
                           functionTypes, functionParams, lw, keyFromPw)
{
    if (functionTypes.length !== functionParams.length) {
        return //should throw error
    }
    if (typeof(functionName) !== 'string') {
        return //should throw error
    }
    let nonce
    let blockTimeout
    let data
    let hashInput
    let hash
    let sig
    let retVal = {}
    data = enc(functionName, functionTypes, functionParams)

    nonce = await txRelay.getNonce.call(signingAddr)
    //Tight packing, as Solidity sha3 does
    hashInput = '0x1900' + txRelay.address.slice(2) + whitelistOwner.slice(2) + pad(nonce.toString('16')).slice(2)
        + destinationAddress.slice(2) + data.slice(2)
    hash = solsha3(hashInput)
    sig = lightwallet.signing.signMsgHash(lw, keyFromPw, hash, signingAddr)
    retVal.r = '0x'+sig.r.toString('hex')
    retVal.s = '0x'+sig.s.toString('hex')
    retVal.v = sig.v //Q: Why is this not converted to hex?
    retVal.data = data
    retVal.hash = hash
    retVal.nonce = nonce
    retVal.dest = destinationAddress
    return retVal
}


data = enc(functionName, functionTypes, functionParams)

function enc(funName, types, params) {
    return '0x' + lightwallet.txutils._encodeFunctionTxData(funName, types, params)
}



function _encodeFunctionTxData(functionName, types, args) {

    var fullName = functionName + '(' + types.join() + ')';
    var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
    var dataHex = signature + coder.encodeParams(types, args);

    return dataHex;
}
*/



contract('Executor', function(accounts) {
    var executor;
    describe ('test', async () => {

        it("t", async () => {

            executor = await Executor.new();

            var Web3 = require('web3');
            var web3 = new Web3();

            var defaultProvider = new web3.providers.HttpProvider('http://localhost:8545');
            web3.setProvider(defaultProvider);

            var account_address = accounts[1];
            console.log( 'account_address: ', account_address);

            var message = web3.utils.soliditySha3("test").slice(2);


            var functionName = "a";
            var functionTypes = ["uint256"];
            var functionParams = [100];

            var fullName = functionName + '(' + functionTypes.join() + ')';
            var signature = web3.utils.soliditySha3(fullName).slice(0, 8);
            console.log(" web3.eth.abi.encodeParameters(functionTypes, functionParams): ", web3.abi.encodeFunctionSignature());
            var data = signature + web3.eth.abi.encodeParameters(functionTypes, functionParams).slice(2);
            //data = '0x' + dataHex;



            //'0x19', '0x00','0xa5b1299240e26977ebc2a320975669fb86d0989e', '0x79376dc1925ba1e0276473244802287394216a39', 0,'0x6133633165346562666466373836386636363438', '0x'


            console.log(0x19, 0x00, executor.address, accounts[0], 0, executor.address, data);
            h = web3.utils.soliditySha3(0x19, 0x00, executor.address, accounts[0], 0, executor.address, data);
            console.log( 'h: ', h);


           // web3.eth.sign(web3.utils.sha3("test"), '0x2E290A50d3193753F156e5b0b12e4231Bd568526', function (err, result) { console.log(err, result); });



            var signature = await web3.eth.sign(data, account_address);
            console.log( 'signature: ', signature);

            signature = signature.split('x')[1];

            var r = signature.substring(0, 64)
            var s = signature.substring(64, 128)
            var v = parseInt(signature.substring(128, 130)) + 27;

            console.log("v", v);
            console.log("r", r);
            console.log("s", s);
            console.log("executor.address", executor.address);
            console.log("data", data);

            result = await executor.getHash.call(v, r, s, executor.address, data);
            console.log("result: ",result);


// console.log('r s v: ', r, s , v)
            /*
            // console.log('v: ', v)

                        var messageBuffer = Buffer.from(message, 'hex');
                        console.log( 'messageBuffer: ', messageBuffer);
                        var pub = utils.ecrecover(messageBuffer, v, r, s);
                        console.log("pub:",pub);

                        var recoveredAddress = '0x' + utils.pubToAddress(pub).toString('hex')

                        console.log('recoveredAddress: ',   recoveredAddress);

                        console.log( 'isMatch: ', recoveredAddress === account_address );

            */

        })
    });
});

