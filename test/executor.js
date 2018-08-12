var Executor = artifacts.require('./Executor.sol');

// Please note this is not actual test cases.

contract('Executor', function(accounts) {
    var executor;
    var ownerAddress = accounts[0];
    var ethLessAddress = accounts[1];
    var workerAddress = accounts[3];
    var fundedNonWhitelistedAddress = accounts[4];
    describe ('test', async () => {
        it("deployment", async () => {
            executor = await Executor.new({from: ownerAddress});
            console.log("executor.address: ", executor.address);
            console.log("Before: balance of contract: " + executor.address, web3.eth.getBalance(executor.address).toString(10));
            console.log("Before: balance of owner: " + ownerAddress, web3.eth.getBalance(ownerAddress).toString(10));
            await executor.fund({value:web3.toWei(100, "ether"), from: accounts[0]});
            console.log("After: balance of contract: " + executor.address, web3.eth.getBalance(executor.address).toString(10));
            console.log("AFter: balance of owner: " + ownerAddress, web3.eth.getBalance(ownerAddress).toString(10));
        });

        it("white list addressess", async () => {
            console.log("Before: balance of workerAddress: " + workerAddress, web3.eth.getBalance(workerAddress).toString(10));
            await executor.addWhiteListAddress(workerAddress);
            console.log("after: balance of workerAddress: " + workerAddress, web3.eth.getBalance(workerAddress).toString(10));
            let result = await executor.isWhitelisted.call(workerAddress);
            console.log("result1: ",result);
            result1 = await executor.isWhitelisted.call(accounts[4]);
            console.log("result2: ",result1);
        });

        it("executeSigned", async () => {

            let gas = await executor.getGasUsage.call(0, 1);
            console.log("gas: ",gas.toString(10));
            let to = executor.address;
            let from = ethLessAddress;
            let value = 0;
            let data = await executor.contract.addWhiteListAddress.getData(accounts[3]);
            let nonce = await executor.getNonce.call(ethLessAddress);
            let gasPrice = await web3.eth.gasPrice;
            let gasLimit = 50000;
            let gasToken = 0;
            let operationType = 0;
            let extraHash = "";
            let messageSignatures = "";

            //console.log("Params: ", to, from, value, data, nonce.toString(10), gasPrice.toString(10), gasLimit.toString(10), gasToken, operationType, extraHash, messageSignatures);
            let beforeBalance = web3.eth.getBalance(workerAddress).toString(10);
            console.log("Before: balance of workerAddress: " + workerAddress, beforeBalance);
            let result = await executor.executeSigned(to, from, value, data, nonce, gasPrice, gasLimit, gasToken, operationType, extraHash, messageSignatures, {from:workerAddress});
            let afterBalance = web3.eth.getBalance(workerAddress).toString(10);
            console.log("After: balance of workerAddress: " + workerAddress, afterBalance);
            console.log("diff: ", afterBalance-beforeBalance);
            console.log("result: ",result);
            //console.log("amount: ",result.logs[0].args.location.toString(10));

        });


    });
});

