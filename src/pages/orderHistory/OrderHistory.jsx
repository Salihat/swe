import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import useFetchCollection from "../../customHooks/useFetchCollection";
import { selectUserId } from "../../redux/slice/authSlice";
import { selectOrderHistory, STORE_ORDERS } from "../../redux/slice/orderSlice";
import styles from "./OrderHistory.module.scss";

const OrderHistory = () => {
	const { data, isLoading } = useFetchCollection("orders");
	const orders = useSelector(selectOrderHistory);
	const userId = useSelector(selectUserId);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(STORE_ORDERS(data));
	}, [dispatch, data]);

      const handleClick = (id) => {
            navigate(`/order-details/${id}`)
      }

      const filteredOrder = orders.filter((order) => order.userId === userId)

	return (
		<section>
			<div className={`container ${styles.order}`}>
				<h2>Your Order History</h2>
				<p>
					Open an order to leave a <b>Product Review</b>{" "}
				</p>
				<br />
				<>
					{isLoading && <Loader />}
					<div className={styles.table}>
						{filteredOrder.length === 0 ? (
							<p>No order found</p>
						) : (
							<table>
								<thead>
									<tr>
										<th>S/N</th>
										<th>Date</th>
										<th>Order ID</th>
										<th>Order Amount</th>
										<th>Order Status</th>
									</tr>
								</thead>
                                                <tbody>
                                                      {filteredOrder.map((order, index) => {
                                                            const {id, orderDate, orderTime, orderAmount, orderStatus} = order
                                                            return (
                                                                  <tr key={id} onClick={() => handleClick(id)}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{orderDate} at {orderTime}</td>
                                                                        <td>{id}</td>
                                                                        <td>${orderAmount}</td>
                                                                        <td>
                                                                              <p className={orderStatus !== 'Delivered' ?`${styles.pending}` : `${styles.delivered}` }>{orderStatus}</p>
                                                                        </td>
                                                                  </tr>
                                                            )
                                                      })}
                                                </tbody>
							</table>
						)}
					</div>
				</>
			</div>
		</section>
	);
};

export default OrderHistory;
