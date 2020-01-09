import { OrderInfo } from "@0x/mesh-rpc-client";
import { SignedOrder } from "0x.js";

export interface ZrxOrder {
    price: number; action: string; id: string; amt: any; ord: OrderInfo; fee: number; feeAsset: string;
    signedOrder: SignedOrder;
    takerToken: string;
    makerToken: string;
    daiPrice: number;
    realPrice: number;
  }
  