var Executor = artifacts.require('./Executor_1.sol');

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
           // web3.eth.sendTransaction({ from: accounts[0], to: executor.address, value: web3.toWei(100, "ether") });
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

            function executeSigned(
                address _to,
                address _from,
                uint256 _value,
                bytes _data,
                uint256 _nonce,
                uint256 _gasPrice,
                uint256 _gasLimit,
                address _gasToken,
                OperationType _operationType,
                bytes _extraHash,
                bytes _messageSignatures)
        });


    });
});

