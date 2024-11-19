# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.


pwd  :print work directory

Try running some of the following tasks:


```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
git init
git status
git add .
git commit -m '提交信息'




npx install @chainlink/contracts --save-dev
npx compile

npx hardhat run scripts/deployFundMe.js --network sepolia

npm install --save-dev dotenv

npm install --save-dev @chainlink/env-enc

npx env-enc set-pw
npx env-enc set 



上传GitHub  

https://www.bilibili.com/video/BV1RFsfe5Ek5/?spm_id_from=333.788.videopod.episodes&vd_source=57542c9de3d2d63bcaa34d762a4872ae&p=4  2:52:00


git remote add origin https://github.com/lyc-1025/web3_fundMeProject.git

git remote -v 
git status
git add .
git status
git commit -m '描述'
git push

第一次需要生成令牌当作密码   https://github.com/settings/tokens



hardhat-deploy 插件 ，用于测试时复用部署合约逻辑  在hardhat官网能找到

npm install -D hardhat-deploy  /////-D  等价于 --save-dev
And add the following statement to your hardhat.config.js:
require('hardhat-deploy');

npx hardhat help  查看是否添加成功

npx hardhat deploy

npx hardhat text


reusing "FundMe" at 0x04062416915DdC680A9C5C7503a98D9f3323aE39   
为了避免使用之前部署过的合约地址，，有两种方法处理
1：删除deployment/swpolia文件夹
2：部署命令后面加上--reset  如：npx hardhat deploy --network sepolia --reset  


//工具   查看测试的时候gas消耗明细
//npm install --save-dev hardhat-gas-reporter
//npx hardhat test 可显示
//工具 查看已有的  单元  测试覆盖了多少代码，，，即覆盖率
npx hardhat  //查看当前能运行的task有哪些
其中 coverage 就是该工具

