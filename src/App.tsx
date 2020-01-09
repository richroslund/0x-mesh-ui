import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import './App.css';
import { WSClient, SignedOrder } from '@0x/mesh-rpc-client';
import { assetDataUtils } from '0x.js';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ZrxOrder } from './types';
import { OrderTable } from './OrderTable';
import { Grid, Container, Card, Item, Header } from 'semantic-ui-react';
import _ from 'lodash';
import { Staking } from './staking/Staking';
import { OrderInfo } from './OrderInfo';
import { CHAINID } from './config';
import { getZrx, Zrx } from './utilities/EngineUtil';
import { Setup } from './setup/Setup';
import { EthToWeth } from './setup/EthToWeth';
import { Navbar } from './nav/Navbar';
import { Trade } from './pages/Trade';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Stake } from './pages/Stake';

const SERVER_PORT = 60557;

export const App: React.FC<{}> = ({}) => {
  const meshClient1 = useRef<WSClient>();
  const zrx = useRef<Zrx>();
  useEffect(() => {
    const setup = async () => {
      zrx.current = await getZrx();
      console.log('address!', zrx.current?.address);
    }
    setup();
    

  }, []);
  const [orders, setOrders] = useState<{ buys: ZrxOrder[]; sells: ZrxOrder[] }>({ buys: [], sells: [] });
  useEffect(() => {
    const contractAddresses = getContractAddressesForChainOrThrow(CHAINID);
    const etherTokenAddress = contractAddresses.etherToken;
    const ethAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    const daiAssetData = assetDataUtils.encodeERC20AssetData('0x6b175474e89094c44da98b954eedeac495271d0f');
    meshClient1.current = new WSClient(`ws://localhost:60557`, { reconnectDelay: 2000 });
    meshClient1.current.getStatsAsync().then(stats => {
      console.log(stats);
    });
    setInterval(() => {
      meshClient1.current?.getOrdersAsync().then(res => {
        const ords = res.ordersInfos.filter(oi => oi.signedOrder.makerAssetData === ethAssetData || oi.signedOrder.takerAssetData === ethAssetData);
        const daiOrders = ords.filter(oi => [oi.signedOrder.takerAssetData, oi.signedOrder.makerAssetData].includes(daiAssetData));
        const ordsWithPrice = daiOrders.map(oi => {
          const { makerAssetAmount, makerAssetData, takerAssetAmount, takerAssetData, takerFee } = oi.signedOrder;
          
          let realPrice = takerAssetAmount.dividedBy(makerAssetAmount).toNumber();
          
          
          const isSell = makerAssetData === ethAssetData;
          let action = isSell ? 'sell':'buy';
          let price = isSell ? makerAssetAmount.dividedBy(takerAssetAmount).toNumber() : realPrice;
          const web3wrap = Web3Wrapper as any;
          const amount = web3wrap.toUnitAmount(oi.fillableTakerAssetAmount, 18).toNumber();
          const fee = web3wrap.toUnitAmount(takerFee, 18).toNumber();
          const feeAsset = isSell ? 'Dai' : 'Eth';
          return { price: 1 / price, 
            realPrice,
            daiPrice: price, action, id: oi.orderHash, amt: amount, ord: oi, fee, feeAsset, 
            takerToken: oi.signedOrder.takerAssetData === daiAssetData ? 'dai' : 'eth',
            makerToken: oi.signedOrder.takerAssetData === daiAssetData ? 'eth' : 'dai',
            signedOrder: {
            ...oi.signedOrder, 
            makerFeeAssetData: _.get(oi.signedOrder, 'makerFeeAssetData'), 
            takerFeeAssetData: _.get(oi.signedOrder, 'takerFeeAssetData'),
            
            chainId: CHAINID
          }};
        });
        const buys = ordsWithPrice
          .filter(o => o.action === 'buy')
          .sort((a, b) => a.price - b.price)
          .reverse();
        const sells = ordsWithPrice.filter(o => o.action === 'sell').sort((a, b) => a.price - b.price);
        // console.log('buys', buys);
        // console.log('sells', sells);
        setOrders({ buys, sells });
      });
    }, 2000);
  }, []);

  
  
  return (
    <Router>

    
    <div className="App">
      <Navbar>
      <Switch>
          <Route exact path="/">
            <Trade zrx={zrx.current} orders={orders} />
          </Route>
          <Route path="/stake">
            <Stake zrx={zrx.current} />
          </Route>
        </Switch>
       
        </Navbar>
    </div>
    </Router>
  );
};
