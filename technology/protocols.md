AirSwap liquidity providers are **makers**, generally online and quoting, with **takers** on the other side of each trade. At the lower protocol level, where the software used by makers and takers interacts with Ethereum, there are **signers**, who set and cryptographically sign terms (an order), and **senders** who submit those terms for settlement on the Swap contract.

For the RFQ protocol, a server is always the **signer** and the client is always the **sender**. For Last Look, the client is always the **signer** and a server is always the **sender**.

- **Nonces** are unique identifiers for swaps and used for cancels. They should be generated incrementally but might execute out of order.
- **URLs** may be to either HTTP or WebSocket servers using `https` or `wss` respectively.
- **Registry** is used to signal that a server is available to trade specific tokens, including contact information (URL), without pricing.

## Protocol Fees

When signing orders in RFQ, a protocol fee (in basis points) is [hashed into the signature](broken-reference) and verified during settlement. The value of this parameter must match its current value of `protocolFeeLight` on the [Swap](deployments.md) contract. The amount is transferred from the `signerWallet` address upon settlement.

100% of protocol fees go toward AirSwap governance participants and project contributors.
