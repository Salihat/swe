import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../../firebase/config";
import { selectProducts } from "../../../redux/slice/productSlice";
import Card from "../../card/Card";
import Loader from "../../loader/Loader";
import styles from "./AddProduct.module.scss";

const categories = [
	{ id: 1, name: "Laptop" },
	{ id: 2, name: "Phone" },
	{ id: 3, name: "Electronics" },
	{ id: 4, name: "Books" },
	{id: 5, name: "Shoes"},
	{id: 6, name: "Clothings"},
	{id: 7, name: "Home Appliances"},
	{ id: 8, name: "Others"}, 
];

const initialState = {
	name: "",
	imageUrl: "",
	price: 0,
	category: "",
	desc: "",
	sellerContact: 0
};

const AddProduct = () => {
	const {id} = useParams();
	const products = useSelector(selectProducts);
	const productEdit = products.find((item) => item.id === id);
	console.log(productEdit);

	const [product, setProduct] = useState(() => {
		const newState = detectForm(id, 
			{...initialState},
			productEdit
		)
		return newState;
	});
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	

	const navigate = useNavigate();

	function detectForm(id, f1, f2) {
		if(id === 'ADD'){
			return f1;
		}
		return f2;
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		// console.log(file)
		const storageRef = ref(storage, `kasu-e-market/${Date.now()}${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setUploadProgress(progress);
			},

			(error) => {
				toast.error(error.message);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setProduct({ ...product, imageUrl: downloadURL });
					toast.success("Image uploaded successfully");
				});
			}
		);
	};

	const addProduct = (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// eslint-disable-next-line
			const docRef = addDoc(collection(db, "products"), {
				name: product.name,
				imageUrl: product.imageUrl,
				price: Number(product.price),
				category: product.category,
				desc: product.desc,
				sellerContact: Number(product.sellerContact),
				createdAt: Timestamp.now().toDate(),
			});
			setIsLoading(false);
			setUploadProgress(0);
			setProduct({...initialState});

			toast.success("Product Uploaded Successfully");
			navigate("/admin/all-products");
		} catch (error) {
			setIsLoading(false);
			toast.error(error.message);
		}
	};

	const editProduct = (e) => {
		e.preventDefault();
		setIsLoading(true);

		if(product.imageUrl !== productEdit.imageUrl){
			const storageRef = ref(storage, productEdit.imageUrl);
			deleteObject(storageRef);
		}

		try {
			setDoc(doc(db, "products", id), {
				name: product.name,
				imageUrl: product.imageUrl,
				price: Number(product.price),
				category: product.category,
				desc: product.desc,
				sellerContact: Number(product.sellerContact),
				createdAt: productEdit.createdAt,
				editedAt: Timestamp.now().toDate()
			});
			setIsLoading(false);
			toast.success('Product Edited successfully');
			navigate('/admin/all-products');
		} catch(error) {
			setIsLoading(false);
			toast.error(error.message);
		}
	}

	return (
		<>
			{isLoading && <Loader />}
			<div className={styles.product}>
				<h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>
				<Card cardClass={styles.card}>
					<form onSubmit={detectForm(id, addProduct, editProduct)}>
						<label>Product name:</label>
						<input
							type="text"
							placeholder="Product name"
							required
							name="name"
							value={product.name}
							onChange={(e) => handleInputChange(e)}
							style={{textTransform:"capitalize"}}
						/>

						<label>Product Image:</label>
						<Card cardClass={styles.group}>
							{uploadProgress === 0 ? null : (
								<div className={styles.progress}>
									<div
										className={styles["progress-bar"]}
										style={{ width: `${uploadProgress}%` }}
									>
										{uploadProgress < 100
											? `Uploading ${uploadProgress}`
											: `Upload Complete ${uploadProgress}%`}
									</div>
								</div>
							)}

							<input
								type="file"
								accept="image/*"
								placeholder="Product Image"
								name="image"
								onChange={(e) => handleImageChange(e)}
							/>

							{product.imageUrl === "" ? null : (
								<input
									type="text"
									// required
									placeholder="Image Url"
									disabled
									name="imageUrl"
									value={product.imageUrl}
								/>
							)}
						</Card>

						<label>Product Price:</label>
						<input
							type="number"
							placeholder="Product Price"
							required
							name="price"
							value={product.price}
							onChange={(e) => handleInputChange(e)}
						/>

						<label>Product Category:</label>
						<select
							required
							name="category"
							value={product.category}
							onChange={(e) => handleInputChange(e)}
						>
							<option value="" disabled>
								-- Choose Product Category --
							</option>
							{categories.map((cat) => {
								return (
									<option key={cat.id} value={cat.name}>
										{cat.name}
									</option>
								);
							})}
						</select>

						<label>Seller Contact:</label>
						<input
							type="number"
							placeholder="Seller Contact"
							required
							name="sellerContact"
							value={product.sellerContact}
							onChange={(e) => handleInputChange(e)}
						/>

						<label>Product Description:</label>
						<textarea
							name="desc"
							value={product.desc}
							required
							onChange={(e) => handleInputChange(e)}
							cols="30"
							rows="10"
						></textarea>

						<button className="--btn --btn-primary">{detectForm(id, "Save Product", "Edit Product")}</button>
					</form>
				</Card>
			</div>
		</>
	);
};

export default AddProduct;
