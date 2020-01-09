import React, { useMemo, useEffect, useState } from "react"
import { Item, Header, Divider } from "semantic-ui-react"
import _ from "lodash"
import { ZrxOrder } from "./types"
import { Fill } from "./trading/Fill"
import { assetDataUtils, BigNumber } from "0x.js"
import { getZrx, Zrx } from "./utilities/EngineUtil"
import { Web3Wrapper } from "@0x/web3-wrapper"

export const OrderInfo: React.FC<{zrx: Zrx, order: ZrxOrder}> = ({order, zrx}) => {
  const {makerFeeAssetData, takerFeeAssetData} = order.signedOrder;
  const [makerFeeToken, setMakerFeeToken] = useState<string>();
  const [takerFeeToken, setTakerFeeToken] = useState<string>();
  const [validitiy, setValidity] = useState();
    const orderInfoFields = useMemo(() => ['makerFeeAssetData','takerFeeAssetData','senderAddress', 'makerAddress', 'takerAddress', 'makerFee', 'takerFee', 'makerAssetAmount', 'takerAssetAmount', 'makerAssetData', 'takerAssetData', 'salt', 'exchangeAddress', 'feeRecipientAddress', 'expirationTimeSeconds'], []);
    useEffect(() => {
      const isValid = async () => {
        const ordState = await zrx.contracts.devUtils.getOrderRelevantState(order.signedOrder, order.signedOrder.signature).callAsync();
        const [
          { orderStatus, orderHash },
          remainingFillableAmount,
          isValidSignature,
      ] = ordState;
      console.log(ordState);
      setValidity({orderStatus, orderHash, remainingFillableAmount: Web3Wrapper.toUnitAmount(remainingFillableAmount, 18).toNumber(), isValidSignature: isValidSignature ? 'valid':'invalid'});
      }
      const {tokens} = zrx;
          const makerTokenMatch = _.find(tokens, (t) => t.assetData === makerFeeAssetData);
          const takerTokenMatch = _.find(tokens, (t) => t.assetData === takerFeeAssetData);
          
          setMakerFeeToken(makerTokenMatch ? makerTokenMatch.name : 'UNKNOWN');
          setTakerFeeToken(takerTokenMatch ? takerTokenMatch.name : 'UNKNOWN');
          isValid();
    }, [order]);
    
    return (
      <>
        <Item.Group>
              {order && <Fill zrx={zrx} order={order}/>}
              </Item.Group>
              <Item.Group>
          <Item>
          <Item.Header>Validity</Item.Header>
            {validitiy && 
            <Item.Content>
              <p>{validitiy.orderStatus}</p>
              <p>{validitiy.orderHash}</p>
              <p>{validitiy.remainingFillableAmount}</p>
              <p>{validitiy.isValidSignature}</p>
            </Item.Content>
}
          </Item>
          <Divider></Divider>
                {order && (
                  <Item>
                    <Item.Content>
                      <Item.Header>
                        {order.action} {_.round(order.amt, 4)} @ ${_.round(order.price, 4)}
                      </Item.Header>
                      <Item.Description>
                        <p>Maker Fee: {makerFeeToken}</p>
                        <p>Taker Fee: {takerFeeToken}</p>
                        {order.fee}
                        {orderInfoFields.map(f => (
                          <p key={f}>{`${f}: ${_.get(order.ord.signedOrder, f)}`}</p>
                        ))}
                      </Item.Description>
                    </Item.Content>
                  </Item>
                )}
                
              </Item.Group>
              </>
    )
}