// function deployContract(){
//     console.log("this is a deploy plugin test")
// }
// module.exports.default = deployContract

const { network } = require("hardhat");
const { deploymentChains, networkConfig, LOCK_TILE,waitBlockNum } = require("../hardhat-config-help");

//以上逻辑简写方式
// module.exports.default = async() =>{
//     console.log("this is a deploy plugin test")
// }
// //拓展传参
// module.exports.default = async(hre) =>{
//     const getNameAccounts = hre.getNameAccounts
//     const deployments = hre.deployments
//     console.log("this is a deploy plugin test")
// }

//拓展传参 简化 deployments和getNamedAccounts为固定预制参数和函数
//module.exports不能加default
module.exports = async ({ account, deployments }) => {
    //方式1
    // const firstAccount = (await getNamedAccounts()).firstAccount
    //方式2
    const { firstAccount } = await getNamedAccounts();
    let dataFeedAddr;
    let waitBlock
    if (deploymentChains.includes(network.name)) {
        const mockDataFeed = await deployments.get("MockV3Aggregator");
        dataFeedAddr = mockDataFeed.address;
        waitBlock = 0
    } else {
        dataFeedAddr = networkConfig[network.config.chainId].ethUsddataFeedAddr;
        waitBlock = waitBlockNum
    }
    const { deploy } = deployments;
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TILE, dataFeedAddr],
        log: true,
        waitConfirmations:waitBlock  //本地网不能设置等待区块
    });
    //验证合约
    
    if (hre.network.config.chainId == 11155111
        && process.env.ETHERSCAN_APIKEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TILE, dataFeedAddr],
        });
    }else{
        console.log("is not sepolia,本网络无法验证合约 return")
    }
    // console.log(`first account is ${firstAccount}`)
    // console.log("this is a deploy plugin test")
};
module.exports.tags = ["all", "fundme"];
