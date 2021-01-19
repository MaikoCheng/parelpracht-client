import React, { useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ETCompany } from '../../helpers/extensiveTableObjects';
import ContractExtensiveRow from './ContractExtensiveRow';
import { RootState } from '../../stores/store';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import {
  changeSortTable,
  fetchTable,
  nextPageTable,
  prevPageTable,
  setTakeTable,
} from '../../stores/tables/actionCreators';
import TablePagination from '../TablePagination';

interface Props {
  companies: ETCompany[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;

  fetchContracts: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function ContractTableExtensive({
  companies, fetchContracts, column, direction, changeSort,
  total, fetched, skip, take,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchContracts();
  }, []);
  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Contract</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Invoiced</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Details</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {companies.map((c) => <ContractExtensiveRow company={c} key={c.id} />)}
        </Table.Body>
      </Table>
      <TablePagination
        countTotal={total}
        countFetched={fetched}
        skip={skip}
        take={take}
        nextPage={nextPage}
        prevPage={prevPage}
        setTake={setTake}
      />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const contractTable = getTable<ETCompany>(state, Tables.ETContracts);
  return {
    total: countTotal(state, Tables.ETContracts),
    fetched: countFetched(state, Tables.ETContracts),
    skip: contractTable.skip,
    take: contractTable.take,
    companies: contractTable.data,
    column: contractTable.sortColumn,
    direction: contractTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(fetchTable(Tables.ETContracts)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.ETContracts, column));
    dispatch(fetchTable(Tables.ETContracts));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.ETContracts, take));
    dispatch(fetchTable(Tables.ETContracts));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.ETContracts));
    dispatch(fetchTable(Tables.ETContracts));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.ETContracts));
    dispatch(fetchTable(Tables.ETContracts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractTableExtensive);
