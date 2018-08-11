// let Web3 =  require("web3");
// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// // const abi="";
// // var contractInstance = new web3.eth.Contract(abi, "MAIN_CONTRACT_ID");
//
// let executorInstance = artifacts.require('./../contracts/Executor');
//
// //console.log(executorInstance);
// let	accounts = async() => await web3.eth.getAccounts();
// 	//(function(err,res) {
// 	// 	accounts = res;
// 	// });
// console.log("something something",executorInstance);
// let addWhiteListWorker = function(address){
//
// 	executorInstance.addWhiteListWorker(address);
//
// };
//
// let callMethod = function(v, r, s, destination, data, worker){
//
// 	executorInstance.sendTransaction(v, r , s, destination, data, worker,{});
//
// }
//
// console.log();
// console.log("Gulshan");
// //addWhiteListWorker(accounts[0]);



var	executor = artifacts.require('./../Executor.sol');
///
/// Test stories
///
/// fails to set worker if worker address is 0
/// fails to set worker if _deactivationHeight is equal to current block number
/// fails to set worker if _deactivationHeight is less than current block number
/// fails to set worker if sender is not opsAddress
/// pass to set worker if worker is not already set
/// pass to set worker if worker was already set
/// pass to set worker at higher deactivation height if worker was already set to a lower deactivation height
/// pass to set worker at lower deactivation height if worker was already set to a higher deactivation height
/// validate expiry


contract('Executor', (accounts) => {
	
	
	async function createExecutor() {
		return await executor.new({ from: accounts[0], gas: 3500000 })
	}
	
	describe('Basic properties', async () => {
		
		var executorInstance = null
		
		before(async () => {
			executorInstance = await createExecutor();
		})
		
	})
	
	describe('Finalize', async () => {
		
		var executorInstance = null
		
		before(async () => {
			executorInstance = await createExecutor();
			
		})
		
		
		it("getData of whitelist", async () => {
			let s = await executorInstance.contract.addWhiteListWorker.getData(accounts[3]);
			console.log("test",s);
			
		})
		
		it("getData of executeTx", async () => {
			let s = await executorInstance.contract.executeTx.getData();
			console.log("test",s);
			
		})
		
		
	})
})


