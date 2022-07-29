import { Address, Builder, Coins, BOC } from 'ton3'
import * as qr from 'qrcode-terminal'
import qs from 'qs'
import { fileToCell } from '../src/utils'

const DEX_CODE = fileToCell('auto/main.func.code.boc')
const DEX_ADDR = new Address('EQAD8YIaIhVPmYjmgwEbQMpRL20W85OWxQSp0K2EuY7DY9ic')

function main () {
    const body = new Builder()
        .storeUint(0x03f2, 32)  // set_data_code#03f2
        .storeBits([ 1, 0 ])
        .storeRef(DEX_CODE)
        .cell()

    const bodyBOC = BOC.toBase64Standard(body)

    // eslint-disable-next-line prefer-template
    const link = 'https://tonhub.com/transfer/'
                + DEX_ADDR.toString('base64', { bounceable: true, testOnly: true })
                + '?'
                + qs.stringify({
                    text: 'add liquidity',
                    amount: new Coins(0.5).toNano(),
                    bin: bodyBOC
                })

    console.log(link)

    // qr.generate(link, { small: true })
}

if (require.main === module) { main() }
