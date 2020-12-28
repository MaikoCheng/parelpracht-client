import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Product, ProductInstance } from '../../clients/server.generated';

interface Props extends RouteComponentProps {
  product: ProductInstance;
}

class ContractProduct extends React.Component<Props> {
  public render() {
    const { product } = this.props;
    return (
      <Segment.Group
        horizontal
        className="contract-product"
        style={{ margin: 0, marginTop: '0.2em' }}
        onClick={() => {
          this.props.history.push(
            `${this.props.location.pathname}/product/${product.id}`,
          );
        }}
      >
        <Segment
          as={Button}
          textAlign="left"
        >
          <Header sub>
            <Icon name="user circle" size="large" />
            <Header.Content>
              {product.id}
              <Header.Subheader>
                {product.price}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Button
          icon="eye"
          attached="right"
          basic
          onClick={() => { }}
        />
      </Segment.Group>
    );
  }
}

export default withRouter(ContractProduct);
