import * as React from 'react';
import {
  Modal,
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Company, CompanyStatus, Roles } from '../clients/server.generated';
import { clearSingle } from '../stores/single/actionCreators';
import CompanyProps from '../components/entities/company/CompanyProps';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { useTitle } from '../components/TitleContext';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../stores/store';
import { usePrevious } from '../usePrevious';
import ResourceStatus from '../stores/resourceStatus';


export default function CompaniesCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  const status = useSelector<RootState, ResourceStatus>(state => state.single.Company.status);
  const previous = usePrevious({ status });

  // TODO typing
  const company = {
    id: 0,
    name: '',
    description: '',
    phoneNumber: '',
    status: CompanyStatus.ACTIVE,
    comments: '',
    addressStreet: '',
    addressCity: '',
    addressPostalCode: '',
    addressCountry: '',
  };

  const close = () => navigate(-1);

  useEffect(() => {
    dispatch(clearSingle(SingleEntities.Company));
    setTitle(t('pages.settings.title'));
  }, []);

  useEffect(() => {
    if (previous.status === ResourceStatus.SAVING && status === ResourceStatus.FETCHED) {
      navigate('/company');
      dispatch(showTransientAlert({
        title: 'Success',
        message: 'Company successfully created',
        type: 'success',
        displayTimeInMs: 3000,
      }));
    }
  }, [status]);

  return (
    <Modal
      onClose={close}
      open
      closeIcon
      dimmer="blurring"
      closeOnDimmerClick={false}
    >
      <Modal.Content>
        <AlertContainer />
        <Modal.Description>
          <CompanyProps
            company={company}
            create
            onCancel={close}
            canEdit={[Roles.ADMIN, Roles.GENERAL]}
            canDelete={[Roles.ADMIN]}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}