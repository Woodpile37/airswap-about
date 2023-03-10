Servers provide descriptive errors where possible. In the case of a server side error, return a JSON-RPC error response.

```javascript
{
  "jsonrpc": "2.0",
  "id": 123,
  "error": { "code": -33605, "message": "Rate limit exceeded" }
}
```

The following are error codes in the [JSON-RPC specification](http://www.jsonrpc.org/specification#error_object):

- `-32700` Parse error
- `-32600` Invalid Request
- `-32601` Method not found
- `-32602` Invalid params
- `-32603` Internal error
- `-32000 to -32099` (Reserved for implementation-defined server-errors)

The following are AirSwap specific errors:

- `-33600` Cannot provide the requested quote or order
- `-33601` Not trading the requested `signerToken` `senderToken` pair
- `-33602` The specified `senderAmount` or `signerAmount` is too low
- `-33603` The specified `senderAmount` or `signerAmount` is too high
- `-33604` Invalid request parameters
- `-33605` Rate limit exceeded
- `-33700 to -33799` (Reserved for implementation specific trading errors)
