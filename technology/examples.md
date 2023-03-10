```
const senderAmount = '1'   // Amount of token to send
const signerToken = '...'  // Address of token to receive
const senderToken = '...'  // Address of token to send
const senderWallet = '...' // Address of your wallet

const makers = await new MakerRegistry(
  chainIds.GOERLI, new ethers.providers.JsonRpcProvider('...')
).getMakers(
  signerToken,
  senderToken,
)
makers.map(async (maker) => {
  console.log(await maker.getSignerSideOrder(
    senderAmount,
    signerToken,
    senderToken,
    senderWallet
    )
  )
})
```
