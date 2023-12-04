import {
	deleteDoc,
	doc,
} from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../../firebase/config";
import Loader from "../../loader/Loader";
import styles from "./ViewProducts.module.scss";
import Notiflix from "notiflix";
import { useDispatch, useSelector } from "react-redux";
import {
	selectProducts,
	STORE_PRODUCTS,
} from "../../../redux/slice/productSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import {
	FILTER_BY_SEARCH,
	selectFilteredProducts,
} from "../../../redux/slice/filterSlice";
import Search from "../../search/Search";
import Pagination from "../../pagination/Pagination";

const ViewProducts = () => {
	const [search, setSearch] = useState("");
	const { data, isLoading } = useFetchCollection("products");
	const products = useSelector(selectProducts);
	const filteredProducts = useSelector(selectFilteredProducts);

	// Pagination State
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(6);

	// Get Current Products
	const indexOfLastProducts = currentPage * productsPerPage;
	const indexOfFirstProducts = indexOfLastProducts - productsPerPage;
	const currentProducts = filteredProducts.slice(
		indexOfFirstProducts,
		indexOfLastProducts
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			STORE_PRODUCTS({
				products: data,
			})
		);
	}, [dispatch, data]);

	useEffect(() => {
		dispatch(FILTER_BY_SEARCH({ products, search }));
	}, [dispatch, products, search]);

	const confirmDelete = (id, imageUrl) => {
		Notiflix.Confirm.show(
			"Delete Product!!!",
			"You're about to delete this product",
			"Delete",
			"Cancel",
			function okCb() {
				deleteProduct(id, imageUrl);
			},
			function cancelCb() {
				console.log("Delete canceled");
			},
			{
				width: "320px",
				borderRadius: "3px",
				titleColor: "#FF5349",
				okButtonBackground: "#FF5349",
				cssAnimationStyle: "zoom",
			}
		);
	};

	const deleteProduct = async (id, imageUrl) => {
		try {
			await deleteDoc(doc(db, "products", id));
			const storageRef = ref(storage, imageUrl);
			await deleteObject(storageRef);
			toast.success("Product deleted successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			{isLoading && <Loader />}
			<div className={styles.table}>
				<h2>All Products</h2>
				<div className={styles.search}>
					<p>
						<b>{currentProducts.length}</b> products found.
					</p>
					<Search value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>
				{currentProducts.length === 0 ? (
					<p>No product found.</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>S/N</th>
								<th>Image</th>
								<th>Name</th>
								<th>Category</th>
								<th>Price</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							{currentProducts.map((product, index) => {
								const { id, name, price, imageUrl, category } = product;
								return (
									<tr key={id}>
										<td>{index + 1}</td>
										<td>
											<img
												src={imageUrl}
												alt={name}
												style={{ width: "100px" }}
											/>
										</td>
										<td>{name}</td>
										<td>{category}</td>
										<td>{`N${price}`}</td>
										<td className={styles.icons}>
											<Link to={`/admin/add-product/${id}`}>
												<FaEdit size={20} color="green" />
											</Link>
											&nbsp;
											<FaTrashAlt
												size={18}
												color="red"
												onClick={() => confirmDelete(id, imageUrl)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
				<Pagination 
				currentPage={currentPage}
				setCurrentPage = {setCurrentPage}
				productsPerPage={productsPerPage}
				totalProducts = {filteredProducts.length}
			/>
			</div>
		</>
	);
};

export default ViewProducts;
