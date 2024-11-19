const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect }  = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {deploymentChains} =require("../../hardhat-config-help")

deploymentChains.includes(network.name)?describe.skip
:describe("test fundme contract",async function(){
let firstAccount
let fundMe
    //与文件01-deploy-fundme.js 联动，，所以测试逻辑之前复用部署合约的逻辑
    beforeEach(async function () {
        //部署合约 0:35:23
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        //deployments 跟踪所有已部署的合约（能获取到合约地址）
        const fundmeDeployment = await deployments.get("FundMe")
        //根据合约地址获取合约对象
        fundMe = await ethers.getContractAt("FundMe",fundmeDeployment.address)
    
    })
  
   //由于getFund 和 reFund函数 在本地环境和测试环境上调用存在差异
   //故需要通过集成测试模拟真实网络 模拟真实等待时间

    // 测试getFund函数
    //OnlyOwner windowClosed target reached
    it("fund and getFund successfully",async function(){
        await fundMe.fund({value:ethers.parseEther("0.5")})  //3000 * 0.5 =1500
        await new Promise(resolve=>setTimeout(resolve,181*1000))
        const getFundTx= await fundMe.getFund()
        const getFundReceipt =await getFundTx.wait()
        expect(getFundReceipt)
        .to.emit(fundMe,"getFundEvent")
        .withArgs(ethers.parseEther("0.5"))
    })
  //测试refund函数
  //调用通过条件  windowClosed, target not reached
  it("fund and reFund successfull",async function(){
    await fundMe.fund({value:ethers.parseEther("0.1")})  //3000 * 0.1 =300
    await new Promise(resolve=>setTimeout(resolve,181*1000))
        const reFundTx= await fundMe.reFund()
        const reFundReceipt = await reFundTx.wait()
        expect(reFundReceipt)
        .to.emit(fundMe,"reFundEvent")
        .withArgs(firstAccount,ethers.parseEther("0.1"))
  })
    
})