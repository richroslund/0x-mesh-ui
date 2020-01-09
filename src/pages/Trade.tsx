import { Header, Grid } from 'semantic-ui-react';
import React, { useState, useCallback } from 'react';
import { OrderTable } from '../OrderTable';
import { ZrxOrder } from '../types';
import { Zrx } from '../utilities/EngineUtil';
import { OrderInfo } from '../OrderInfo';
export const Trade: React.FC<{
  zrx: Zrx | undefined;
  orders: {
    buys: ZrxOrder[];
    sells: ZrxOrder[];
  };
}> = ({ zrx, orders }) => {
  const [active, setActive] = useState<ZrxOrder>();
  const onOrderClick = useCallback((o: ZrxOrder) => setActive(o), [setActive]);
  return (
    <>
      <Header>Mesh</Header>
      <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column>
            <h3>Buys</h3>
            <OrderTable orders={orders.buys} onClick={onOrderClick} />
          </Grid.Column>
          <Grid.Column>
            <h3>Sells</h3>
            <OrderTable orders={orders.sells} onClick={onOrderClick} />
          </Grid.Column>
          <Grid.Column width={1}>{active && zrx && <OrderInfo zrx={zrx} order={active} />}</Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};
