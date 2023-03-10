## Adding to the Registry

You can debug all methods using the `quote` and `order` [AirSwap CLI commands](https://github.com/airswap/airswap-cli#all-commands).

Ensure the AirSwap CLI is installed.

```
$ yarn global add airswap
```

Once your server is up and running at a **public URL**, you're ready to add it to the Registry. First, ensure an account is set with the `airswap account:import` command. You can but are not required to use the same Ethereum account that your Server is using.

Let's take a look at the available Registry commands.

```
$ airswap registry
AirSwap CLI 1.6.1 — https://airswap.io/
add and remove supported tokens

USAGE
  $ airswap registry:COMMAND

COMMANDS
  registry:add     add supported tokens to the registry
  registry:enable  enable staking on the registry
  registry:get     get urls from the registry
  registry:list    list supported tokens from registry
  registry:remove  remove supported tokens from the registry
  registry:url     set server url on the registry
```

First run the following command to enable staking for your account.

```
$ airswap registry:enable
```

Now run the following command to set your server url on the registry.

```
$ airswap registry:url
```

Now run the following command to add tokens you support.

```
$ airswap registry:add
```

To ensure your configuration is correct, you can query tokens that you support on the registry.

```
$ airswap registry:get
AirSwap CLI 1.6.1 — https://airswap.io/

get urls from the registry RINKEBY

Registry 0xa77fbeD39D5128e1cA9795d68D73010851393BCc

Token pair (e.g. WETH/USDT):  DAI/WETH

Server
----------------------------------------
https://maker.example.com/
```

Now that your server is running and has been added to the Registry, your quotes will be returned among results of the `airswap order:best` command and aggregators like [MetaMask Swaps](https://medium.com/metamask/introducing-metamask-swaps-84318c643785).

```
$ airswap order:best
AirSwap CLI 1.6.1 — https://airswap.io/

get the best available order MAINNET

buy or sell:  buy
amount:  0.1
of:  weth
for:  dai

Quote from https://maker.example.com/

✨ Buy 0.1 WETH for 250 DAI
Price 0.0004 WETH/DAI (2500 DAI/WETH)
```

# Reading from the Registry

To find servers that support a token pair, clients call the `getURLsForToken` function on the [MakerRegistry](deployments.md) contract for each token and then intersect the results. For example, if the resulting URLs for token A are `[maker1.com, maker2.com]` and for token B are `[maker2.com, maker3.com]` then the only server supporting swapping token A for B is `maker2.com`.

See `getURLsForToken` on the Registry contract:

```typescript
function getURLsForToken(address token) external view returns (string[] memory urls);
```

Check [deployments](deployments.md) for latest contract addresses for Registry.

## Fetching URLs via CLI

Ensure the AirSwap CLI is installed.

```
$ yarn global add airswap
```

Use `airswap chain` to set your chain to Goerli or Mainnet.

```
$ airswap chain
AirSwap CLI 3.1.0 — https://www.airswap.io/

set the active ethereum chain

Current chain: 5 (GOERLI)

New chain id:  (5) 1

Set active chain to ETHEREUM.
```

Use `registry:get` to fetch server URLs for a token pair.

```
$ airswap registry:get
AirSwap CLI 3.1.0 — https://www.airswap.io/

get urls from the registry ETHEREUM

Registry 0x8F9DA6d38939411340b19401E8c54Ea1f51B8f95

Token pair (e.g. WETH/USDT):  dai/weth

Server
----------------------------------------
https://maker.example.com/
```

### Example: Take an Order

Try `airswap rfq:get` with a server URL from the previous command.

## TypeScript

Using the `MakerRegistry` library from `@airswap/libraries` returns `Maker` instances that you can interact with.

```typescript
import { MakerRegistry } from '@airswap/libraries'
const servers = await new MakerRegistry(chainId, provider).getMakers(
  signerToken,
  senderToken,
)
```

Calling the MakerRegistry directly using `ethers`

```typescript
import { ethers } from 'ethers'
import { chainNames } from '@airswap/constants'
import * as MakerRegistryContract from '@airswap/maker-registry/build/contracts/MakerRegistry.sol/MakerRegistry.json'
import * as makerRegistryDeploys from '@airswap/maker-registry/deploys.js'
const MakerRegistryInterface = new ethers.utils.Interface(
  JSON.stringify(MakerRegistryContract.abi),
)

new ethers.Contract(
  makerRegistryDeploys[chainId],
  MakerRegistryInterface,
  ethers.getDefaultProvider(chainNames[chainId].toLowerCase()),
)

const baseTokenURLs = await this.contract.getURLsForToken(baseToken)
const quoteTokenURLs = await this.contract.getURLsForToken(quoteToken)

const serverURLs = baseTokenURLs.filter((value) =>
  quoteTokenURLs.includes(value),
)
```

### Example: Take an Order

```typescript
import { MakerRegistry, SwapERC20 } from '@airswap/libraries'
import { chainNames } from '@airswap/constants'

const provider = ethers.getDefaultProvider(chainNames[chainId].toLowerCase())

const makers = await new MakerRegistry(chainId, provider).getMakers(
  quoteToken,
  baseToken,
)

const order = makers[0].getSignerSideOrderERC20(
  baseTokenAmount,
  quoteToken,
  baseToken,
  wallet.address,
)

const tx = await new SwapERC20(chainId, provider).swapLight(order)
```
