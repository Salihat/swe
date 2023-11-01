import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
import spinnerImg from "../../../assets/spinner.jpg";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import Card from "../../card/Card";
import StarsRating from "react-star-rate";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/slice/authSlice";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  DECREASE_CART,
  selectCartItems,
} from "../../../redux/slice/cartSlice";

// import ProductMessage from "../productMessage/ProductMessage";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { document } = useFetchDocument("products", id);
  const { data } = useFetchCollection("reviews");
  const filteredReviews = data.filter((review) => review.productId === id);

  const cart = cartItems.find((cart) => cart.id === id);
  const isCartAdded = cartItems.findIndex((cart) => {
    return cart.id === id;
  });

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const decreaseCart = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <h2>Product Details</h2>
        <div>
          <Link to="/#products">&larr; Back to Products</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : (
          <>
            <div className={styles.details}>
              <div className={styles.img}>
                <img src={product.imageUrl} alt={product.name} />
              </div>

              <Card>
                <div className={styles.content}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}>{`N${product.price}`}</p>
                  <p>{product.desc}</p>
                  <p>
                    <b>SKU</b> {product.id}
                  </p>

                  <a href={`${`tel:${product.sellerContact}`}`}>
                    <b>Seller's Contact: </b>
                    {product.sellerContact}
                  </a>

                  <div className={styles.count}>
                    {isCartAdded < 0 ? null : (
                      <>
                        <button
                          className="--btn"
                          onClick={() => decreaseCart(product)}
                        >
                          -
                        </button>
                        <p>
                          <b>{cart.cartQuantity}</b>
                        </p>
                        <button
                          className="--btn"
                          onClick={() => addToCart(product)}
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                  <button className="--btn " onClick={() => addToCart(product)}>
                    ADD TO CART
                  </button>

                  <Link to={`/review-product/${id}`}>
                    <button className="--btn --btn-primary">
                      Review Product
                    </button>
                  </Link>
                </div>
              </Card>
            </div>
          </>
        )}

        <Card cardClass={styles.card}>
          <h3>Product Reviews</h3>
          <div>
            {filteredReviews.length === 0 ? (
              <p>There are no reviews for this product yet</p>
            ) : (
              <>
                {filteredReviews.map((item, index) => {
                  const { rate, review, reviewDate, userName } = item;
                  return (
                    <div className={styles.review} key={index}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>By {userName}</b>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProductDetails;
