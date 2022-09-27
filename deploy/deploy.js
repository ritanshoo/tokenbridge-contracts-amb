const fs = require('fs')
const path = require('path')
const env = require('./src/loadEnv')

const { BRIDGE_MODE, ERC20_TOKEN_ADDRESS } = env

const deployResultsPath = path.join(__dirname, './bridgeDeploymentResults.json')

function writeDeploymentResults(data) {
  fs.writeFileSync(deployResultsPath, JSON.stringify(data, null, 4))
  console.log('Contracts Deployment have been saved to `bridgeDeploymentResults.json`')
}

async function deployErcToNative() {
  const preDeploy = require('./src/erc_to_native/preDeploy')
  const deployHome = require('./src/erc_to_native/home')
  const deployForeign = require('./src/erc_to_native/foreign')
  await preDeploy()
  const { homeBridge } = await deployHome()
  const { foreignBridge } = await deployForeign(homeBridge.address)
  console.log('\nDeployment has been completed.\n\n')
  console.log(`[ Home ] HomeBridge: ${homeBridge.address} at block ${homeBridge.deployedBlockNumber}`)
  console.log(`[ Foreign ] ForeignBridge: ${foreignBridge.address} at block ${foreignBridge.deployedBlockNumber}`)
  writeDeploymentResults({
    homeBridge: {
      ...homeBridge
    },
    foreignBridge: {
      ...foreignBridge
    }
  })
}

async function deployArbitraryMessage() {
  const preDeploy = require('./src/arbitrary_message/preDeploy')
  const deployHome = require('./src/arbitrary_message/home')
  const deployForeign = require('./src/arbitrary_message/foreign')
  await preDeploy()
  const { homeBridge } = await deployHome()
  const { foreignBridge } = await deployForeign()
  console.log('\nDeployment has been completed.\n\n')
  console.log(`[   Home  ] HomeBridge: ${homeBridge.address} at block ${homeBridge.deployedBlockNumber}`)
  console.log(`[ Foreign ] ForeignBridge: ${foreignBridge.address} at block ${foreignBridge.deployedBlockNumber}`)
  writeDeploymentResults({
    homeBridge: {
      ...homeBridge
    },
    foreignBridge: {
      ...foreignBridge
    }
  })
}

async function deployAMBErcToErc() {
  const preDeploy = require('./src/amb_erc677_to_erc677/preDeploy')
  const deployHome = require('./src/amb_erc677_to_erc677/home')
  const deployForeign = require('./src/amb_erc677_to_erc677/foreign')
  const initialize = require('./src/amb_erc677_to_erc677/initialize');
  console.log("1 ====================")
  // await preDeploy()
  console.log("2 ====================")

  // const { homeBridgeMediator, bridgeableErc677 } = await deployHome()
  console.log("3 deployHome ke baad  ====================")

  // const { foreignBridgeMediator } = await deployForeign()
  console.log("4 deployForeign ke baad  ====================")

  const homeBridge = "0xed47976103eBcCF7685e8aF185deD9EcF57E146A"
  const foreignBridge = "0xA8Ab482F05924A52D3d684240942B57817Cc176A"
  const homeErc677 = "0x16CE67c0ab3607BD65bd351C0b913E8e8404878A"

  await initialize({
    homeBridge,
    foreignBridge,
    homeErc677
  })

  console.log("5 initialize ke baad  ====================")
  
  console.log('\nDeployment has been completed.\n\n')
  console.log(`[   Home  ] Bridge Mediator: ${homeBridge}`)
  console.log(`[   Home  ] ERC677 Bridgeable Token: ${homeErc677}`)
  console.log(`[ Foreign ] Bridge Mediator: ${foreignBridge}`)
  console.log(`[ Foreign ] ERC677 Token: ${ERC20_TOKEN_ADDRESS}`)
  // writeDeploymentResults({
  //   homeBridge: {
  //     homeBridgeMediator,
  //     bridgeableErc677
  //   },
  //   foreignBridge: {
  //     foreignBridgeMediator
  //   }
  // })
}

async function deployAMBErcToErcOld() {
  const preDeploy = require('./src/amb_erc677_to_erc677/preDeploy')
  const deployHome = require('./src/amb_erc677_to_erc677/home')
  const deployForeign = require('./src/amb_erc677_to_erc677/foreign')
  const initialize = require('./src/amb_erc677_to_erc677/initialize');
  console.log("1 ====================")
  await preDeploy()
  console.log("2 ====================")

  const { homeBridgeMediator, bridgeableErc677 } = await deployHome()
  console.log("3 deployHome ke baad  ====================")

  const { foreignBridgeMediator } = await deployForeign()
  console.log("4 deployForeign ke baad  ====================")

  await initialize({
    homeBridge: homeBridgeMediator.address,
    foreignBridge: foreignBridgeMediator.address,
    homeErc677: bridgeableErc677.address
  })

  console.log("5 initialize ke baad  ====================")
  
  console.log('\nDeployment has been completed.\n\n')
  console.log(`[   Home  ] Bridge Mediator: ${homeBridgeMediator.address}`)
  console.log(`[   Home  ] ERC677 Bridgeable Token: ${bridgeableErc677.address}`)
  console.log(`[ Foreign ] Bridge Mediator: ${foreignBridgeMediator.address}`)
  console.log(`[ Foreign ] ERC677 Token: ${ERC20_TOKEN_ADDRESS}`)
  writeDeploymentResults({
    homeBridge: {
      homeBridgeMediator,
      bridgeableErc677
    },
    foreignBridge: {
      foreignBridgeMediator
    }
  })
}

async function main() {
  console.log(`Bridge mode: ${BRIDGE_MODE}`)
  switch (BRIDGE_MODE) {
    case 'ERC_TO_NATIVE':
      await deployErcToNative()
      break
    case 'ARBITRARY_MESSAGE':
      await deployArbitraryMessage()
      break
    case 'AMB_ERC_TO_ERC':
      await deployAMBErcToErc()
      break
    default:
      console.log(BRIDGE_MODE)
      throw new Error('Please specify BRIDGE_MODE: ERC_TO_NATIVE or ARBITRARY_MESSAGE or AMB_ERC_TO_ERC')
  }
}

main().catch(e => console.log('Error:', e))
