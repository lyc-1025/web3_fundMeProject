const {task} =require('hardhat/config');

task("interact-fundme","interact with fundme contract")
.addParam("addr","fundme contract address")
.setAction(async (taskArgs,hre)=>{
  const fundMeFactory = await ethers.getContractFactory('FundMe');
  const fundMe = fundMeFactory.attach(taskArgs.addr)
  
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
});

module.exports ={}