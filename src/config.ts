import { BigNumber } from "0x.js";

export const TX_DEFAULTS = { gas: 800000, gasPrice: 1000000000 };
export const CHAINID = 1;
export const ADDRESSES = {
    dai: '0x6b175474e89094c44da98b954eedeac495271d0f'
}
export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
export const DECIMALS = 18;
export enum StakeStatus {
    Undelegated,
    Delegated,
}
export const NIL_POOL_ID = '0x0000000000000000000000000000000000000000000000000000000000000000';