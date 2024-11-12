const { task } = require("hardhat/config");

task("deploy-fundme","deploy and verify fundme contract").setAction(async (taskArgs, hre) => {
  //部署合约
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("contract deploying...");
  const fundMe = await fundMeFactory.deploy(500); //500s
  await fundMe.waitForDeployment();
  console.log("contract has been deploy successfully:" + fundMe.target);
  //等待5个区块再验证合约，比较容易成功 等待区块必须在真实的测试网上执行
  //本地测试网无法模拟生成区块
  //通过chainID可以区分本地网络还是真实网路
  //在网址chainlist.org里可以查找各个链chainID
  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_APIKEY) {
    await fundMe.deploymentTransaction().wait(5);
    verifyContract(fundMe.target, [500]);
  } else {
    console.log("verification skipped...");
  }
});

async function verifyContract(contractAddr, args) {
  await hre.run("verify:verify", {
    address: contractAddr,
    constructorArguments: args,
  });
}

module.exports = {};
