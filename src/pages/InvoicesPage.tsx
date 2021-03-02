import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import InvoicesTable from '../components/invoice/InvoiceTable';
import InvoiceTableControls from '../components/invoice/InvoiceTableControls';
import { Client } from '../clients/server.generated';
import { fetchTable } from '../stores/tables/actionCreators';
import { Tables } from '../stores/tables/tables';

interface Props extends RouteComponentProps {
  refresh: () => void;
}

class InvoicesPage extends React.Component<Props> {
  updateTreasurerLastSeen = async () => {
    const { refresh } = this.props;
    const client = new Client();
    await client.updateLastSeenByTreasurer();
    await refresh();
  };

  render() {
    return (
      <>
        <Segment style={{ backgroundColor: '#eee' }} vertical basic>
          <Container style={{ paddingTop: '2em' }}>
            <Grid columns={2}>
              <Grid.Column>
                <Header as="h1">
                  <Icon name="file alternate" />
                  <Header.Content>
                    <Header.Subheader>Invoices</Header.Subheader>
                    All Invoices
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Button icon labelPosition="left" primary floated="right" onClick={() => this.updateTreasurerLastSeen()}>
                  <Icon name="eye" />
                  Update Last Seen
                </Button>
              </Grid.Column>
            </Grid>

            <InvoiceTableControls />

          </Container>
        </Segment>
        <Container>
          <InvoicesTable />
        </Container>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Invoices)),
});

export default withRouter(connect(null, mapDispatchToProps)(InvoicesPage));
