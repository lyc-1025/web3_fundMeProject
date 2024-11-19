// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 1、创建一个收款函数
// 2、记录投资人并查看
// 3、在锁定期内，达到目标值，生产商可以提款
// 4、在锁定期内，没有达到目标值，投资人在锁定期以后退款

contract FundMe {
    mapping(address => uint256) public fundesToAmount;
    uint256 constant MINIMUN_VALUE = 100 * 10**18; //现在要求用USD计算,即100usd
    uint256 constant TARGAT = 1000 * 10**18; //众筹目标金额
    AggregatorV3Interface public dataFeed;
    address public owner;
    uint256 deploymentTimeSatmp;
    uint256 lockTime;
    address  erc20;
    bool public getFundSuccess = false;
    
    event getFundEvent(uint256 withdrawAmount);

    event reFundEvent(address,uint256);
    constructor(uint256 _lockTime,address aggregatorAddr) {
        //sepolia testnet 0x694AA1769357215DE4FAC081bf1f309aDC325306
        dataFeed = AggregatorV3Interface(
            aggregatorAddr
        );
        owner = msg.sender;
        deploymentTimeSatmp = block.timestamp;
        lockTime = _lockTime;
    }

    modifier OnlyOwner(){
        require(msg.sender == owner, "not owner");
       _;
    }

    modifier windowClosed(){
         require(
            block.timestamp >= deploymentTimeSatmp + lockTime,
            "window is not closed"
        );
        _;
    }

     
    function fund() external payable {
        require(convertEthToUsd(msg.value) >= MINIMUN_VALUE, "send more eth");
        require(
            block.timestamp < deploymentTimeSatmp + lockTime,
            "window is closed"
        );
        fundesToAmount[msg.sender] = msg.value;
    }

    function upDataFundToToken(address funder,uint256 updataAmount) external {
       require(msg.sender==erc20,"");
       fundesToAmount[funder] = updataAmount;
    }

    function setERC20 (address _erc20Addr) external OnlyOwner{
        erc20 = _erc20Addr;
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function transFerOwnerShip(address newOwner) OnlyOwner public {
        owner = newOwner;
    }

    function getFund() OnlyOwner windowClosed external {
        require(
            convertEthToUsd(address(this).balance) >= TARGAT,
            "balance not enough"
        );
        uint256 balance = address(this).balance;
        // payable (address(msg.sender)).transfer(address(this).balance);
        (bool success, ) = payable(address(msg.sender)).call{
            value: balance
        }("");
        require(success, "");
        fundesToAmount[msg.sender] = 0;
        getFundSuccess = true;
        emit getFundEvent(balance);
    }

    function reFund() windowClosed external {
        require(convertEthToUsd(address(this).balance) < TARGAT, "Target is reached");
        uint256 userBalance = fundesToAmount[msg.sender];
        require(userBalance != 0, "there is no fund for you");
        (bool success, ) = payable(address(msg.sender)).call{
            value: userBalance
        }("");
        require(success, "");
        fundesToAmount[msg.sender] = 0;
        emit reFundEvent(msg.sender,userBalance);
    }

    function convertEthToUsd(uint256 ethAmount)
        internal
        view
        returns (uint256)
    {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return (ethAmount * ethPrice) / (10**8);
    }
}
