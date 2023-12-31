class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.newBlock(null);
        this.peers = new Set();
    }

    /**
     * Adds a node to our peer table
     */
    addPeer(host) {
        this.peers.add(host);
    }

    /**
     * Adds a node to our peer table
     */
    getPeers() {
        return Array.from(this.peers);
    }

    /**
     * Creates a new block containing any outstanding transactions
     *
     * @param previousHash: the hash of the previous block (hex string)
     */
    newBlock(previousHash) {
        let block = {
            index: this.chain.length,
            timestamp: new Date().toISOString(),
            transactions: this.pendingTransactions,
            previousHash,
            nonce: null
        };

        block.hash = Blockchain.hash(block);

        console.log(`Created block ${block.index}`);

        // Add the new block to the blockchain
        this.chain.push(block);

        // Reset pending transactions
        this.pendingTransactions = [];
    }

    /**
     * Generates a SHA-256 hash of the block
     */
    static hash(block) {
        const blockString = JSON.stringify(block, Object.keys(block).sort());
        return crypto.createHash("sha256").update(blockString).digest("hex");
    }

    /**
     * Returns the last block in the chain
     */
    lastBlock() {
        return this.chain.length && this.chain[this.chain.length - 1];
    }

    /**
     * Determines if a hash begins with a "difficulty" number of 0s
     *
     * @param hashOfBlock: the hash of the block (hex string)
     * @param difficulty: an integer defining the difficulty
     */
    static powIsAcceptable(hashOfBlock, difficulty) {
        // Create a bitmask with the difficulty number of 0s
        const difficultyBitmask = (1 << difficulty) - 1;

        // Convert the hash to a big integer
        const hashBigInteger = BigInt(hashOfBlock, 16);

        // Return true if the hash is less than the difficulty bitmask
        return hashBigInteger < difficultyBitmask;
    }

    /**
     * Generates a random 32 byte string
     */
    static nonce() {
        return crypto.createHash("sha256").update(crypto.randomBytes(32)).digest("hex");
    }

    /**
     * Proof of Work mining algorithm
     *
     * We hash the block with random string until the hash begins with
     * a "difficulty" number of 0s.
     */
    mine(blockToMine = null, difficulty = 4) {
        const block = blockToMine || this.lastBlock();

        while (true) {
            block.nonce = Blockchain.nonce();
            if (Blockchain.powIsAcceptable(Blockchain.hash(block), difficulty)) {
                console.log("We mined a block!")
                console.log(` - Block hash: ${Blockchain.hash(block)}`);
                console.log(` - nonce:      ${block.nonce}`);
                return block;
            }
        }
    }
}

module.exports = Blockchain;