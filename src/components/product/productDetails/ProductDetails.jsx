import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
import spinnerImg from "../../../assets/spinner.jpg";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import Card from "../../card/Card";
import StarsRating from "react-star-rate";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/slice/authSlice";

const ProductDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);

	const { document } = useFetchDocument("products", id);
	const { data } = useFetchCollection("reviews");
	const filteredReviews = data.filter((review) => review.productId === id);

	const isLoggedIn = useSelector(selectIsLoggedIn);

	useEffect(() => {
		setProduct(document);
	}, [document]);

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
								{!isLoggedIn ? <p>Please Log in Into Your Accout to See Seller's Details</p> :
								<>
								<p>
								<b>Seller's Contact: </b>{product.sellerContact}</p>
								</>
								}
								
									<Link to={`/review-product/${id}`}>
													<button className='--btn --btn-primary'>
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
