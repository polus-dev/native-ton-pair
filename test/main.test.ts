import { SmartContract } from 'ton-contract-executor'
import { Builder, Cell } from 'ton'

describe('Main tests', () => {
    let contract: SmartContract

    beforeEach(() => {
        const dexCode = Cell.fromBoc('')

        const initStorage = new Builder()
        const swapParams = new Builder()
        swapParams.storeCoins(0)    // biton_balance
            .storeCoins(100) // operation_price
            .storeCoins(0) // service_collect_fee
            .storeUint(10, 32) // a-service-fee
            .storeUint(10, 32) // b-service-fee
            .storeUint(50, 10) // max-price-percentage

        contract = new SmartContract.fromCell(dexCode)
    })
})
