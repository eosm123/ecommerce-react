import Header from "./Header";
import ProductCard from "./ProductCard";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

// usually use useEffect when u want to combine another tech outside of react (i.e. combining leaflet n react)

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  // useEffect: an effect in React is a logic not related to rendering the DOM
  // React has no influence over/dk when the timer change +
  // also using axios to make a RESTFUL API call/read in json file
  // Need to tell React when and how to trigger it

  // 1st param: a 'effect' function; 2nd param: dependency array - usually contains a state. When state changes,
  // the 'effect' function will run again
  // If dependency array is empty -> effect will only run when the component renders for the 1st time (mounting)
  useEffect(function () {
    // make an axios call to featured.json
    // the effect function itself CANNNOT be async -> instead create a function thats async
    const getFeaturedProducts = async () => {
      const response = await axios.get("featured.json");
    //   console.log(response.data);
      setFeaturedProducts(response.data);
    };
    getFeaturedProducts();
    
  }, []);

  return (
    <>
      <Header></Header>
      <main className="container my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <div className="row">
          {featuredProducts.map(p => 
            <div key={p.id} className="col-md-3 mb-4">
              <ProductCard
                imageUrl={p.image}
                productName={p.name}
                price={p.price}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
