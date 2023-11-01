import React, { useState } from "react";
import styles from "./Auth.module.scss";
import loginImg from "../../assets/login.png";
import { Link, redirect, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { auth } from "../../firebase/Config";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Loader from "../../components/loader/Loader";
import { useSelector } from "react-redux";
import { selectPreviousUrl } from "../../redux/slice/cartSlice";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const previousUrl = useSelector(selectPreviousUrl);

	const navigate = useNavigate();

	const redirectUser = () => {
		if(previousUrl.includes("cart")) {
			return navigate("/cart");
		}
		navigate('/');
	}

	const loginUser = (e) => {
		e.preventDefault();
		setIsLoading(true);

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				
				const user = userCredential.user;
				setIsLoading(false);
				toast.success("Login Successful 🙂");
				redirectUser();
			})
			.catch((error) => {
				setIsLoading(false);
				toast.error(error.message + "😞");
			});
	};

	const provider = new GoogleAuthProvider();
      const signInWithGoogle = () => {
            signInWithPopup(auth, provider)
                  .then((result) => { 
                  const user = result.user;
                        toast.success('Login Successful');
                        redirectUser();
                  }).catch((error) => {
                        toast.error(error.message);
                  });
      }

	return (
		<section className={styles.mainContainer}>
			{isLoading && <Loader />}
			<section className={`container ${styles.auth}`}>
				<div className={styles.img}>
					<h3>
						Welcome to Kasu E-Market
						<br /> Login Form
					</h3>
					<img src={loginImg} alt='Login' width='400' />
				</div>

				<Card>
					<div className={styles.form}>
						<h3>Login to continue</h3>
						<p>Enter your details to Login</p>
						<form onSubmit={loginUser}>
							<div className={styles["input-section"]}>
								<label>Email</label>
								<input
									type='text'
									placeholder='Email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className={styles["input-section"]}>
								<label>Password</label>
								<input
									type='password'
									placeholder='Password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<button
								type='submit'
								className='--btn --btn-primary --btn-block'
							>
								Login
							</button>
							<div className={styles.links}>
								<Link to='/reset'>Reset Password</Link>
							</div>

							<p>-- or --</p>
							
						</form>

						<button
							onClick={signInWithGoogle}
							className="--btn --btn-danger --btn-block"
						>
							<FaGoogle color="#fff" /> Login With Google
						</button>
						
						<span className={styles.register}>
							<p>Don't have an account?</p>
							<Link to='/register'>Register</Link>
						</span>
					</div>
				</Card>
			</section>
		</section>
	);
};

export default Login;
