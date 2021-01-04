import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Dropdown, Flag, Icon, Loader, Menu,
} from 'semantic-ui-react';
import { AuthStatus, Roles, User } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { authLogout } from '../../stores/auth/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;

  profile: User | undefined;
  profileStatus: ResourceStatus;

  logout: () => void;
}

function AuthMenu(props: Props) {
  const { t, i18n } = useTranslation();

  if (props.status !== ResourceStatus.FETCHED || props.authStatus === undefined
    || props.profileStatus !== ResourceStatus.FETCHED || props.profile === undefined) {
    return (
      <Menu.Item position="right" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Loader inline active size="small" style={{ marginLeft: '3em', marginRight: '3em' }} />
      </Menu.Item>
    );
  }
  const name = formatContactName(
    props.profile.firstName,
    props.profile.middleName,
    props.profile.lastName,
  );

  const isAdmin = props.profile.roles.find((r) => r.name === Roles.ADMIN) !== undefined;

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    console.log(`change language to ${lng}`);
  };

  return (
    <Menu.Menu position="right">
      <Dropdown
        text={(
          <>
            <Icon name="user circle" style={{ marginRight: '1em' }} />
            {name}
          </>
        ) as any}
        item
        className="icon"
      >
        <Dropdown.Menu>
          {isAdmin ? (
            <Dropdown.Item as={NavLink} to="/user">
              <Icon name="users" />
              {t('users')}
            </Dropdown.Item>
          ) : null}
          <Dropdown.Item onClick={props.logout}>
            <Icon name="sign-out" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown
        text={(
          <>
            <Icon name="globe" />
          </>
        ) as any}
        item
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => changeLanguage('en')}
          >
            <Flag name="united kingdom" />
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => changeLanguage('nl')}
          >
            <Flag name="netherlands" />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    authStatus: state.auth.authStatus,
    status: state.auth.status,
    profile: state.auth.profile,
    profileStatus: state.auth.profileStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(authLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthMenu);
