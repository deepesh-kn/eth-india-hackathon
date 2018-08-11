pragma solidity 0.4.24;

contract Executor {

    mapping(address => uint) nonce;

    mapping(address => bool) public whitelistedWorkers;

    function executeTx(
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address destination,
        bytes data,
        address worker
    ) public {

        require(worker != address(0));
        require(isWhitelisted(worker));


        address claimedSender = getAddress(data);
        // use EIP 191
        // 0x19 :: version :: relay :: whitelistOwner :: nonce :: destination :: data
        bytes32 h = keccak256(byte(0x19), byte(0), this, worker, nonce[claimedSender], destination, data);
        address addressFromSig = ecrecover(h, sigV, sigR, sigS);

        require(claimedSender == addressFromSig);

        nonce[claimedSender]++; //if we are going to do tx, update nonce

        require(destination.call(data));
    }

    function whiteListWorker(address worker) public returns (bool){
        whitelistedWorkers[worker] = true;
        return true;
    }

    function getAddress(bytes b) public constant returns (address a) {
        if (b.length < 36) return address(0);
        assembly {
            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            a := and(mask, mload(add(b, 36)))
        // 36 is the offset of the first parameter of the data, if encoded properly.
        // 32 bytes for the length of the bytes array, and 4 bytes for the function signature.
        }
    }

    /*
     * @dev Returns the local nonce of an account.
     * @param add The address to return the nonce for.
     * @return The specific-to-this-contract nonce of the address provided
     */
    function getNonce(address add) public constant returns (uint) {
        return nonce[add];
    }

    function isWhitelisted(address worker) public returns (bool) {
        return whitelistedWorkers[worker];
    }

}
