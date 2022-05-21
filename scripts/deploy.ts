/* eslint-disable no-await-in-loop */
import { Address, BOC, Coins, Providers } from 'ton3'
import * as qr from 'qrcode-terminal'
import * as fs from 'fs'
import { ContractDEX } from '../src/dex'
import { fileToCell, sleep, waitForGrams } from '../src/utils'

const TONHUB_V4_URL = 'https://sandbox-v4.tonhubapi.com'
const TONCENTER_URL = 'https://sandbox.tonhubapi.com'

const DEX_CODE = fileToCell('auto/main.func.code.boc')
const J_MINTER_CODE = fileToCell('auto/btn-mint-ico.func.code.boc')
const J_WALLET_CODE = fileToCell('auto/btn-jwallet.func.code.boc')

const PROJECT_ADDR = new Address('kQBb7sLNDjwMbwxUCqoGiV5gKmQMscLzlF2WPnpi8dMUcL9m')
const WORKCHAIN = 0

async function main () {
    const dex = new ContractDEX(DEX_CODE, WORKCHAIN, {
        swap: {
            operationPrice: new Coins(0.1),
            aServiceFee: 1, // %
            bServiceFee: 1, // %
            maxPricePercentage: 20,
            project: PROJECT_ADDR
        },
        lp: { lpFeePercentage: 1, lpWithdrawComission: 1 },
        codeData: {
            jettonMinterCode: J_MINTER_CODE,
            jettonWalletCode: J_WALLET_CODE
        }
    })

    console.log(`dex address bounceable:        ${dex.address.toString('base64', { bounceable: true })}`)
    console.log(`dex address non-bounceable:    ${dex.address.toString('base64', { bounceable: false })}`)
    console.log('\nnon-bounceable qr-code:')
    qr.generate(dex.address.toString('base64', { bounceable: false }), { small: true })

    await waitForGrams(TONHUB_V4_URL, dex.address)

    const provider = new Providers.ProviderRESTV2(TONCENTER_URL)
    const client = await provider.client()

    console.log()
    for (let i = 0; i < 3; i++) {
        const bocResp = await client.sendBoc(
            null,
            { boc: BOC.toBase64Standard(dex.deployMessage()) }
        )
        console.log(bocResp.data.result)
        await sleep(400)
    }

    fs.writeFileSync('init.boc', BOC.toBytesStandard(dex.deployMessage()))
}

if (require.main === module) { main() }
