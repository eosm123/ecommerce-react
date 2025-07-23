import { atom, useAtom } from "jotai";
import axios from "axios";
import { useJwt } from "./UserStore";
import { useFlashMessage } from "./FlashMessageStore";

const initialCart = [
  // Sample data
  // {
  //   id: 1,
  //   product_id: 1,
  //   quantity: 10,
  //   product_name: "Organic Green Tea",
  //   price: 12.99,
  //   image_url: "https://picsum.photos/id/225/300/200",
  //   description: "Premium Organic Green Tea",
  // },
];

export const cartAtom = atom(initialCart);

// Creating a custom hook
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const { getJwt } = useJwt();
  const { showMessage } = useFlashMessage();

  // fetch cart remotely from api
  const fetchCart = async () => {
    const jwt = getJwt(); // -> returns the token
    const response = await axios
      .get(import.meta.env.VITE_API_URL + "/api/cart", {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      })
      .catch((e) => {
        console.error(e);
      });
    console.log(response.data);
    // when calling setCart -> changes the cart in ShoppingCartPage.jsx and cause the component to re-render
    setCart(response.data);
  };

  // this function allows addToCart, modifyQuantity and removeFromCart to save to database,
  // initially those functions just change react UI only
  const updateCart = async (modifiedCart) => {
    const jwt = getJwt();
    // when adding to shopping cart, only need product_id and quantity
    const cartData = modifiedCart.map((cartItem) => ({
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
    }));
    await axios
      .put(import.meta.env.VITE_API_URL + "/api/cart", {"cartItems": cartData}, {
        headers: {
          Authorization: "Bearer " + jwt
        }
      })
      .catch((e) => {
        console.error(e);
        showMessage("Error updating the cart", "danger");
      });
  };

  // Contract of the product object should be:
  // id: int, primary key of the product
  // product_name: string, name of product
  // quantity: int
  // price: decimal
  // image_url: URL of the image
  // descriptionn: string
  const addToCart = (product) => {
    // check if the product is already in the shopping cart
    // for every cartItem, look for product id matches the id of the product that is being added in
    const existingCartItem = cart.find(
      (cartItem) => cartItem.product_id === product.id
    );

    // if the product is not in the cart, create new cart item and add to cart
    if (!existingCartItem) {
      const newCartItem = {
        // following the format of products.json
        id: Math.floor(Math.random() * 1000 + 1),
        product_id: product.id,
        product_name: product.name,
        image_url: product.image,
        description: product.description,
        quantity: 1,
        price: product.price,
      };
      const clone = [...cart, newCartItem];
      setCart(clone);
      updateCart(clone);
    } else {
      // modify cart item to be quantity + 1 if it is found in the cart alr
      modifyQuantity(
        existingCartItem.product_id,
        existingCartItem.quantity + 1
      );
    }
  };

  const modifyQuantity = async (product_id, quantity) => {
    if (quantity < 1) {
      return;
    }

    // check if the product is already in the shopping cart
    // for every cartItem, look for product id matches the id of the product that is being added in
    const existingCartItem = cart.find(
      (cartItem) => cartItem.product_id === product_id
    );

    // modify cart item, to be quantity + 1
    const clonedCartItem = {
      ...existingCartItem,
      quantity: quantity,
    };
    // const clone = cart.map((currentCartItem) => {
    //   if (currentCartItem.id !== clonedCartItem.id) {
    //     return currentCartItem;
    //   } else {
    //     return clonedCartItem;
    //   }
    // });
    // Same as below
    const clone = cart.map((i) =>
      i.id !== clonedCartItem.id ? i : clonedCartItem
    );
    updateCart(clone);
    await setCart(clone);
  };

  const removeFromCart = (product_id) => {
    const existingCartItem = cart.find((i) => i.product_id === product_id);
    const cloned = cart.filter(
      (currentItem) => currentItem.id !== existingCartItem.id
    );
    //   Same as below
    //   const cloned = cart.filter(currentItem => {
    //     return currentItem.id !== existingCartItem
    //   })
    setCart(cloned);
    updateCart(cloned);
  };

  return {
    cart,
    addToCart,
    modifyQuantity,
    removeFromCart,
    fetchCart,
  };
};
