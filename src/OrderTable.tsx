
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZrxOrder } from './types';
import { Header, Table, Rating } from 'semantic-ui-react'
export const OrderTable: React.FC<{orders: ZrxOrder[]; onClick: (order: ZrxOrder) => void;}> = ({orders, onClick}) => {
    
    return (
        <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Id</Table.HeaderCell>
        <Table.HeaderCell>Price</Table.HeaderCell>
        <Table.HeaderCell>Amount</Table.HeaderCell>
        <Table.HeaderCell>Fee</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
    {orders.map((o) => (
            
            <Table.Row  key={o.id}>
            <Table.Cell><a title={o.id} onClick={() => onClick(o)}>{o.id.substr(0,10)+'...'}</a></Table.Cell>
            <Table.Cell>{o.price}</Table.Cell>
            <Table.Cell>{o.amt}</Table.Cell>
            <Table.Cell>{o.fee} {o.feeAsset}</Table.Cell>
          </Table.Row>
            ))}
      
      
    </Table.Body>

  </Table>
       

    )
}