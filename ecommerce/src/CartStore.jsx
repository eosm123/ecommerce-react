import { atom, useAtom } from "jotai";

const initialCart = [
  // Sample data
  {
    id: 1,
    product_id: 1,
    quantity: 10,
    product_name: "Organic Green Tea",
    price: 12.99,
    image_url: "https://picsum.photos/id/225/300/200",
    description: "Premium Organic Green Tea",
  },
];

export const cartAtom = atom(initialCart);

// Creating a custom hook
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);

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

    // if the product is not in the car, create new cart item and add to cart
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
    } else {
      modifyQuantity(
        existingCartItem.product_id,
        existingCartItem.quantity + 1
      );
    }
  };

  const modifyQuantity = (product_id, quantity) => {
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
    const clone = cart.map(
        i => i.id !== clonedCartItem.id ? i : clonedCartItem);

    setCart(clone);
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
  };

  return {
    cart,
    addToCart,
    modifyQuantity,
    removeFromCart
  };
};
