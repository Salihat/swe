import resetImg from "../../assets/forgot1.png";
import Card from "../../components/card/Card";
import styles from "./Auth.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase/Config";
import Loader from "../../components/loader/Loader";

const Reset = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const resetPassword = (e) => {
		e.preventDefault();
		setIsLoading(true);

		sendPasswordResetEmail(auth, email)
			.then(() => {
				setIsLoading(false);
				toast.success("Check your email for a reset link");
			})
			.catch((error) => {
				setIsLoading(false);
				toast.error(error.message);
			});
	};

	return (
		<section className={styles.mainContainer}>
			{isLoading && <Loader />}
			<section className={`container ${styles.auth}`}>
				<div className={styles.img}>
					<img src={resetImg} alt="Reset Password" width="400" />
				</div>

				<Card>
					<div className={styles.form}>
						<h3>Forgot Your Password??</h3>
						<p>Enter your Email below</p>
						<form onSubmit={resetPassword}>
							<div className={styles["input-section"]}>
								<label>Email</label>
								<input
									type="text"
									placeholder="Email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<button type="submit" className="--btn --btn-primary --btn-block">
								Reset Password
							</button>
							<div className={styles.links}>
								<p>
									<Link to="/login">- Login</Link>
								</p>
								<p>
									<Link to="/register">- Register</Link>
								</p>
							</div>
						</form>
					</div>
				</Card>
			</section>
		</section>
	);
};

export default Reset;
