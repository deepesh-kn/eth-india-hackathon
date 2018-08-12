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
// var web3 = require('web3');
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

const Web3 = require('web3')
	, web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
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
			//console.log("Status",await executorInstance.addWhiteListWorker.call(accounts[5]));
			//console.log("test",s);
			
		})
		
		it("getData of executeTx", async () => {
			
			//let s = await executorInstance.contract.executeTx.getData();
			//console.log("test",s);
			
		})
		
		
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
			// 	, msg = web3.utils.soliditySha3("gulshan")
			// 	, prefix = `\x19Ethereum Signed Message:\n${32}`
			// 	, fixed_msg_sha = web3.utils.soliditySha3(prefix, msg);
			// let signature = await web3.Eth.sign(msg, signer);
			// signature = signature.slice(2);
			// const r = '0x' + signature.slice(0, 64);
			// const s = '0x' + signature.slice(64, 128);
			// const v = '0x' + signature.slice(128, 130);
			// let v_decimal = web3.utils.toDecimal(v) + 27;
			//
			// console.log(executorInstance.ecRecover(signature,v,r,s));
			// console.log("accounts",accounts[0]);
			// console.log();
			//console.log("data: ",data);
			
			
			// var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C'
			//
			// //var h = web3.sha3(msg)
			// var sig = web3.Eth.sign("gulshan", accounts[0]).slice(2)
			// var r = `0x${sig.slice(0, 64)}`
			// var s = `0x${sig.slice(64, 128)}`
			// var v = web3.toDecimal(sig.slice(128, 130)) + 27
			//
			// var result = await executorInstance.ecRecovertest.call(h, v, r, s)
			// assert.equal(result, address);
			
			
			/*var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C';
			
			var h = web3.utils.sha3(msg);
			var sig = web3.eth.sign(accounts[0], "gulshan").slice(2);
			var r = `0x${sig.slice(0, 64)}`;
			var s = `0x${sig.slice(64, 128)}`;
			var v = web3.toDecimal(sig.slice(128, 130)) + 27;
			*/
			//var result = await executorInstance.testRecovery.call(sig, v, r, s)
			//assert.equal(result, accounts[0])
			
		})
		
		
		it('should verify signer', async function () {
			//console.log(web3);
			// let signer = accounts[0]
			// 	, msg = web3.utils.sha3('0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C')
			// 	, prefix = `\x19Ethereum Signed Message:\n${32}`
			// 	, fixed_msg_sha = web3.utils.soliditySha3(prefix,"0x"+ msg);
			// let signature = await web3.eth.sign(msg, signer);
			// signature = signature.slice(2);
			// const r = '0x' + signature.slice(0, 64);
			// const s = '0x' + signature.slice(64, 128);
			// const v = '0x' + signature.slice(128, 130);
			// let v_decimal = web3.utils.toDecimal(v) + 27;
			// let result = await executorInstance.isSigned(signer, fixed_msg_sha, v_decimal, r, s);
			// /* assert.equal(result.logs[0].args.signer, signer);
			//  assert.equal(result.logs[0].args.status, true);*/
			// utils.logResponse(result, "EC recovery");
			// utils.printGasStatistics();
			// utils.clearReceipts();
			
			
			let signer = accounts[0]
				, msg = web3.utils.soliditySha3("gulshan")
				, prefix = `\x19Ethereum Signed Message:\n${32}`
				, fixed_msg_sha = web3.utils.soliditySha3(prefix, msg);
			console.log("Fixed_msg_sha",fixed_msg_sha);
			let signature = await web3.eth.sign(msg, signer);
			signature = signature.slice(2);
			const r = '0x' + signature.slice(0, 64);
			const s = '0x' + signature.slice(64, 128);
			const v = '0x' + signature.slice(128, 130);
			let v_decimal = web3.utils.toDecimal(v) + 27;
			console.log("v :- ",v);
			console.log("v_decimal",v_decimal);
			console.log("r :- ",r);
			console.log("s :-",s);
			console.log("signature",signature);
			let result = await executorInstance.isSigned(signer,fixed_msg_sha, v_decimal,r,s);
			console.log(JSON.stringify(result));
			console.log(accounts[0]);
		});
		
		
		it('execute transaction', async function () {
		
			
		
		
		
		});
		
		
		
		
		
		
		
	})
})


