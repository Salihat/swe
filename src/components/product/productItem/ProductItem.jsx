import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../card/Card";
import styles from './ProductItem.module.scss';
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/slice/authSlice";

const ProductItem = ({product, grid, id, name, price, sellerContact, desc, imageUrl}) => {
	const navigate = useNavigate();
	const isLoggedIn = useSelector(selectIsLoggedIn);

	const shortenText = (text, n) => {
		if(text.length > n){
			const shortenedText = text.substring(0, n).concat('...');
			return shortenedText;
		}
		return text;
	}

	const contactDetail = () => {
		if(isLoggedIn) {
			navigate(`product-details/${id}`);
		} else {
			navigate('/login')
		}
	}

	return(
		<Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
			<Link to={`/product-details/${id}`}>
				<div className={styles.img}>
					<img src={imageUrl} alt={name} />
				</div>
			</Link>

			<div className={styles.content}>
				<div className={styles.details}>
					<p style={{color: "#000"}}>{shortenText(desc, 70)}</p>
					<p>{`N${price}`}</p>
					<h4>{shortenText(name, 18)}</h4>
					<button className="--btn --btn-primary --btn-block" onClick={contactDetail}>Seller's Contact</button>
				</div>
				{!grid && <p className={styles.desc}>{shortenText(desc, 200)}</p>}
			</div>
		</Card>
	)
};

export default ProductItem;
