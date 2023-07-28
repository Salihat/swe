import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	REMOVE_ACTIVE_USER,
	SET_ACTIVE_USER,
} from "../../redux/slice/authSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import kasu_logo from "../../assets/logo-em.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const logo = (
	<div className={styles.logo}>
		<Link to='/'>
			<img src={kasu_logo} alt='Kasu' />
		</Link>
	</div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
	const [showMenu, setShowMenu] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [scrollPage, setScrollPage] = useState(false);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	// FIxed Navbar
	const fixNavbar = () => {
		if (window.scrollY > 70) {
			setScrollPage(true);
		} else {
			setScrollPage(false);
		}
	};
	window.addEventListener("scroll", fixNavbar);

	// Monitor currently signed in user
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// console.log(user);
				if (user.displayName == null) {
					const uid = user.email;
					const u1 = uid.substring(0, uid.indexOf("@"));
					const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
					setDisplayName(uName);
				} else {
					setDisplayName(user.displayName);
				}

				dispatch(
					SET_ACTIVE_USER({
						email: user.email,
						username: user.displayName ? user.displayName : displayName,
						userId: user.uid,
					})
				);
			} else {
				setDisplayName("");
				dispatch(REMOVE_ACTIVE_USER());
			}
		});
	}, [dispatch, displayName]);

	const toggleMenu = () => {
		setShowMenu(!showMenu);
	};

	const hideMenu = () => {
		setShowMenu(false);
	};

	const logoutUser = () => {
		signOut(auth)
			.then(() => {
				toast.success("Logout successful");
				navigate("/");
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	return (
		<header className={scrollPage}>
			<div className={styles.header}>
				{logo}

				<nav
					className={
						showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
					}
				>
					<div
						className={
							showMenu
								? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
								: `${styles["nav-wrapper"]}`
						}
						onClick={hideMenu}
					></div>

					<ul onClick={hideMenu}>
						<li className={styles["logo-mobile"]}>
							{logo}
							<FaTimes size={22} color={"#fff"} onClick={hideMenu} />
						</li>

						<li>
							<AdminOnlyLink>
								<NavLink to='admin/home' >
									<button className='--btn --btn-primary'>
										Admin
									</button>
								</NavLink>
							</AdminOnlyLink>
						</li>

						<li>
							<NavLink to='/' className={activeLink}>
								Home
							</NavLink>
						</li>

						<li>
							<NavLink to='/contact' className={activeLink}>
								Contact Us
							</NavLink>
						</li>
					</ul>

					<div className={styles["header-right"]} onClick={hideMenu}>
						<span className={styles.links}>
							<ShowOnLogout>
								<NavLink to='/login' className={activeLink}>
									Login
								</NavLink>
							</ShowOnLogout>

							<ShowOnLogout>
								<NavLink to='register' className={activeLink}>
									Register
								</NavLink>
							</ShowOnLogout>

							<ShowOnLogin>
								<NavLink to='/order-history' onClick={logoutUser}>
									Logout
								</NavLink>
							</ShowOnLogin>

							<ShowOnLogin>
								<a
									href='/'
									style={{ color: "#fef601ff", marginLeft: "2rem" }}
								>
									<FaUserCircle size={16} />
									Hi, {displayName}
								</a>
							</ShowOnLogin>
						</span>
					</div>
				</nav>
					<div className={styles["menu-icon"]}>
            <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
          </div>
			</div>
		</header>
	);
};

export default Header;
