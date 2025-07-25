// Components -> parts of jsx that are repeated can end up being a component
export default function ProductCard(props) {
  return (
    <>
      <div className="card">
        <img
          src={props.imageUrl}
          className="card-img-top"
          alt={props.productName}
        />
        <div className="card-body">
          <h5 className="card-title">{props.productName}</h5>
          <p className="card-text">${props.price}</p>
          <a onClick={() =>{
            props.onAddToCart()
          }} className="btn btn-primary">
            Add to Cart
          </a>
        </div>
      </div>
    </>
  );
}
