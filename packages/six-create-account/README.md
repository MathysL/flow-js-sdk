# @onflow/six-create-account

Stored Interaction for creating an Account on Flow.

# Status

- **Last Updated:** July 6 2020
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-create-account

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as createAccount } from "@onflow/six-create-account"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    createAccount({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,
        payer: fcl.currentUser().authorization,
        code: "my-cadence-code",                            // Cadence code as a utf8 string.
        publicKeys: [myPublicKeyAsHexString]
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```