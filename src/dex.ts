import {
    Builder,
    Cell,
    BOC,
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
    lpWithdrawComission: number
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
    private storage: Cell

    constructor (code: Cell, workchain: number, storageData: DEXStorageOptions) {
        super(workchain, code)
        this.storage = ContractDEX.newStorage(storageData)
    }

    private static percentToInt (p: number) {
        return Math.round(p * 1000000000)
    }

    private static newStorage (options: DEXStorageOptions): Cell {
        const { swap, lp, codeData } = options

        const swapParams = new Builder()
            .storeCoins(new Coins(0)) // biton_balance
            .storeCoins(swap.operationPrice)
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
            .storeUint(ContractDEX.percentToInt(lp.lpWithdrawComission), 32)
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
