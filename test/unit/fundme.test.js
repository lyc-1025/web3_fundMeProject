const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect }  = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {deploymentChains} =require("../../hardhat-config-help")

!deploymentChains.includes(network.name)?describe.skip
:describe("test fundme contract",async function(){
let firstAccount
let secondAccount
let secondAccountConnetFundme
let fundMe
let mockV3Aggregator
    //与文件01-deploy-fundme.js 联动，，所以测试逻辑之前复用部署合约的逻辑
    beforeEach(async function () {
        //部署合约 0:35:23
        await deployments.fixture(["all"])
    
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        //deployments 跟踪所有已部署的合约（能获取到合约地址）
        const fundmeDeployment = await deployments.get("FundMe")
        //根据合约地址获取合约对象
        fundMe = await ethers.getContractAt("FundMe",fundmeDeployment.address)
        
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
       
        secondAccountConnetFundme = await ethers.getContract("FundMe",secondAccount)
    })
//1.24.51
    it("test if the owner is msg.sender",async function () {
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory('FundMe')
        // const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()),firstAccount)
    })

    it("test if the dataFeed is right",async function () {
        // const fundMeFactory = await ethers.getContractFactory('FundMe')
        // const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()),mockV3Aggregator.address)
    })

    //fund ,getFund,refund
    // fund 条件一：在窗口期内  条件2:value > minimum value 条件3: 是否存进余额变量
    it("window is close, value grater than minimum value,deployment failed"
        ,async function () {
        //设置条件1不符合
        //模拟时间流逝 fundme 合约 设置时间窗口为180s  
        await helpers.time.increase(200)
        //模拟挖矿 
        await helpers.mine()
        //设置条件2符合
        expect(fundMe.fund({value:ethers.parseEther("0.1")}))
        .to.be.revertedWith("window is closed")
        //1:24:51
    })
 
    it("window is open,value is less than minimum value,deployment failed",async function () {
        expect(fundMe.fund({value:ethers.parseEther("0.01")}))
        .to.be.revertedWith("send more ETH")
    })

    it("window is open,value is grater than minimum value,deployment success",async function () {
       await fundMe.fund({value:ethers.parseEther("0.1")})
        const balance = await fundMe.fundesToAmount(firstAccount)
        expect(balance).to.equal(ethers.parseEther("0.1"))
    })

    //getFund 单元测试  
    //三个条件  onlyOwner ,windowClose, target reached
    //onlyOwner
    it("not owner,windowClose ,target reached",async function(){
        //使达到目标金额
        fundMe.fund({value:ethers.parseEther("1")})
        //模拟时间流逝，达到窗口期关闭
        await helpers.time.increase(200)
        await helpers.mine()
       //使用其他账户链接fundme  ，使其not owner
       expect(secondAccountConnetFundme.getFund())
       .to.be.revertedWith("not owner")
    })
    //windowClose
    it("isOwner,windowOpen,target reached",async function(){
        //使达到目标金额
       await fundMe.fund({value:ethers.parseEther("1")})
        expect(fundMe.getFund())
        .to.be.revertedWith("window is not closed")
    })
    //target reached
    it("onlyOwner,windowClose,target  not reached",async function(){
        //使未达到目标金额
        await fundMe.fund({value:ethers.parseEther("0.1")})
        await helpers.time.increase(200)
        await helpers.mine()
        expect(fundMe.getFund())
        .to.be.revertedWith("balance not enough")
    })
   //所有条件都满足，成功执行  使用event实现  是否成判断
   it("is owner,window closed,target reached",async function(){
         await fundMe.fund({value:ethers.parseEther("1")})
         await helpers.time.increase(200)
         await helpers.mine()
         expect(fundMe.getFund())
         .to.emit(fundMe,"getFundEvent")
         .withArgs(ethers.parseEther("1"))  
   })

   //单元测试reFund()
    //条件1 window close, 2 target not reached 3 funder has balance

    //window is not closed
    it("window open,target reached,funder has balance",async function(){
        await fundMe.fund({value:ethers.parseEther("1")})
        await expect(fundMe.reFund())
        .to.be.revertedWith("window is not closed")
    })
    //Target is reached
    it("window is closed, target reached, funder has balance",
        async function(){
            await fundMe.fund({value:ethers.parseEther("1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.reFund())
            .to.be.revertedWith("Target is reached")
        }
    )
//funder does not has balance 使用第二个地址模拟不是当前账户
    it("window is closed,target not reached, funder does not has balance",
        async function(){
            await fundMe.fund({value:ethers.parseEther("0.1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(secondAccountConnetFundme.reFund())
            .to.be.revertedWith("there is no fund for you") 
        }
    )
    //所有条件都满足 成功测试
    it("window is closed,target not reached, funder has balance",
        async function(){
            await fundMe.fund({value:ethers.parseEther("0.1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.reFund()).
            to.emit(fundMe,"reFundEvent")
             .withArgs(firstAccount,ethers.parseEther("0.1"))
        }
    )

})