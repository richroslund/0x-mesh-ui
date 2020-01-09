import React, { useEffect, FC } from 'react';
import { Zrx } from '../utilities/EngineUtil';
import { ERC20TokenContract } from '0x.js';
import { UNLIMITED_ALLOWANCE_IN_BASE_UNITS } from '../config';

export const Setup: FC<{ zrx: Zrx }> = ({ zrx }) => {
  useEffect(() => {
    const setup = async () => {
      const makerZRXApprovalTxHash = await new ERC20TokenContract(zrx.contracts.contractAddresses.zrxToken, zrx.provider).approve(zrx.contracts.contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE_IN_BASE_UNITS).sendTransactionAsync({ from: zrx.address });
      console.log(makerZRXApprovalTxHash);
    };
    setup();
  }, []);
  return <></>;
};
