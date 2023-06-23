import React, { useEffect } from "react";
import { Product } from "../../components/product/index";
import styles from "./Home.module.scss";
import banner from "../../assets/banner2.jpg";

const Home = () => {
	const url = window.location.href;

	useEffect(() => {
		const scrollToProducts = () => {
			if (url.includes("#products")) {
				window.scrollTo({
					top: 667,
					behavior: "smooth",
				});
				return;
			}
		};
		scrollToProducts();
	}, [url]);

	return (
		<div>
			<div className={styles.intro}>
				<img src={banner} alt="banner" width="100%" height="500px" />
	</div>
			<Product />
		</div>
	);
};

export default Home;
