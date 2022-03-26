import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
//@ts-ignore
import { ethers } from "hardhat";

const deployBox: DeployFunction = async function (hre:HardhatRuntimeEnvironment) {
    //@ts-ignore
    const { getNamedAccounts, deployments} = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying Box Contract...");
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    });

    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContractAt("Box", box.address);
    const transferOwnershipTx = await boxContract.transferOwnership(timeLock.address);
    await transferOwnershipTx.wait(1)

    log(`Deployed Box Contract to address ${box.address}`);
    log(`YOU DUN IT!!!`);
};

export default deployBox;