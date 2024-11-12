const { ethers } = require("hardhat");

async function main() {
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
  if (hre.network.config.chainId == 11155111 
    && process.env.ETHERSCAN_APIKEY) {
    await fundMe.deploymentTransaction().wait(5);
    verifyContract(fundMe.target, [500]);
  }else{
    console.log("verification skipped...");
  }

//调用合约
  //使用两个账号1，2
  const [firstAccount,secondAccount] = await ethers.getSigners()
  //账号1 调用fund函数存eth进去
  const fundTX = await fundMe.fund({value:ethers.parseEther("0.005")})
  await fundTX.wait()
  //查看众筹合约余额
  const banlanceOfContract = await ethers.provider.getBalance(fundMe.target)
  console.log(`Banlance of fundMe is ${banlanceOfContract}`)
  //账号2 调用fund函数存eth进去
  const fundTXwithSecondAccount = 
  await fundMe.connect(secondAccount)
  .fund({value:ethers.parseEther("0.005")})
  await fundTXwithSecondAccount.wait()
  //查看众筹合约余额
  const banlanceAfterSecondeAccount = await ethers.provider.getBalance(fundMe.target)
  console.log(`Banlance of fundMe is ${banlanceAfterSecondeAccount}`)
  //查看mapping变量
  const firstAccountBalanceOfFundme = await fundMe.fundesToAmount(firstAccount.address)
  const secondAccountBalanceOfFundme = await fundMe.fundesToAmount(secondAccount.address)
  console.log(`Banlance of firstAccount is ${firstAccountBalanceOfFundme}`)
  console.log(`Banlance of secondAccount is ${secondAccountBalanceOfFundme}`)

}

async function verifyContract(contractAddr, args) {
  await hre.run("verify:verify", {
    address: contractAddr,
    constructorArguments: args,
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
