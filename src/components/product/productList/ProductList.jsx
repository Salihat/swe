import React, { useEffect, useState } from "react";
import styles from "./ProductList.module.scss";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import Search from "../../search/Search";
import ProductItem from "../productItem/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import {
	FILTER_BY_SEARCH,
	selectFilteredProducts,
	SORT_PRODUCTS,
} from "../../../redux/slice/filterSlice";
import Pagination from "../../pagination/Pagination";

const ProductList = ({ products }) => {
	const [grid, setGrid] = useState(true);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("latest");

	const filteredProducts = useSelector(selectFilteredProducts);

	// Pagination State
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(6);

	// Get Current Products
	const indexOfLastProducts = currentPage * productsPerPage;
	const indexOfFirstProducts = indexOfLastProducts - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProducts, indexOfLastProducts);
	

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(SORT_PRODUCTS({ products, sort }));
	}, [dispatch, products, sort]);

	useEffect(() => {
		dispatch(FILTER_BY_SEARCH({ products, search }));
	}, [dispatch, products, search]);

	return (
		<div className={styles["product-list"]} id="product">
			<div className={styles.top}>
				<div className={styles.icons}>
					<BsFillGridFill
						size={22}
						color="var(--color-danger)"
						onClick={() => setGrid(true)}
					/>
					<FaListAlt size={24} color="#29721cff" onClick={() => setGrid(false)} />

					<p>
						<b>{filteredProducts.length}</b> Products found.
					</p>
				</div>
				{/* Search Icon */}
				<div>
					<Search value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>

				{/* Sort Product */}
				<div className={styles.sort}>
					<label>Sort by:</label>
					<select value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="latest">Latest</option>
						<option value="lowest-price">Lowest Price</option>
						<option value="highest-price">Highest Price</option>
						<option value="a-z">A to Z</option>
						<option value="z-a">Z to A</option>
					</select>
				</div>
			</div>

			<div className={grid ? `${styles.grid}` : `${styles.list}`}>
				{products.length === 0 ? (
					<p>No Products Found.</p>
				) : (
					<>
						{currentProducts.map((product) => {
							return (
								<div key={product.id}>
									<ProductItem {...product} grid={grid} product={product} />
								</div>
							);
						})}
					</>
				)}
			</div>
			<Pagination 
				currentPage={currentPage}
				setCurrentPage = {setCurrentPage}
				productsPerPage={productsPerPage}
				totalProducts = {filteredProducts.length}
			/>
		</div>
	);
};

export default ProductList;
