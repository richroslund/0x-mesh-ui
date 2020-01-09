import { Item, Button } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Zrx } from '../utilities/EngineUtil';

export const EthToWeth: React.FC<{ zrx: Zrx }> = ({ zrx }) => {
  const [amount, setAmount] = useState('');

  const convert = useCallback(async () => {
    try {
      return await zrx.contracts.weth9.deposit().sendTransactionAsync({
        from: zrx.address,
        value: Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), 18),
      });
    } catch (ex) {
      console.error(ex);
    }
  }, [zrx, amount]);
  const handleAmountChange = useCallback(event => {
    setAmount(event.target.value);
  }, []);
  return (
    <Item>
      <Button onClick={convert}>Eth to Weth</Button>
      <input type="text" value={amount} onChange={handleAmountChange} />
    </Item>
  );
};
