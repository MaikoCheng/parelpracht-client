import React, {
  ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox,
  Form, Input, TextArea,
} from 'semantic-ui-react';
import { Company, CompanyParams, CompanyStatus } from '../../clients/server.generated';
import { createSingle, saveSingle } from '../../stores/single/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  company: Company;
  status: ResourceStatus;

  saveCompany: (id: number, company: CompanyParams) => void;
  createCompany: (company: CompanyParams) => void;
}

interface State {
  editing: boolean;
  name: string;
  comments: string | undefined;
  phoneNumber: string | undefined;
  status: CompanyStatus;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  addressCountry: string;
}

class CompanyProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  extractState = (props: Props) => {
    const { company } = props;
    return {
      name: company.name,
      comments: company.comments,
      phoneNumber: company.phoneNumber,
      status: company.status,
      addressStreet: company.addressStreet,
      addressPostalCode: company.addressPostalCode,
      addressCity: company.addressCity,
      addressCountry: company.addressCountry,
      updatedAt: company.updatedAt,
    };
  };

  toParams = (): CompanyParams => {
    return new CompanyParams({
      name: this.state.name,
      comments: this.state.comments,
      phoneNumber: this.state.phoneNumber,
      status: this.state.status,
      addressStreet: this.state.addressStreet,
      addressPostalCode: this.state.addressPostalCode,
      addressCity: this.state.addressCity,
      addressCountry: this.state.addressCountry,
    });
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  save = () => {
    if (this.props.create) {
      this.props.createCompany(this.toParams());
    } else {
      this.props.saveCompany(this.props.company.id, this.toParams());
    }
  };

  render() {
    const {
      editing,
      name,
      comments,
      phoneNumber,
      status,
      addressStreet,
      addressPostalCode,
      addressCity,
      addressCountry,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New Company' : 'Details'}

          <PropsButtons
            editing={editing}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-name"
              fluid
              control={Input}
              label="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                name: e.target.value,
              })}
            />
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-comments">
                Comments
              </label>
              <TextArea
                id="form-input-comments"
                value={comments}
                onChange={(e) => this.setState({ comments: e.target.value })}
                placeholder="Comments"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-phone-number"
              fluid
              control={Input}
              label="Telephone Number"
              value={phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                phoneNumber: e.target.value,
              })}
            />
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-check-status">
                Status
              </label>
              <Checkbox
                disabled={!editing}
                toggle
                id="form-check-status"
                label={status === CompanyStatus.ACTIVE ? 'Active' : 'Inactive'}
                checked={status === CompanyStatus.ACTIVE}
                onChange={(_, data) => this.setState({
                  status:
                    data.checked ? CompanyStatus.ACTIVE : CompanyStatus.INACTIVE,
                })}
              />
            </Form.Field>
          </Form.Group>
          <h2>
            Address Information
          </h2>
          <Form.Group widths="equal">
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-address-street">
                Street and number
              </label>
              <TextArea
                id="form-input-address-street"
                value={addressStreet}
                onChange={(e) => this.setState({ addressStreet: e.target.value })}
                placeholder="Street and number"
              />
            </Form.Field>
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-address-city">
                City
              </label>
              <TextArea
                id="form-input-address-city"
                value={addressCity}
                onChange={(e) => this.setState({ addressCity: e.target.value })}
                placeholder="City"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-address-postal-code">
                Postal Code
              </label>
              <TextArea
                id="form-input-address-postal-code"
                value={addressPostalCode}
                onChange={(e) => this.setState({ addressPostalCode: e.target.value })}
                placeholder="Postal Code"
              />
            </Form.Field>
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-address-country">
                Country
              </label>
              <TextArea
                id="form-input-address-country"
                value={addressCountry}
                onChange={(e) => this.setState({ addressCountry: e.target.value })}
                placeholder="Country"
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveCompany: (id: number, company: CompanyParams) => dispatch(
    saveSingle(SingleEntities.Company, id, company),
  ),
  createCompany: (company: CompanyParams) => dispatch(
    createSingle(SingleEntities.Company, company),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProps);
