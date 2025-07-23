import { useCart } from "./CartStore";
import { useEffect } from "react";

export default function ShoppingCartPage() {
  // When calling useCart -> return {cart} object -> use destructuring to bring out cart variable
  const { cart, modifyQuantity, removeFromCart, fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [])

  return (
    <>
      <div className="containter">
        <h1>Shopping Cart</h1>
        <ul className="list-group">
          {
            // When returning jsx use round bracket (after the 'item =>')
            cart.map((item) => (
              <li
                className="list-group-item d-flex justify-content-between"
                key={item.id}
              >
                <div>
                  <h5>{item.product_name}</h5>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-primary btn-sm"
                            onClick={() => {
                                modifyQuantity(item.product_id, item.quantity - 1)
                            }}
                            disabled={item.quantity === 1}
                    >-</button>
                    <p className="mb-0 ms-2 me-2">Quantity: {item.quantity}</p>
                    <button className="btn btn-primary btn-sm"                            
                            onClick={() => {
                                modifyQuantity(item.product_id, item.quantity + 1)
                            }}>+</button>
                    <div>
                        <button className="btn btn-danger btm-sm ms-2"
                                onClick={() => {
                                    removeFromCart(item.product_id)
                                }}
                                >
                            Delete
                        </button>
                    </div>
                  </div>
                </div>
                <div>
                  <img src={item.image_url} />
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>                  
                {/* Converting to 2dp */}
              </li>
            ))
          }
        </ul>
      </div>
    </>
  );
}
