# eth-india-hackathon
Please note: This is still work in progress.

Executable Signed Messages refunded by the contract (EIP-1077 implementation)


To bring blockchain closer to consumer apps, by improving the user experience, developers can design the DApp in such a way that end consumer do not need to worry about the private key, gas charges, ether balance etc. Developers can design the application in such a way that user need not to pay gas or can pay the gas charges in any ERC20 tokens. This project shows the implementation of the proposed standard EIP-1077.


User pain points:
- Users don’t want to think about ether
- Users don’t want to think about backing up private keys or seed phrases
- Users want to be able to pay for transactions using what they already have on the system, be apple pay, xbox points or even a credit card
- Users don’t want to sign a new transaction at every move
- Users don’t want to download apps/extensions (at least on the desktop) to connect to their apps

App developer pain points:
- Many apps use their own token and would prefer to use those as the main accounting
- Apps want to be able to have apps in multiple platforms without having to share private keys between devices or have to  spend transaction costs moving funds between them
- Token developers want to be able for their users to be able to move funds and pay fees in the token
- While the system provides fees and incentives for miners, there are no inherent business model for wallet developers (or other apps that initiate many transactions)

Complete discussion is here:
https://eips.ethereum.org/EIPS/eip-1077










Stack too deep issues
- In some of the functions we have 11 input paramters, 3 local variables and 2 mapping access. So any addition of local variable we were running in to this issue. To handle this we introduced a struct and passed the reference to other internal function.

Gas calculation for refund.
- This is a tricky problem, we used gasleft() to find the gas used in the function, but there are some operations like transfer for refund gas and other mathematical operations that are performed after the calculations. This contributes to the gas consumption. 

Signature verification.
- ECRecover returned incorrect address. Debuging in solidity is hard, so we spent most of the time here to identify all the parameters that are causing this issue. 

How to run

Please note that project is still in progress.
1. Go to https://github.com/deepesh-kn/eth-india-hackathon
2. Click on Clone or download
3. Clone with SSH
4. On terminal perform the following 
	 git clone <ssh-git>
	 cd eth-india-hackathon
	 npm i
	 truffle test test/Executor_Archieve.js
	 truffle test test/executor.js

