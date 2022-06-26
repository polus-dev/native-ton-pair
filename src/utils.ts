/* eslint-disable no-await-in-loop */
import * as fs from 'fs'
import { Address, BOC, Cell } from 'ton3'
import { TonClient4, Address as AddressSteve } from 'ton'
import { getRandSigner } from 'signer'

function fileToCell (filename: string): Cell {
    const file = fs.readFileSync(filename)
    return BOC.fromStandard(file)
}

const sleep = (milliseconds: number): Promise<any> => new Promise(
    (resolve) => { setTimeout(resolve, milliseconds) }
)

function loadingAnimation (
    text: string = '',
    chars: string[] = [ '⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉' ],
    delay: number = 100
) {
    let x = 0

    return setInterval(() => {
        process.stdout.write(`\r${chars[x++]} ${text}`)
        x %= chars.length
    }, delay)
}

async function waitForGrams (endpoint: string, address: Address): Promise<void> {
    const client = new TonClient4({ endpoint })
    const load = loadingAnimation('💎 awaiting for coins')

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const blockResp = await client.getLastBlock()

        let resp: any
        try {
            resp = await client.getAccount(
                blockResp.last.seqno,
                AddressSteve.parseFriendly(address.toString()).address
            )
        } catch (_) {
            // eslint-disable-next-line no-continue
            continue
        }
        // console.log(`coins: ${resp.account.balance.coins}`)
        if (Number(resp.account.balance.coins) > 0) break

        await sleep(1 * 1000)
    }

    clearInterval(load)
}

export { fileToCell, waitForGrams, sleep }
export { getRandSigner }
