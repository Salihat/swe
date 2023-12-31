import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectEmail } from "../../redux/slice/authSlice";

const AdminOnlyRoute = ({ children }) => {
	const userEmail = useSelector(selectEmail);
	if (userEmail === "balarabesally@gmail.com" || userEmail === "charlesomache2@gmail.com"  || userEmail === "abbahassan312@gmail.com" || userEmail === "abubakarrsadeeq@gmail.com" || userEmail === "muhammadalmustapha65@gmail.com"  ) {
		return children;
	}
	return (
		<section style={{ height: "80vh" }}>
			<div className='container'>
				<h2>Permission Denied.</h2>
				<p>This page can only be viewed by an admin user.</p>
				<br />
				<Link to='/'>
					<button className='--btn'>&larr; Back to Home </button>
				</Link>
			</div>
		</section>
	);
};

export const AdminOnlyLink = ({ children }) => {
	const userEmail = useSelector(selectEmail);
	if (userEmail === "balarabesally@gmail.com" || userEmail === "charlesomache2@gmail.com"  || userEmail === "abbahassan312@gmail.com" || userEmail === "abubakarrsadeeq@gmail.com" || userEmail === "muhammadalmustapha65@gmail.com" ) {
		return children;
	}
	return null;
};

export default AdminOnlyRoute;
