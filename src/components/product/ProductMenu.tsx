import React from 'react';
import {
  Menu,
} from 'semantic-ui-react';

interface Props {
  changeMenu: (menu: string) => void;
  activeItem: string;
}

interface State {
}

class ProductMenu extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { activeItem } = this.props;
    return (
      <div>
        <Menu pointing>
          <Menu.Item
            name="products"
            active={activeItem === 'products'}
            onClick={
              () => this.props.changeMenu('products')
            }
          />
          <Menu.Item
            name="categories"
            active={activeItem === 'categories'}
            onClick={
              () => this.props.changeMenu('categories')
            }
          />
        </Menu>
      </div>
    );
  }
}

export default ProductMenu;
