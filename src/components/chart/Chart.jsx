import React from "react";
import styles from "./Chart.module.scss";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../card/Card";
import { useSelector } from "react-redux";
import { selectProducts } from "../../redux/slice/productSlice";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: false,
			text: "Chart.js Bar Chart",
		},
	},
};

const Chart = () => {
	const products= useSelector(selectProducts);

	// Create a new array of order status
	const array = [];
	products.map((item) => {
		const {productStatus} = item;
		array.push(productStatus);
	});
	console.log(array)

	const getOrderCount = (arr, value) => {
		return arr.filter((n) => n === value).length
	};

	const [q1, q2, q3, q4, q5] = ["Laptop", "Phone", "Cars", "Books", "Others"];

	const laptop = getOrderCount(array, q1);
	const phones = getOrderCount(array, q2);
	const cars = getOrderCount(array, q3);
	const books = getOrderCount(array, q4);
	const others = getOrderCount(array, q5);

	const data = {
		labels: ["Laptop", "Phone", "Cars", "Books", "Others"],
		datasets: [
			{
				label: "Product Count",
				data: [laptop, phones, cars, books, others],
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};
	return (
		<div className={styles.charts}>
			<Card cardClass={styles.card}>
				<h3>Product Status Chart</h3>
				<Bar options={options} data={data} />
			</Card>
		</div>
	);
};

export default Chart;
