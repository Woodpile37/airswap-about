const fs = require('fs')
const { getAccountUrl } = require('@airswap/utils')
const { mainnets, testnets, chainNames, ChainIds } = require('@airswap/constants')

const contracts = [{
  name: 'SwapERC20',
  deploys: require('@airswap/swap-erc20/deploys')
}, {
  name: 'Swap',
  deploys: require('@airswap/swap/deploys')
}, {
  name: 'Wrapper',
  deploys: require('@airswap/wrapper/deploys')
}, {
  name: 'Registry',
  deploys: require('@airswap/maker-registry/deploys')
}, {
  name: 'RegistryV4',
  deploys: require('@airswap/registry/deploys')
}, {
  name: 'Pool',
  deploys: require('@airswap/pool/deploys')
}, {
  name: 'Staking',
  deploys: require('@airswap/staking/deploys')
}, {
  name: 'AST',
  deploys: {
    1: require('@airswap/constants').stakingTokenAddresses[1]
  }
}]

const active = {
  '1': '0x522d6f36c95a1b6509a14272c17747bbb582f2a6',
  '56': '0x132f13c3896eab218762b9e46f55c9c478905849',
  '137': '0x6713c23261c8a9b7d84dd6114e78d9a7b9863c1a',
  '43114': '0xec08261ac8b3d2164d236bd499def9f82ba9d13f'
}

function printContracts(contracts, chainid) {
  let md = ''
  for (let contract in contracts) {
    let address = contracts[contract].deploys[chainid]
    if (!!address) md += `- ${contracts[contract].name} — [\`${address}\`](${getAccountUrl(chainid, address)}#code)\n`
  }
  return md
}

function initial(name) {
  return name[0] + name.slice(1).toLowerCase()
}

let markdown = "# AirSwap V4\n\n"
for (let net in mainnets) {
  let name = initial(chainNames[mainnets[net]])
  markdown += `## ${name} (${mainnets[net]})\n\n${printContracts(contracts, mainnets[net])}\n`
}

markdown += "# AirSwap V4: Testnets\n\n"
for (let net in testnets) {
  let name = initial(chainNames[testnets[net]])
  if (testnets[net] !== ChainIds.HARDHAT) markdown += `## ${name} (${testnets[net]})\n\n${printContracts(contracts, testnets[net])}\n`
}

markdown += '\n\n# Legacy\n\n## AirSwap V3\n\n'
for (let chainid in active) {
  let name = initial(chainNames[chainid])
  markdown += `- AirSwap V3: Swap (${chainid}) — [\`${active[chainid]}\`](${getAccountUrl(chainid, active[chainid])}#code)\n`
}
markdown += '- AirSwap V3: Staking (1) — [`0x6d88B09805b90dad911E5C5A512eEDd984D6860B`](https://etherscan.io/address/0x6d88B09805b90dad911E5C5A512eEDd984D6860B#code])\n'

markdown += '\n\n## AirSwap V2\n\n\
- AirSwap V2: Swap — [`0x4572f2554421Bd64Bef1c22c8a81840E8D496BeA`](https://etherscan.io/address/0x4572f2554421Bd64Bef1c22c8a81840E8D496BeA#code)\n\
- AirSwap V2: Staking [`0x579120871266ccd8de6c85ef59e2ff6743e7cd15`](https://etherscan.io/address/0x579120871266ccd8de6c85ef59e2ff6743e7cd15#code)\n\
- AirSwap V2: Staking (Legacy) [`0xa4C5107184a88D4B324Dd10D98a11dd8037823Fe`](https://etherscan.io/address/0xa4C5107184a88D4B324Dd10D98a11dd8037823Fe#code)\n\
- AirSwap V2: Staking (Deprecated) [`0x704c5818b574358dfb5225563852639151a943ec`](https://etherscan.io/address/0x704c5818b574358dfb5225563852639151a943ec#code)\n'

markdown += '\n\n# Security Audits\n\n\
- [AirSwap V4: Audit Report: SwapERC20, Swap, Wrapper](https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-AirswapV4-v1.0.pdf)\n\
- [AirSwap V4: Audit Report: Staking, Registry](https://github.com/peckshield/publications/tree/master/audit_reports/PeckShield-Audit-Report-AirSwap-Staking-v1.0.pdf)\n\
- [AirSwap V3: Audit Report: Pool](https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-AirSwap-v1.0.pdf)'

fs.writeFileSync(
  './technology/deployments.md',
  markdown
)
console.log(markdown)