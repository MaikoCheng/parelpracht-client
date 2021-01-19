import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ProductCategoriesTable from '../components/product/ProductCategoriesTable';
import ProductMenu from '../components/product/ProductMenu';
import ProductsTable from '../components/product/ProductTable';
import ProductTableControls from '../components/product/ProductTableControls';

interface State {
  activeItem: string;
}

class ProductsPage extends React.Component<RouteComponentProps, State> {
  public constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      activeItem: 'products',
    };
  }

  changeMenu = (menu: string) => {
    this.setState({ activeItem: menu });
  };

  selectTable = () => {
    const { activeItem } = this.state;
    if (activeItem === 'products') {
      return (
        <ProductsTable />
      );
    }
    if (activeItem === 'categories') {
      return (
        <ProductCategoriesTable />
      );
    }
    return null;
  };

  render() {
    const { activeItem } = this.state;
    return (
      <>
        <Segment style={{ backgroundColor: '#eee' }} vertical basic>
          <Container style={{ paddingTop: '2em' }}>
            <Grid columns={2}>
              <Grid.Column>
                <Header as="h1">
                  <Icon name="shopping bag" />
                  <Header.Content>
                    <Header.Subheader>Products</Header.Subheader>
                    All Products
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Button icon labelPosition="left" primary floated="right" onClick={() => this.props.history.push('/product/new')}>
                  <Icon name="plus" />
                  Add Product
                </Button>
              </Grid.Column>
            </Grid>
            <ProductTableControls />
            <Grid>
              <ProductMenu changeMenu={this.changeMenu} activeItem={activeItem} />
            </Grid>
          </Container>
        </Segment>
        <Container>
          { this.selectTable() }
        </Container>
      </>
    );
  }
}

export default withRouter(ProductsPage);
