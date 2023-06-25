import React, { useEffect } from "react";
import styles from "./Auth.module.scss";
import registerImg from "../../assets/register1.png";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import { useState } from "react";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Register = () => {
	const [isLoading] = useState(false);
	const [register, setRegister] = useState({
		name: "",
		phoneNumber: "",
		email: "",
		matricNumber: "",
		department: "",
		password: "",
	});

	const navigate = useNavigate();
	const { name, phoneNumber, matricNumber, department, email, password } =
		register;
	const [user] = useAuthState(auth);

	const handleChange = (name) => (e) => {
		e.preventDefault();
		setRegister({ ...register, [name]: e.target.value });
	};

	const registerWithEmailAndPassword = async (
		name,
		phoneNumber,
		matricNumber,
		department,
		email,
		password
	) => {
		try {
			const res = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
				name,
				matricNumber,
				department,
				phoneNumber
			);
			const user = res.user;

			await updateProfile(auth.currentUser, {
				displayName: name,
			});
			await addDoc(collection(db, "users"), {
				uid: user.uid,
				name: name,
				phoneNumber: phoneNumber,
				matricNumber: matricNumber,
				department: department,
				authProvider: "local",
				email,
				password,
			});
		} catch (err) {
			toast.error(err.message);
		}
	};

	// eslint-disable-next-line
	useEffect(() => {
		if (user) navigate("/login", { replace: true });
		console.log(user);
	}, [user]);

	return (
		<>
			{isLoading && <Loader />}
			<section className={`container ${styles.auth}`}>
				<Card>
					<div className={styles.form}>
						<h3>Register</h3>
						<p>Enter your details to Register</p>
						<form>
							<div className={styles["input-section"]}>
								<label>Name</label>
								<input
									type='text'
									placeholder='Name'
									required
									value={name}
									onChange={handleChange("name")}
									name='name'
								/>
							</div>

							<div className={styles["input-section"]}>
								<label>Phone Number</label>
								<input
									type='number'
									placeholder='Phone Number'
									required
									value={phoneNumber}
									onChange={handleChange("phoneNumber")}
									name='phoneNumber'
								/>
							</div>

							<div className={styles["input-section"]}>
								<label>Matric Number</label>
								<input
									type='text'
									placeholder='Matric Number'
									required
									value={matricNumber}
									onChange={handleChange("matricNumber")}
									name='matricNumber'
								/>
							</div>

							<div className={styles["input-section"]}>
								<label>Department</label>
								<input
									type='text'
									placeholder='Department'
									required
									value={department}
									onChange={handleChange("department")}
									name='department'
								/>
							</div>

							<div className={styles["input-section"]}>
								<label>Email</label>
								<input
									type='text'
									placeholder='Email'
									required
									value={email}
									onChange={handleChange("email")}
									name='email'
								/>
							</div>

							<div className={styles["input-section"]}>
								<label>Password</label>
								<input
									type='password'
									placeholder='Password'
									required
									value={password}
									onChange={handleChange("password")}
									name='password'
								/>
							</div>

							<button
								type='submit'
								className='--btn --btn-primary --btn-block'
								onClick={() => {
									registerWithEmailAndPassword(
										name,
										phoneNumber,
										matricNumber,
										department,
										email,
										password
									);
									navigate("/");
								}}
							>
								Register
							</button>
						</form>

						<span className={styles.register}>
							<p>Already have an Account?</p>
							<Link to='/login'>Login</Link>
						</span>
					</div>
				</Card>

				<div className={styles.img}>
					<h3>
						Welcome to Kasu E-Market
						<br /> Register Form
					</h3>
					<img src={registerImg} alt='Register' width='400' />
				</div>
			</section>
		</>
	);
};

export default Register;
