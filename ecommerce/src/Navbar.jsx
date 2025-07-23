import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  // the isNavbarShowing determines if the navbar is visible or not
  const [isNavbarShowing, setNavbarShowing] = useState(false);
  const [location] = useLocation(); // useLocation hook can tell us current URL of the application
//   console.log(location)

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Ecommerce-Shop
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => {
              if (isNavbarShowing == false) {
                setNavbarShowing(true);
              } else {
                setNavbarShowing(false);
              }
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/*  below is dynamic rendering, if isnavbarshowing is true, adds a "show" if not just add "" */}
          <div
            className={`collapse navbar-collapse ${
              isNavbarShowing ? "show" : ""
            }`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className={`nav-link ${location==="/" ? "active" : ""}`} aria-current="page" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location==="/products" ? "active" : ""}`} href="/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location==="/cart" ? "active" : ""}`} href="/cart">
                  Cart
                </Link>
              </li>
              {/* Todo: Can consider to use jwt hook, and if jwt exists -> hide register and the login links ->
              after user login, dont need see register and login anymore */}
              <li className="nav-item">
                <Link className={`nav-link ${location==="/register" ? "active" : ""}`} href="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location==="/login" ? "active" : ""}`} href="/login">
                  Login
                </Link>
              </li>
              {/* Todo: Only if jwt exist -> then show profile link */}
              <li className="nav-item">
                <Link className={`nav-link ${location==="/profile" ? "active" : ""}`} href="/profile">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
