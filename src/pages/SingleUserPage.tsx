import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { User } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import UserProps from '../components/user/UserProps';
import ResourceStatus from '../stores/resourceStatus';
import UserSummary from '../components/user/UserSummary';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { formatContactName } from '../helpers/contact';

interface Props extends RouteComponentProps<{ userId: string }> {
  user: User | undefined;
  status: ResourceStatus;

  fetchUser: (id: number) => void;
  clearUser: () => void;
}

class SingleUserPage extends React.Component<Props> {
  componentDidMount() {
    const { userId } = this.props.match.params;

    this.props.clearUser();
    this.props.fetchUser(Number.parseInt(userId, 10));
  }

  public render() {
    const { user } = this.props;

    return (
      <Container style={{ paddingTop: '2em' }}>
        <Breadcrumb
          icon="right angle"
          sections={[
            { key: 'Users', content: <NavLink to="/user">Users</NavLink> },
            {
              key: 'User',
              content: user
                ? formatContactName(user.firstName, user.middleName, user.lastName)
                : '',
              active: true,
            },
          ]}
        />
        <UserSummary />
        <Grid columns={2}>
          <Grid.Column>
            {user ? (
              <Segment>
                <UserProps user={user} />
              </Segment>
            ) : <Segment placeholder />}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: getSingle<User>(state, SingleEntities.User).data,
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleUserPage));
