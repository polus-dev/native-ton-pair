/* eslint-disable no-await-in-loop */
import { Address, BOC, Coins, Providers } from 'ton3'
import * as qr from 'qrcode-terminal'
import { ContractDEX } from '../src/dex'
import { fileToCell, sleep, waitForGrams } from '../src/utils'

const TONHUB_V4_URL = 'https://mainnet-v4.tonhubapi.com'
const TONCENTER_URL = 'https://mainnet-rpc.biton.app'

const DEX_CODE = fileToCell('auto/main.func.code.boc')
const J_MINTER_CODE = fileToCell('auto/jetton-minter.code.boc')
const J_WALLET_CODE = fileToCell('auto/jetton-wallet.code.boc')

const PROJECT_ADDR = new Address('EQDXiSTqxgojoiyAlUBPW66muystYAmZJRGYK_5flnOMmleQ')
const WORKCHAIN = 0

async function main () {
    const dex = new ContractDEX(DEX_CODE, WORKCHAIN, {
        swap: {
            operationPrice: new Coins(0.1),
            aServiceFee: 0.5, // %
            bServiceFee: 0.5, // %
            maxPricePercentage: 20,
            project: PROJECT_ADDR
        },
        lp: { lpFeePercentage: 0.5 },
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

    const client = await new Providers.ProviderRESTV2(
        TONCENTER_URL
        // { apiKey: 'eb7febb199841f9b20a7f6ca161be09918c71c753d210cb30a46996815d8ca4d' }
    ).client()

    const deployCell = dex.deployMessage()

    console.log('')
    for (let i = 0; i < 3; i++) {
        const bocResp = await client.sendBoc(
            null,
            { boc: BOC.toBase64Standard(deployCell) }
        )
        console.log(bocResp.data.result)
        await sleep(400)
    }
}

if (require.main === module) { main() }
