const { getNamedAccounts, network } = require("hardhat");
const { DECIMAL, INITIAL_ANSWER,deploymentChains } = require("../hardhat-config-help");
module.exports = async ({ account, deployments }) => {
    if(deploymentChains.includes(network.name)){
        const { firstAccount } = await getNamedAccounts();
        const { deploy } = deployments;
      
        await deploy("MockV3Aggregator", {
          from: firstAccount,
          args: [DECIMAL, INITIAL_ANSWER],
          log: true,
        });
    }else{
        console.log("environment is not hardhat or local networt,mock contract deployment is skipped")
    }

  
};

module.exports.tags = ["all", "mock"];
