import { Builder, Address, Cell } from 'ton'
import BN from 'bn.js'

class MSG {
    /*
        transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
                 response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                 forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
                 = InternalMsgBody;
    */

    public static transfer (
        queryId: BN,
        amount: BN,
        destination: Address,
        responseDestination: Address,
        maybeCustomPayload: number,
        customPayload: Cell,
        forwardTonAmount: BN,
        maybeForwardPayload: number,
        forwardPayload: Cell,
        op: number = 0x0f8a7ea5
    ): Cell {
        const msg = new Builder()
            .storeUint(op, 32)
            .storeUint(queryId, 64)
            .storeCoins(amount)
            .storeAddress(destination)
            .storeAddress(responseDestination)
            .storeUint(maybeCustomPayload, 1)
        if (maybeCustomPayload) {
            msg.storeRef(customPayload)
        }
        msg.storeCoins(forwardTonAmount)
        msg.storeUint(maybeForwardPayload, 1)
        if (maybeForwardPayload) {
            msg.storeRef(forwardPayload)
        }
        return msg.endCell()
    }
}

export { MSG }
