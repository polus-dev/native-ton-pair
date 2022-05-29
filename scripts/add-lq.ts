import { Address, Builder, Coins, BOC } from 'ton3'
import * as qr from 'qrcode-terminal'
import qs from 'qs'

interface IArgs {
    dexAddress: Address
    jAddress: Address
    prop: number
    ton: number
}

function init (): IArgs {
    const args = process.argv.slice(2)
    if (args.length !== 4) throw new Error('invalid arguments count')

    return {
        dexAddress: new Address(args[0]),
        jAddress: new Address(args[1]),
        prop: parseFloat(args[2]),
        ton: Number(new Coins(parseInt(args[3], 10)).toNano())
    }
}

function main () {
    const initdata = init()
    console.log(`initdata.ton:  ${initdata.ton}`)
    console.log(`initdata.prop: ${initdata.prop}`)

    const fwdjetton = Math.round((initdata.ton / initdata.prop) * 1000000000)
    console.log(`fwdjetton:     ${fwdjetton}`)

    const body = new Builder()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(Math.floor(Date.now() / 1000), 64)
        .storeCoins(Coins.fromNano(fwdjetton))      // amount
        .storeAddress(initdata.dexAddress)          // destination
        .storeAddress(initdata.dexAddress)          // response_destination
        .storeBit(0)                                // custom_payload
        .storeCoins(new Coins(initdata.ton, true))  // forward_ton_amount
        .storeBit(1)                                // forward_payload (Either bit)
        .storeRef(new Builder().storeUint(1002, 32).cell())
        .cell()

    const bodyBOC = BOC.toBase64Standard(body)

    // eslint-disable-next-line prefer-template
    const link = 'https://test.tonhub.com/transfer/'
                + initdata.jAddress.toString('base64', { bounceable: true, testOnly: true })
                + '?'
                + qs.stringify({
                    text: 'add liquidity',
                    amount: new Coins(0.2).add(new Coins(initdata.ton, true)).toNano(),
                    bin: bodyBOC
                })

    console.log('')

    qr.generate(link, { small: true })
}

if (require.main === module) { main() }
