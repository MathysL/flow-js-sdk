import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    LOCKEDTOKENADDRESS: "0xLOCKEDTOKENADDRESS",
    STAKINGPROXYADDRESS: "0xSTAKINGPROXYADDRESS"
}

const Env = {
    local: {
        [Deps.LOCKEDTOKENADDRESS]: "0x0",
        [Deps.STAKINGPROXYADDRESS]: "0x0",
    },
    testnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0xbe9b485f7d5e7787",
        [Deps.STAKINGPROXYADDRESS]: "0x7aad92e5a0715d21",
    },
    mainnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0x31aed847945124fd",
        [Deps.STAKINGPROXYADDRESS]: "0x3a84eade58d45ad4",
    }
}

export const TITLE = "Restake Unstaked Flow"
export const DESCRIPTION = "Restakes unstaked Flow for an account."
export const VERSION = "0.0.1"
export const HASH = "f90792e5df759396c22ae43f24893666295a6ec5cfaefe5b5c506b2cadd5a5f9"
export const CODE = 
`import LockedTokens from 0xLOCKEDTOKENADDRESS
import StakingProxy from 0xSTAKINGPROXYADDRESS

transaction(amount: UFix64) {

    let holderRef: &LockedTokens.TokenHolder

    prepare(acct: AuthAccount) {
        self.holderRef = acct.borrow<&LockedTokens.TokenHolder>(from: LockedTokens.TokenHolderStoragePath)
            ?? panic("Could not borrow reference to TokenHolder")
    }

    execute {
        let stakerProxy = self.holderRef.borrowStaker()

        stakerProxy.stakeUnstakedTokens(amount: amount)
    }
}`

export const template = async ({ proposer, authorization, payer, amount = ""}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])
    code = code.replace(Deps.STAKINGPROXYADDRESS, Env[env][Deps.STAKINGPROXYADDRESS])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(amount, t.UFix64)]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator((ix, {Ok, Bad}) => {
            if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
            return Ok(ix)
        })
    ])
}
