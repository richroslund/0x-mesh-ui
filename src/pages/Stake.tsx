import { Header, Grid, Container, Segment, Input } from 'semantic-ui-react';

import React, { useState, useEffect, useCallback } from 'react';

import { Staking } from '../staking/Staking';

import { EthToWeth } from '../setup/EthToWeth';

import { Zrx } from '../utilities/EngineUtil';
import { getStakingContract } from '../staking/stake';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { toNumber } from '../utilities/utils';

interface PoolInfo {
  id: string;
  staked: {
    currentEpoch: number;
    currentEpochBalance: number;
    nextEpochBalance: number;
  };
  rewards: {
    feesCollected: number;
    weightedStake: number;
    membersStake: number;
  };
  operator: string;
  operatorShare: number;
}
export const Stake: React.FC<{ zrx: Zrx | undefined }> = ({ zrx }) => {
  const [poolId, setPoolId] = useState();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [pool, setPool] = useState<PoolInfo>();
  useEffect(() => {
    if (zrx) {
      const stakingContract = getStakingContract(zrx, zrx.address);
      stakingContract
        .poolIdByMaker(zrx.address)
        .callAsync()
        .then(id => {
          setPoolId(id);
        });
    }
  }, [zrx]);
  useEffect(() => {
    const loadData = async () => {
      if (zrx && poolId) {
        const stakingContract = getStakingContract(zrx, zrx.address);

        const stakedValue = await stakingContract.getTotalStakeDelegatedToPool(poolId).callAsync();
        const rewards = await stakingContract
          .getStakingPoolStatsThisEpoch(poolId)
          .callAsync()
          .then(re => {
            return {
              feesCollected: toNumber(re.feesCollected),
              weightedStake: toNumber(re.weightedStake),
              membersStake: toNumber(re.membersStake),
            };
          });
        const { operator, operatorShare } = await stakingContract.getStakingPool(poolId).callAsync();
        const opShare = (operatorShare as any).toNumber() / 1000000;
        setPool({
          id: poolId,
          staked: {
            currentEpoch: toNumber(stakedValue.currentEpoch),
            currentEpochBalance: toNumber(stakedValue.currentEpochBalance),
            nextEpochBalance: toNumber(stakedValue.nextEpochBalance),
          },
          rewards,
          operator,
          operatorShare: opShare,
        });
      }
    };
    loadData();
  }, [zrx, poolId]);
  const handlePoolIdChange = useCallback(event => setPoolId(event.target.value), []);
  return (
    <Container style={{ padding: '5em 0em' }}>
      <Header as="h2">Staking</Header>
      <Grid columns={3} divided>
        <Grid.Row>
          <Segment attached tertiary>
            <Input fluid type="text" value={poolId} onChange={handlePoolIdChange} placeholder={`PoolId`} />
          </Segment>
        </Grid.Row>
        {pool && (
          <Grid.Row>
            {/* <Segment attached>Current Epoch: {pool.staked.currentEpoch}</Segment> */}
            <Segment.Group>
              <Segment attached>PoolId: {poolId}</Segment>
              <Segment attached>Operator: {pool.operator}</Segment>
              <Segment attached>OperatorShare: {pool.operatorShare}</Segment>
              <Segment attached>Current Epoch staked: {pool.staked.currentEpochBalance}</Segment>
              <Segment attached>Next Epoch staked: {pool.staked.nextEpochBalance}</Segment>
            </Segment.Group>
            <Segment attached>
              Rewards:
              <Segment attached>FeesCollected: {pool.rewards.feesCollected}</Segment>
              <Segment attached>WeightedStake: {pool.rewards.weightedStake}</Segment>
              <Segment attached>MembersStake: {pool.rewards.membersStake}</Segment>
            </Segment>
          </Grid.Row>
        )}
        <Grid.Row>
          {addresses.length > 0 && (
            <Header as="h4" attached="top" block>
              Addresses
            </Header>
          )}
          {addresses.map(a => (
            <Segment attached key={a}>
              {a}
            </Segment>
          ))}
        </Grid.Row>
        <Grid.Row>{zrx && <Staking zrx={zrx}></Staking>}</Grid.Row>
      </Grid>
    </Container>
  );
};
