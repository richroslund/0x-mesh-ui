import { Item, Button, Input } from 'semantic-ui-react';
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ZrxOrder } from '../types';
import { calculateProtocolFee } from '../utilities/utils';
import { TX_DEFAULTS } from '../config';
import { Zrx } from '../utilities/EngineUtil';
import _ from 'lodash';

const fillOrder = async (zrx: Zrx, order: ZrxOrder, address: string, amount: number, decimals = 18) => {
  const fillOrderCall = zrx.contracts.exchange.fillOrder(order.signedOrder, Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), decimals), order.ord.signedOrder.signature);
  console.log('fillOrder', fillOrderCall);

  const txHash = await fillOrderCall.awaitTransactionSuccessAsync({
    from: address,
    ...TX_DEFAULTS,
    value: calculateProtocolFee([order.ord.signedOrder]),
  });
  console.log('txHash', txHash);
};
export const Fill: React.FC<{ zrx: Zrx; order: ZrxOrder }> = ({ zrx, order }) => {
  const [fillAmount, setFillAmount] = useState('');
  useEffect(() => {
    setFillAmount('');
  }, [order]);
  const fill = useCallback(async () => {
    try {
      fillOrder(zrx, order, zrx.address, parseFloat(fillAmount));
    } catch (ex) {
      console.error(ex);
    }
  }, [zrx, fillAmount]);
  const handleFillAmountChange = useCallback(event => {
    setFillAmount(event.target.value);
  }, []);
  const result = useMemo(() => {
    const userAction = order.action === 'buy' ? 'sell' : 'buy';
    const amt = parseFloat(fillAmount);
    if (_.isNumber(amt) && !_.isNaN(amt) && amt > 0) {
      const takerAmountTotal = Web3Wrapper.toUnitAmount(order.signedOrder.takerAssetAmount, 18).toNumber();
      const makerAmount = Web3Wrapper.toUnitAmount(order.signedOrder.makerAssetAmount, 18).toNumber();
      const makerAmountTotal = (amt / takerAmountTotal) * makerAmount;

      return `${userAction} ${fillAmount} ${order.takerToken} for ${makerAmountTotal} ${order.makerToken}`;
    }
  }, [fillAmount, order]);

  return (
    <Item>
      <Item.Content>
        <Item.Header>Trade</Item.Header>

        <Item.Description>
          <Input type="text" value={fillAmount} onChange={handleFillAmountChange} placeholder={`${order.takerToken}`} />
          <Button onClick={fill}>Fill order</Button>
        </Item.Description>
        <Item.Meta>{result}</Item.Meta>
      </Item.Content>
    </Item>
  );
};
