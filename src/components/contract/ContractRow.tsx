import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contract, ContractStatus } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import { getContactName } from '../../stores/contact/selectors';
import { RootState } from '../../stores/store';
import { formatLastUpdate } from '../../helpers/timestamp';
import { getUserName } from '../../stores/user/selectors';
import { getContractStatus } from '../../stores/contract/selectors';
import { formatStatus } from '../../helpers/activity';
import CompanyLink from '../company/CompanyLink';

interface Props extends RouteComponentProps {
  contract: Contract;
  contactName: string;
  assignedName: string;
  contractStatus: ContractStatus;
}

function ContractRow(props: Props) {
  const {
    contract, contactName, assignedName, contractStatus,
  } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/contract/${contract.id}`}>
          {`C${contract.id} ${contract.title}`}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <CompanyLink id={contract.companyId} />
      </Table.Cell>
      <Table.Cell>
        {contactName}
      </Table.Cell>
      <Table.Cell>
        {formatStatus(contractStatus)}
      </Table.Cell>
      <Table.Cell>
        {assignedName}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(contract.updatedAt)}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { contract: Contract }) => {
  return {
    companyName: getCompanyName(state, props.contract.companyId),
    contactName: getContactName(state, props.contract.contactId),
    assignedName: getUserName(state, props.contract.assignedToId),
    contractStatus: getContractStatus(state, props.contract.id),
  };
};

export default withRouter(connect(mapStateToProps)(ContractRow));
