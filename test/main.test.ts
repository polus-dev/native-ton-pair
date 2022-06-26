import { expect } from 'chai'
import * as fs from 'fs'
// import BN from 'bn.js'
import {
    Builder,
    InternalMessage,
    CommonMessageInfo,
    CellMessage,
    Cell,
    toNano
} from 'ton'
import { SmartContract } from 'ton-contract-executor'
import { encodeDexStorage } from '../src/encoder'
import { getRandSigner } from '../src/signer'

function bocFileToTCell (filename: string): Cell {
    const file = fs.readFileSync(filename)
    return Cell.fromBoc(file)[0]
}

// function queryId (): BN {
//     return new BN(~~(Date.now() / 1000))
// }

// const TVM_EXIT_CODES = {
//     OK: 0,
//     noOp: 2000,
//     noBalance: 2001,
//     fakeAddr: 2002,
//     smallTrans: 2003,
//     smallFee: 2004,
//     noComment: 2005,
//     maxPrice: 2006
// }

describe('SmartContract main tests', () => {
    let smc: SmartContract
    const FREEZE = 0
    const SELF_ADDR = getRandSigner()
    const OPERATION_PRICE_TON = 0.5
    const A_SERVICE_FEE = 0.75
    const B_SERVICE_FEE = 0.75
    const MAX_PRICE_PERCENTAGE = 10
    const PROJECT_ADDR = getRandSigner()
    const LP_FEE_PERCENTAGE = 0.5

    const EMPTY_BODY = new CommonMessageInfo({ body: new CellMessage(new Builder().endCell()) })

    beforeEach(async () => {
        const dexCode = bocFileToTCell('./auto/main.func.code.boc')
        const minterCode = bocFileToTCell('./auto/jetton-minter.code.boc')
        const jwallCode = bocFileToTCell('./auto/jetton-wallet.code.boc')
        const data = encodeDexStorage(
            {
                freeze: FREEZE,
                operationPrice: toNano(OPERATION_PRICE_TON),
                aServiceFee: A_SERVICE_FEE,
                bServiceFee: B_SERVICE_FEE,
                maxPricePercentage: MAX_PRICE_PERCENTAGE,
                projectAddr: PROJECT_ADDR
            },
            { lpFeePercentage: LP_FEE_PERCENTAGE },
            minterCode,
            jwallCode
        )

        smc = await SmartContract.fromCell(dexCode, data)

        await smc.sendInternalMessage(new InternalMessage({
            to: SELF_ADDR,
            from: PROJECT_ADDR,
            value: toNano(0.3),
            bounce: true,
            body: EMPTY_BODY
        }))
    })

    describe('huy', () => {
        it('aboba', () => {
            expect(1).to.equal(1)
        })
    })
})
