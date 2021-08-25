# Architecture

AirSwap works with a combination of web protocols and smart contracts. There are two kinds of liquidity providers in the system, those that run their own HTTP servers to provide liquidity and those that manage onchain delegates that make trades on their behalf.

Each swap is between at least two parties, a `signer` and a `sender`. The `signer` is the party that creates and cryptographically signs an order, and `sender` is the party that sends the order to the Ethereum blockchain for settlement.

![](.gitbook/assets/airswap-architecture.png)

## Make Liquidity

Makers run Servers or deploy Delegates and use the Registry to signal their interest in trading.

**Makers**...

1. [Run a Server](makers/run-a-server.md) at a public URL and use it as their `locator` value.
2. [Stake](makers/debug-with-cli.md) AirSwap Tokens to signal their intent to trade on the [Registry](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/reference/registry.md).
3. Respond to [`get*Quote`](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/apis.md#quotes) and [`get*Order`](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/apis.md#orders) requests.

See code examples of these protocols at work in the [Run a Server](makers/run-a-server.md) section.

## Take Liquidity

### Servers \(HTTPS\)

Servers implement the [Quote](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/protocols/quote.md) and [Order](protocols/light.md) protocols.

**Takers**...

1. For each side of a pair \(e.g. WETH/USDT\) call `getURLsForToken` on the **Server** [**Registry**](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/reference/registry.md) and receives a list of URLs of servers supporting each token and intersects the lists.
2. Call `get*Order` on each **HTTPS** [**Server**](makers/run-a-server.md) using JSON-RPC over HTTPS.
3. Call `swap` on the [**Swap**]() **Contract** with the order that it wishes to execute.

### Delegates \(onchain\)

Delegates implement the [Quote](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/protocols/quote.md) and [Last Look](protocols/last-look.md) protocols.

**Takers**...

1. Call `getIntents` on the **Delegate** [**Indexer**]() using protocol `0x0001` and receives contract addresses.
2. Call `get*Quote` on each [**Delegate**]() **Contract**.
3. Call `provideOrder` on the selected **Delegate Contract** that performs the [**Swap**]().

See code examples of these protocols at work in the [Run an Aggregator](https://github.com/airswap/airswap-docs/tree/c9c1403d28ce5ee17d63f4b8e3fc8dcf0d219032/take-liquidity/request-quotes.md) section.

## Third-Parties

**Authorizations** are for parties that trade on behalf of others. These parties are authorized by an individual to send or sign orders for them. Parties can be wallets \(people or programs\) or smart contracts.

**Affiliates** are third-parties compensated for their part in bringing together the two parties of a trade and can be other traders or software applications that connect traders on the network.

