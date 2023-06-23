import React from "react";
import styles from "./Footer.module.scss";

const date = new Date();

const year = date.getFullYear();

const Footer = () => {
	return (
		<div className={styles.footer}>Kaduna State University <br /> &copy; {year} All Rights Reserved</div>
	);
};

export default Footer;
