//var EIP20TokenMock = artifacts.require('./EIP20TokenMock.sol');

var secp256k1 = require('secp256k1');
var Executor = artifacts.require('./Executor.sol');
var CryptoJS = require('crypto-js');
var web3Klass = require('web3');
var web3Obj = new web3Klass(new web3Klass.providers.HttpProvider("http://localhost:8545"));
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

        it("Ecrecover", async () => {

            // var functionName = "a";
            // var functionTypes = ["uint256"];
            // var functionParams = [0];
			//
            // var fullName = functionName + '(' + functionTypes.join() + ')';
            // var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
            // var dataHex = signature + web3Obj.eth.abi.encodeParameters(functionTypes, functionParams);
            // data = '0x' + dataHex;
			//
			//
            // nonce = 0;
            
            
            // hashInput = '0x' + executor.address.slice(2) + accounts[1].slice(2) + pad(nonce.toString('16')).slice(2)
            //     + executor.address.slice(2) + data.slice(2);


           // var sig = secp256k1.sign(new Buffer(hashInput.slice(2), 'hex'), new Buffer("0x4b0f950fd529808bb4ef9bb896fff69f8740658f428d30c28387843dbf578462", 'hex'));
			//let sig = web3.eth.sign("1234567",accounts[0]);
            //var sig = secp256k1.sign(dataHex, "0x8fbbbaceff30d4eea3e2ffa2dfedc3c053f78c1f53103e4ddc31309e6b1d5ea0");
			//
            // var ret = {};
            // ret.r = sig.signature.slice(0, 32);
            // ret.s = sig.signature.slice(32, 64);
            // ret.v = sig.recovery + 27;
	
			// let signer = accounts[0]
			// 	, msg = web3Obj.utils.soliditySha3("gulshan")
			// 	, prefix = `\x19Ethereum Signed Message:\n${32}`
			// 	, fixed_msg_sha = web3Obj.utils.soliditySha3(prefix, msg);
			// let signature = await web3Obj.eth.sign("gulshan", signer);
			// signature = signature.slice(2);
			// const r = '0x' + signature.slice(0, 64);
			// const s = '0x' + signature.slice(64, 128);
			// const v = '0x' + signature.slice(128, 130);
			// let v_decimal = web3Obj.utils.toDecimal(v) + 27;
			// console.log(await executor.ecRecover.call(signature,v,r,s));
			// console.log("accounts",accounts[0]);
            //console.log("data: ",data);
	
			var msg = 'gulshan';
	
			var h = web3.sha3(msg)
			var sig = web3.eth.sign(h, accounts[0]).slice(2)
			var r = `0x${sig.slice(0, 64)}`
			var s = `0x${sig.slice(64, 128)}`
			var v = web3.toDecimal(sig.slice(128, 130)) + 27
	
			var result = await executor.ecRecovertest.call(h, v, r, s)
			assert.equal(result, address);

        })
		
		
		it("Ecrecover", async () => {
		
		
		
		})

	})
})

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