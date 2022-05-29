import { Address, BOC, Cell, Coins, Slice } from 'ton3'

// const msg = BOC.fromStandard('te6cckEBAgEAOwABZHNi0JwAAAAAYo03W0yzKAeoAZSNgkpIKbe/myAY7DuRybyEyvxdZ/Gt2uEb7Pehfy5zAQAIAAAD6rc8iBA=')
const msg = BOC.fromStandard('te6cckEBAgEAOAABXnNi0JwAAAAAYo5INxoIAZSNgkpIKbe/myAY7DuRybyEyvxdZ/Gt2uEb7Pehfy5zAQAIAAAD6gFU32s=')

function main () {
    const cs = Slice.parse(msg)
    const op = cs.loadUint(32).toString(16)
    const queryId = cs.loadUint(64)
    const amount = new Coins(cs.loadCoins()).toString()
    const sender = cs.loadAddress()
    const forwardPayloadEither = cs.loadBit()

    let forwardPayload: Slice
    if (!forwardPayloadEither) {
        forwardPayload = cs
    } else {
        forwardPayload = Slice.parse(cs.loadRef())
    }

    console.log(`op:                        ${op}`)
    console.log(`query_id:                  ${queryId}`)
    console.log(`amount:                    ${amount}`)
    console.log(`sender:                    ${sender.toString('base64', { bounceable: true })}`)
    console.log(`forwardPayloadEither:      ${forwardPayloadEither}`)
    console.log(`forwardPayload (bits len): ${forwardPayload.bits.length}`)

    const fwdOp = forwardPayload.loadUint(32)
    console.log(`fwdOp:                     ${fwdOp}`)
}

if (require.main === module) { main() }
