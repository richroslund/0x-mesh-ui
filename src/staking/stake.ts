import { StakingContract } from '@0x/contract-wrappers';
import { Zrx } from '../utilities/EngineUtil';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber, ERC20TokenContract } from '0x.js';
import { DECIMALS, StakeStatus, NIL_POOL_ID, TX_DEFAULTS, UNLIMITED_ALLOWANCE_IN_BASE_UNITS } from '../config';

export const getStakingContract = (zrx: Zrx, address: string) => {
  return new StakingContract(zrx.contracts.contractAddresses.stakingProxy, zrx.provider, {
    from: address,
  });
};

export const approveZrxForStaking = async (zrx: Zrx) => {
  const zrxTokenContract = new ERC20TokenContract(zrx.contracts.contractAddresses.zrxToken, zrx.provider, { from: zrx.address });
  return await zrxTokenContract.approve(zrx.contracts.contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE_IN_BASE_UNITS).awaitTransactionSuccessAsync({ from: zrx.address });
};

export const deposit = async (zrx: Zrx, amount: number) => {
  const stakingContract = getStakingContract(zrx, zrx.address);
  const stakeAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), DECIMALS);
  return await stakingContract.stake(stakeAmount).sendTransactionAsync({ from: zrx.address });
};

export const stakeZrx = async (zrx: Zrx, poolId: string, amount: number, fromPoolId: string) => {
  const stakingContract = getStakingContract(zrx, zrx.address);
  const stakeAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), DECIMALS);
  const transactionDetails = { from: zrx.address, ...TX_DEFAULTS };
  const stakeWithPool = await stakingContract.moveStake({ status: StakeStatus.Undelegated, poolId: fromPoolId }, { status: StakeStatus.Delegated, poolId }, stakeAmount).awaitTransactionSuccessAsync(transactionDetails);
  return stakeWithPool;
};
