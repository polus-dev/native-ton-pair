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
        sender: Address,
        maybeForwardPayload: number,
        forwardPayload?: Cell,
        op: number = 0x7362d09c
    ): Cell {
        const msg = new Builder()
            .storeUint(op, 32)
            .storeUint(queryId, 64)
            .storeCoins(amount)
            .storeAddress(sender)
            .storeUint(maybeForwardPayload, 1)
        if (maybeForwardPayload) {
            msg.storeRef(forwardPayload)
        }
        return msg.endCell()
    }
}

export { MSG }
