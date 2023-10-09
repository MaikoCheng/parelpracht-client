import * as React from 'react';
import {
  Dimmer,
  Header,
  Loader,
  Modal, Segment, Table,
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Contact, ContactFunction, ContractStatus, Gender,
} from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import store, { RootState } from '../stores/store';
import ContactProps from '../components/entities/contact/ContactProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { formatContactName } from '../helpers/contact';
import { formatStatus } from '../helpers/activity';
import { getContractStatus } from '../stores/contract/selectors';
import CompanyLink from '../components/entities/company/CompanyLink';
import { useTitle } from '../components/TitleContext';
import { useEffect } from 'react';
import { usePrevious } from '../usePrevious';
import { JSX } from 'react/jsx-runtime';

interface Props {
  create?: boolean;
  onCompanyPage: boolean;
}

export default function ContactModal(props: Props) {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  let contact = useSelector<RootState, Contact>(state => state.single.Contact.data);
  const status = useSelector<RootState, ResourceStatus>(state => state.single.Contact.status);
  const getStatus = (id: number): ContractStatus => getContractStatus(store.getState(), id);

  const previous = usePrevious({ contact, status });

  let contactId: number | undefined = params.contactId ? parseInt(params.contactId, 10) : undefined;
  let companyId: number | undefined = params.companyId ? parseInt(params.companyId, 10) : undefined;

  const closeWithPopupMessage = () => {
    // If the modal is not opened on a company page, we cannot refresh the company information
    if (companyId !== undefined) {
      dispatch(fetchSingle(SingleEntities.Company, companyId));
    }

    if (companyId === undefined) {
      navigate('/contact');
    } else {
      navigate(`/company/${companyId}`);
    }
  };

  const close = () => {
    if (companyId !== undefined) {
      dispatch(fetchSingle(SingleEntities.Company, companyId));
    }
    navigate(-1);
  };

  useEffect(() => {
    // TODO this does not work
    if (props.create) {
      setTitle(t('entities.contact.newContact'));
    } else if (contact === undefined) {
      setTitle(t('entity.contact'));
    } else {
      setTitle(formatContactName(contact.firstName, contact.lastName, contact.lastName));
    }

    dispatch(clearSingle(SingleEntities.Contact));

    if (!props.create && contactId !== undefined) {
      dispatch(fetchSingle(SingleEntities.Contact, contactId));
    }
  }, []);

  useEffect(() => {
    // if (props.create) {
    //   setTitle(t('entities.contact.newContact'));
    // } else if (contact === undefined) {
    //   setTitle(t('entity.contact'));
    // } else {
    //   setTitle(formatContactName(contact.firstName, contact.lastName, contact.lastName));
    // }

    if (status === ResourceStatus.FETCHED && previous.status === ResourceStatus.SAVING) {
      closeWithPopupMessage();
    }

    if (status === ResourceStatus.EMPTY && previous.status === ResourceStatus.DELETING) {
      // TODO does not work, status not updated on delete
      closeWithPopupMessage();

      dispatch(showTransientAlert({
        title: 'Success',
        message: `Contact ${formatContactName(
          previous.contact.firstName,
          previous.contact.lastNamePreposition,
          previous.contact.lastName,
        )} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      }));
    }
  }, [status]);

  if (props.create) {
    // TODO TYPE
    contact = {
      id: 0,
      firstName: '',
      lastNamePreposition: '',
      lastName: '',
      gender: Gender.UNKNOWN,
      email: '',
      telephone: '',
      comments: '',
      function: ContactFunction.NORMAL,
      companyId,
    } as unknown as Contact;
  }

  if (contact === undefined) {
    return (
      <Modal
        onClose={close}
        closeIcon
        open
        dimmer="blurring"
        size="tiny"
      >
        <Segment placeholder attached="bottom">
          <AlertContainer/>
          <Dimmer active inverted>
            <Loader/>
          </Dimmer>
        </Segment>
      </Modal>
    );
  }

  let contractOverview: JSX.Element;
  if (props.create) {
    contractOverview = <></>;
  } else if (contact.contracts === undefined || contact.contracts.length === 0) {
    contractOverview = <p>{t('entities.product.noContract')}</p>;
  } else {
    contractOverview = (
        <Segment>
          <Header>{t('entity.contracts')}</Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {t('entities.contract.props.title')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('entity.company')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('entities.generalProps.status')}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contact.contracts.map((contract) => {
                return (
                  <Table.Row key={contract.id}>
                    <Table.Cell>
                      <NavLink to={`/contract/${contract.id}`}>{contract.title}</NavLink>
                    </Table.Cell>
                    <Table.Cell>
                      <CompanyLink id={contract.companyId}/>
                    </Table.Cell>
                    <Table.Cell>
                      {formatStatus(getStatus(contract.id))}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Segment>
    );
  }

  return (
      <Modal
        onClose={close}
        open
        closeIcon
        dimmer="blurring"
        size="tiny"
      >
        <Segment attached="bottom">
          <AlertContainer/>
          <ContactProps
            onCompanyPage={props.onCompanyPage}
            contact={contact}
            create={props.create}
            onCancel={close}
          />
          {contractOverview}
        </Segment>
      </Modal>
  );
}

