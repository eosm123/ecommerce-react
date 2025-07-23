import Footer from "./Footer";
import "./styles.css";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import { Route, Switch } from "wouter";
import ProductPage from "./ProductPage";
import RegisterPage from "./RegisterPage";
import FlashMessage from "./FlashMessage";
import ShoppingCartPage from "./ShoppingCartPage";
import UserLogin from "./Login";
import Profile from "./Profile"

export default function App() {
  return (
    <>
      <Navbar />
      <FlashMessage/>

      <Switch>
        {/* switch -> when a stream of data goes in, u can choose which output it goes out from using the switch */}
        {/* switch allows us to setup a route and only one route can be active at the same time */}
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/cart" component={ShoppingCartPage}/>
        <Route path="/login" component={UserLogin}/>
        <Route path="/profile" component={Profile}/>
      </Switch>

      <Footer></Footer>
    </>
  );
}
