import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FILTER_BY_BRAND, FILTER_BY_CATEGORY, FILTER_BY_PRICE } from "../../../redux/slice/filterSlice";
import { selectMaxPrice, selectMinPrice, selectProducts } from "../../../redux/slice/productSlice";
import styles from "./ProductFilter.module.scss";

const ProductFilter = () => {
	const [category, setCategory] = useState("All");
	const [price, setPrice] = useState(3000);
	const products = useSelector(selectProducts);
	const minPrice = useSelector(selectMinPrice);
	const maxPrice = useSelector(selectMaxPrice);

	const dispatch = useDispatch();

	const allCategories = [
		"All",
		...new Set(products.map((product) => product.category)),
	];

	useEffect(() => {
		dispatch(FILTER_BY_PRICE({products, price}))
	}, [dispatch, products, price]);

	const filteredProducts = (cat) => {
		setCategory(cat);
		dispatch (FILTER_BY_CATEGORY({products, category: cat}))
	};

	const clearFilters = () => {
		setCategory('All')
		setPrice(maxPrice)
	}

	return (
		<div className={styles.filter}>
			<h4>Categories</h4>
			<div className={styles.category}>
				{allCategories.map((cat, index) => {
					return (
						<button
							key={index}
							className={`${category}` === cat ? `${styles.active}` : null}
							onClick={() => filteredProducts(cat)}
						>
							&#8250; {cat}
						</button>
					);
				})}
			</div>
			<div className={styles.brand}>
				<h4>Price</h4>
				<p>{`N${price}`}</p>
				<div className={styles.price}>
					<input type="range" value={price} onChange={(e) => setPrice(e.target.value)} min={minPrice} max={maxPrice} />
				</div>
				<br />
				<button className="--btn --btn-danger" onClick={clearFilters}>Clear Filter</button>
			</div>
		</div>
	);
};

export default ProductFilter;
