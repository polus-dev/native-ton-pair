import { Address, Builder, Coins, BOC } from 'ton3'
import * as qr from 'qrcode-terminal'
import qs from 'qs'

interface IArgs {
    dexAddress: Address
    jlpAddress: Address
    value: Coins
}

function init (): IArgs {
    const args = process.argv.slice(2)
    if (args.length !== 3) throw new Error('invalid arguments count')

    return {
        dexAddress: new Address(args[0]),
        jlpAddress: new Address(args[1]),
        value: new Coins(args[2])
    }
}

function main () {
    const initdata = init()

    console.log(`initdata.value: ${initdata.value.toString()}`)
    const body = new Builder()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(Math.floor(Date.now() / 1000), 64)
        .storeCoins(initdata.value)                 // amount
        .storeAddress(initdata.dexAddress)          // destination
        .storeAddress(initdata.dexAddress)          // response_destination
        .storeBit(0)                                // custom_payload
        .storeCoins(new Coins(0.1))                 // forward_ton_amount
        .storeBit(0)                                // forward_payload (Either bit)
        .cell()

    const bodyBOC = BOC.toBase64Standard(body)

    // eslint-disable-next-line prefer-template
    const link = 'https://test.tonhub.com/transfer/'
                + initdata.jlpAddress.toString('base64', { bounceable: true, testOnly: true })
                + '?'
                + qs.stringify({
                    text: 'add liquidity',
                    amount: new Coins(0.25).toNano(),
                    bin: bodyBOC
                })

    console.log(link)

    qr.generate(link, { small: true })
}

if (require.main === module) { main() }
