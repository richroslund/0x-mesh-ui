import { ContractWrappers } from '@0x/contract-wrappers';
import { getProvider } from "../ProviderEngine";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { CHAINID, ADDRESSES } from "../config";
import { assetDataUtils, Web3ProviderEngine } from '0x.js';

export const getZrx = async (): Promise<Zrx|undefined> => {
    const provider = await getProvider();
    if(provider) {
        const web3 = new Web3Wrapper(provider);
        const contracts = new ContractWrappers(provider, { chainId: CHAINID });
        const [acct]=  await web3.getAvailableAddressesAsync();
        const tokens = [
             {name: 'zrx', address: contracts.contractAddresses.zrxToken},
             {name: 'eth', address: contracts.contractAddresses.etherToken},
            
            {name: 'dai', address:  ADDRESSES.dai},
        ].map(t => ({...t, assetData: assetDataUtils.encodeERC20AssetData(t.address)}));
        return {
            address: acct,
            web3, contracts, provider,
            tokens
        }
    } else {
        return undefined;
    }
    
}
export interface Zrx {
    address: string;
    web3: Web3Wrapper;
    contracts: ContractWrappers;
    provider: Web3ProviderEngine;
    tokens: {
        assetData: string;
        name: string;
        address: string;
    }[];
};