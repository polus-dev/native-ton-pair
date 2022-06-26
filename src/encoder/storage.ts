import { Decimal } from 'decimal.js'
import { Address, Builder, Cell } from 'ton'
import BN from 'bn.js'

interface SwapParams {
    freeze: number
    operationPrice: BN
    aServiceFee: number
    bServiceFee: number
    maxPricePercentage: number
    projectAddr: Address
}

interface LpParams {
    lpFeePercentage: number
}

function encodeDexStorage (
    sParams: SwapParams,
    lParams: LpParams,
    minterCode: Cell,
    jwallCode: Cell
): Cell {
    const factor = new Decimal(1e9)
    const aServiceFee = new Decimal(sParams.aServiceFee).mul(factor).div(100).toNumber()
    const bServiceFee = new Decimal(sParams.bServiceFee).mul(factor).div(100).toNumber()
    const maxPricePercentage = new Decimal(sParams.maxPricePercentage)
        .mul(factor).div(100).toNumber()
    const lpFeePercentage = new Decimal(lParams.lpFeePercentage).mul(factor).div(100).toNumber()

    const swapCell = new Builder()
        .storeInt(sParams.freeze, 1)
        .storeCoins(new BN(0))
        .storeCoins(sParams.operationPrice)
        .storeCoins(new BN(0))
        .storeUint(aServiceFee, 32)
        .storeUint(bServiceFee, 32)
        .storeUint(maxPricePercentage, 32)
        .storeAddress(sParams.projectAddr)
        .storeBitArray([ 0, 0 ])
        .endCell()

    const lpCell = new Builder()
        .storeCoins(new BN(0))
        .storeCoins(new BN(0))
        .storeUint(lpFeePercentage, 32)
        .storeBitArray([ 0, 0 ])
        .storeBitArray([ 0, 0 ])
        .endCell()

    const storage = new Builder()
        .storeRef(swapCell)
        .storeRef(lpCell)
        .storeRef(minterCode)
        .storeRef(jwallCode)
        .endCell()
    return storage
}

export { encodeDexStorage }
