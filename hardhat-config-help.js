const DECIMAL = 8
const INITIAL_ANSWER = 300000000000
const deploymentChains =["hardhat","loack"]
const waitBlockNum = 5
const networkConfig={
    //sepolia  
    11155111:{
        ethUsddataFeedAddr:"0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    //BNB test chain
    97:{
        ethUsddataFeedAddr:"0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"
    }
}
const LOCK_TILE = 180
module.exports ={
    DECIMAL,
    INITIAL_ANSWER,
    deploymentChains,
    networkConfig,
    LOCK_TILE,
    waitBlockNum
}