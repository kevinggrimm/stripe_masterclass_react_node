import { Switch, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import Shop from './components/pages/shop/Shop';
import SingleProduct from './components/single-product/SingleProduct';
import CartPage from './components/pages/cart-page/CartPage';
import Checkout from './components/checkout/Checkout';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/shop' component={Shop} />
        {/* Assign to "id" variable in match */}
        <Route path='/product/:id' component={SingleProduct} />
        <Route path='/cart' component={CartPage} />
        <Route path='/checkout' component={Checkout} />
        <Route path='*' component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
