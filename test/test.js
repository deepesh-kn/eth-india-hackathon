var Executor = artifacts.require('./Executor.sol');

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

