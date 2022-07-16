import {
    Builder,
    Cell,
    Address,
    Contracts,
    Coins
} from 'ton3'

interface IDexSwap {
    operationPrice: Coins
    aServiceFee: number
    bServiceFee: number
    maxPricePercentage: number
    project: Address
}

interface IDexLP {
    lpFeePercentage: number
}

interface IDexCodeData {
    jettonMinterCode: Cell
    jettonWalletCode: Cell
}

interface DEXStorageOptions {
    swap: IDexSwap
    lp: IDexLP
    codeData: IDexCodeData
}

class ContractDEX extends Contracts.ContractBase {
    constructor (code: Cell, workchain: number, storageData: DEXStorageOptions) {
        const storage = ContractDEX.newStorage(storageData)
        super(workchain, code, storage)
    }

    public deployMessage (): Cell {
        return new Contracts.MessageExternalIn(
            { dest: this.address },
            { state: this.state }
        ).cell()
    }

    private static percentToInt (p: number) {
        return Math.round((p * 1000000000) / 100)
    }

    private static newStorage (options: DEXStorageOptions): Cell {
        const { swap, lp, codeData } = options

        const swapParams = new Builder()
            .storeInt(0, 1) // freeze
            .storeCoins(new Coins(0)) // biton_balance
            .storeCoins(swap.operationPrice) // operation price
            .storeCoins(new Coins(0)) // service_collect_fee
            .storeUint(ContractDEX.percentToInt(swap.aServiceFee), 32)
            .storeUint(ContractDEX.percentToInt(swap.bServiceFee), 32)
            .storeUint(ContractDEX.percentToInt(swap.maxPricePercentage), 32)
            .storeAddress(swap.project)
            .storeAddress(Address.NONE)

        const lpParams = new Builder()
            .storeCoins(new Coins(0)) // lp_total_supply
            .storeCoins(new Coins(0)) // lp_collect_fee
            .storeUint(ContractDEX.percentToInt(lp.lpFeePercentage), 32)
            .storeAddress(Address.NONE) // lp_jwall_addr
            .storeAddress(Address.NONE) // lp_minter_addr

        const storage = new Builder()
            .storeRef(swapParams.cell())
            .storeRef(lpParams.cell())
            .storeRef(codeData.jettonMinterCode)
            .storeRef(codeData.jettonWalletCode)

        return storage.cell()
    }
}

export { ContractDEX }
