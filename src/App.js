import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Header, Footer} from './components';
import {Home, Contact, Login, Register, Reset, Admin} from  './pages';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminOnlyRoute from './components/adminOnlyRoute/AdminOnlyRoute';
import { Product, ProductDetails } from './components/product';
import ReviewProducts from './components/reviewProducts/ReviewProducts';
import NotFound from './pages/notFound/NotFound';


function App() { 
	return (
		<>
			<BrowserRouter>
				<ToastContainer />
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/reset" element={<Reset />} />

					<Route
						path="/admin/*"
						element={
							<AdminOnlyRoute>
								<Admin />
							</AdminOnlyRoute>
						}
					/>
					
					<Route path="/product" element={<Product />} />
					<Route path="/product-details/:id" element={<ProductDetails />} />
					<Route path="/review-product/:id" element={<ReviewProducts />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;