import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StarsRating from "react-star-rate";
import { toast } from "react-toastify";
import useFetchDocument from "../../customHooks/useFetchDocument";
import { db } from "../../firebase/config";
import { selectUserId, selectUsername } from "../../redux/slice/authSlice";
import { selectProducts } from "../../redux/slice/productSlice";
import Card from "../card/Card";
import spinnerImg from "../../assets/spinner.jpg";
import styles from "./ReviewProducts.module.scss";

const ReviewProducts = () => {
	const [rate, setRate] = useState(0);
	const [review, setReview] = useState("");
	const [product, setProduct] = useState(null);
	const { id } = useParams();
	const { document } = useFetchDocument("products", id);

	const userId = useSelector(selectUserId);
	const userName = useSelector(selectUsername);

	useEffect(() => {
		setProduct(document);
	}, [document]);

	const submitReview = (e) => {
		e.preventDefault();
		const today = new Date();
		const date = today.toDateString();
		const reviewConfig = {
			userId,
			userName,
			productId: id,
			rate,
			review,
			reviewDate: date,
			createdAt: Timestamp.now().toDate(),
		};

		try {
			addDoc(collection(db, "reviews"), reviewConfig);
			toast.success("Review Submitted Successfully");
			setRate(0);
			setReview("");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<section>
			<div className={`container ${styles.review}`}>
				<h2>Review Products</h2>
				{product === null ? (
					<img src={spinnerImg} alt="Loading..." style={{width: '50px'}} />
				) : (
					<>
						<p>
							<b>Product name: </b>
							{product.name}
						</p>
						<img
							src={product.imageUrl}
							alt={product.name}
							style={{ width: "100px" }}
						/>
					</>
				)}

				<Card cardClass={styles.card}>
					<form onSubmit={(e) => submitReview(e)}>
						<label>Rating</label>
						<StarsRating
							value={rate}
							onChange={(rate) => {
								setRate(rate);
							}}
						/>
						<label>Review</label>
						<textarea
							value={review}
							required
							onChange={(e) => setReview(e.target.value)}
							cols="30"
							rows="10"
						></textarea>
						<button type="submit" className="--btn --btn-primary">
							Submit Review
						</button>
					</form>
				</Card>
			</div>
		</section>
	);
};

export default ReviewProducts;
