//var EIP20TokenMock = artifacts.require('./EIP20TokenMock.sol');

contract('EIP20TokenMock', function(accounts) {

    var token;
    var conversionRate = 1;
    var conversionRateDecimals = 1;
	var ost = 'OST';
	describe ('test', async () => {
		before(async () => {
            token = await EIP20TokenMock.new(conversionRate, conversionRateDecimals, ost, 'name', 18);
		});

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