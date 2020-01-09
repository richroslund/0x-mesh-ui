import { SignerSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { MetamaskSubprovider } from '0x.js';

export const getProvider = async () => {
// Create a Web3 Provider Engine
const providerEngine = new Web3ProviderEngine();
// Compose our Providers, order matters
// Use the SignerSubprovider to wrap the browser extension wallet
// All account based and signing requests will go through the SignerSubprovider
const wind: any = window;

let injectedProviderIfExists = (window as any).ethereum;
if (injectedProviderIfExists !== undefined) {
    if (injectedProviderIfExists.enable !== undefined) {
        try {
            await injectedProviderIfExists.enable();
        } catch (err) {
            console.log(err);
        }
    }
} else {
    const injectedWeb3IfExists = (window as any).web3;
    if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
        injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
    } else {
        return undefined;
    }
}
if(injectedProviderIfExists) {
    providerEngine.addProvider(new MetamaskSubprovider(injectedProviderIfExists));
    providerEngine.addProvider(new RPCSubprovider('https://mainnet.infura.io/'));
}

providerEngine.start();

    // Get all of the accounts via Web3Wrapper
    return providerEngine;

}
