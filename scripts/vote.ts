import * as fs from "fs"
//@ts-ignore
import { network, ethers } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"

const index = 0

async function main(proposalIndex: number){
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    // You could swap this out for the ID you want to use
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    //0: Against, 1: For, 2: Abstain
    const voteWay = 1
    const reason = "Because I want to"
    await vote(proposalId, voteWay, reason)
}

export async function vote(proposalId: string, voteWay: number, reason: string) {
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
    const voteTxReceipt = voteTx.wait(1)
    // console.log(voteTxReceipt.events[0].args.reason)
    const proposalState = await governor.state(proposalId)
    console.log(`Current Proposal state: ${proposalState}`)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
      }
    
    console.log(`Current Proposal state: ${await governor.state(proposalId)}`)
    console.log("Voted. Ready to go!")
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
