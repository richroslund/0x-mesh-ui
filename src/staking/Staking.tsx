import { Item, Button, Input } from 'semantic-ui-react';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Web3ProviderEngine, BigNumber } from '0x.js';
import { getProvider } from '../ProviderEngine';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractWrappers, ERC20TokenContract, StakingContract } from '@0x/contract-wrappers';
import { Zrx } from '../utilities/EngineUtil';
import { fill } from 'lodash';
import { stakeZrx } from './stake';
import { NIL_POOL_ID } from '../config';

const getStakingContract = (contractWrapper: ContractWrappers, provider: Web3ProviderEngine, address: string) => {
  return new StakingContract(contractWrapper.contractAddresses.stakingProxy, provider, {
    from: address,
  });
};

export const Staking: React.FC<{ zrx: Zrx }> = ({ zrx }) => {
  const [poolId, setPoolId] = useState();

  const createStakingPool = useCallback(async () => {
    try {
      const stakingContract = getStakingContract(zrx.contracts, zrx.provider, zrx.address);

      const operatorSharePpm = new BigNumber(950000); // 95 %

      const createPool = await stakingContract.createStakingPool(operatorSharePpm, true).awaitTransactionSuccessAsync({
        from: zrx.address,
      });
      const createStakingPoolLog = createPool.logs[0];
      console.log('created pool', createStakingPoolLog);
      setPoolId((createStakingPoolLog as any).args.poolId);
    } catch (ex) {
      console.error(ex);
    }
  }, [zrx]);
  const [amount, setAmount] = useState('');
  const amountChange = useCallback(
    event => {
      setAmount(event.target.value);
    },
    [setAmount]
  );
  const stake = useCallback(() => {
    const stakeAmt = parseFloat(amount);
    if (stakeAmt && stakeAmt > 0) {
      stakeZrx(zrx, poolId, stakeAmt, NIL_POOL_ID);
    } else {
      console.warn('stakeAmt is', stakeAmt);
    }
  }, [amount, zrx]);
  return (
    <Item>
      <Item.Content>
        <Item.Description>
          <Button onClick={createStakingPool}>Create Staking Pool</Button>
        </Item.Description>
        {poolId && (
          <Item.Description>
            <Input type="text" value={amount} onChange={amountChange} placeholder={`amount of zrx to stake`} />
            <Button onClick={stake}>Stake zrx</Button>
          </Item.Description>
        )}
      </Item.Content>
    </Item>
  );
};
