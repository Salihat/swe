import React, { useEffect } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { selectProducts, STORE_PRODUCTS } from "../../../redux/slice/productSlice";
import Chart from "../../chart/Chart";
import InfoBox from "../../infoBox/InfoBox";
import styles from "./Home.module.scss";

const earningIcon = <AiFillDollarCircle size={30} color="#b624ff" />;
const productIcon = <BsCart size={30} color="#1f93ff" />;
const ordersIcon = <FaCartArrowDown size={30} color="var(--color-danger)" />;


const Home = () => {
	const products = useSelector(selectProducts);

	const fbProducts = useFetchCollection('products');
	const {data} = useFetchCollection('orders');

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(STORE_PRODUCTS({
			products: fbProducts.data
		}))
	}, [dispatch, data, fbProducts])
	

	return (
		<div className={styles.home}>
			<h2>Admin Home</h2>
			<div className={styles["info-box"]}>

				<InfoBox
					cardClass={`${styles.card} ${styles.card2}`}
					title={"Products"}
					count={products.length}
					icon={productIcon}
				/>
			</div>
			<div>
				<Chart />
			</div>
		</div>
	);
};

export default Home;
