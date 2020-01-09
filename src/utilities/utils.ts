import { SignedOrder } from '@0x/mesh-rpc-client';

import { BigNumber } from '0x.js';
import { TX_DEFAULTS } from '../config';
import { Web3Wrapper } from '@0x/web3-wrapper';

export const calculateProtocolFee = (orders: SignedOrder[], gasPrice: BigNumber | number = TX_DEFAULTS.gasPrice): BigNumber => {
  return new BigNumber(150000).times(gasPrice).times(orders.length);
};
export const toNumber = (val: BigNumber, decimals = 18) => {
  return Web3Wrapper.toUnitAmount(val, decimals).toNumber();
};
