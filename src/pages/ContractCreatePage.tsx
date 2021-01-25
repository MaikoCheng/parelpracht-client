import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Contract } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';

interface SelfProps extends RouteComponentProps<{companyId?: string}> {
}

interface Props extends SelfProps {
  status: ResourceStatus;

  clearContract: () => void;
}

class ContractCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearContract();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.goBack(); };

  public render() {
    let compId = 0;
    let unknownCompany: boolean = true;

    if (this.props.match.params.companyId) {
      compId = parseInt(this.props.match.params.companyId, 10);
      unknownCompany = false;
    }
    const contract: Contract = {
      id: 0,
      companyId: compId,
      contactId: 0,
      comments: '',
      title: '',
    } as Contract;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Segment>
          <AlertContainer />
          <ContractProps
            contract={contract}
            create
            companyPredefined={unknownCompany}
            onCancel={this.close}
          />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
  clearContract: () => dispatch(clearSingle(SingleEntities.Contract)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractCreatePage));
