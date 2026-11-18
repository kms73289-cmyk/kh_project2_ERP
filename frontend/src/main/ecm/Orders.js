import React, { useEffect, useState } from "react";

import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";
import { order_status_arr } from "../dependence/Arr";

function Orders({ orders }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(order_status_arr[0]);
    const [detail, setDetail] = useState(null);
    useEffect(() => {
        setDetail(orders[0]);
    }, [orders])

    return (
        <div>
            <h1>주문 목록</h1>
            <div className="box-container">
                {order_status_arr.map(txt => {
                    if (txt === "전체")
                        return <ShowBoxNumber key={txt} txt={txt} length={orders.length} />
                    else
                        return <ShowBoxNumber key={txt} txt={txt} length={orders.filter(o => o.order_status === txt).length} />
                })}
            </div>
            <div className="container-top">
                <div className="top-searchinput">
                    <label>검색</label>
                    <input type="search" value={search} placeholder="주문번호 / 고객명 / 상품명" onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="select-date">
                    <label>상태</label>
                    <select value={filter} onChange={e => setFilter(e.target.value)}>
                        {order_status_arr.map(txt => <option key={txt} value={txt}>{txt}</option>)}
                    </select>
                </div>
            </div>
            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>상품명</th>
                                <th>고객명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(o => (search.trim() === ""
                                || o.customer_name?.includes(search.trim())
                                || o.order_number?.includes(search.trim())
                                || o.product_name?.includes(search.trim()))
                                && (filter === "전체" || o.order_status === filter))
                                .map((o, idx) =>
                                    <tr key={idx}>
                                        <td className="onClickTable" onClick={() => setDetail(o)}>
                                            <strong>{o.order_number}</strong>
                                        </td>
                                        <td>{o.product_name}</td>
                                        <td>{o.customer_name}</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
                {detail != null && <DetailOrder detail={detail} />}
            </div>
        </div>
    );
}

function DetailOrder({ detail }) {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const is_admin = empl?.is_admin == 1;
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>{detail?.order_number}</h3>
                <p><span>상품명 :</span>{detail?.product_name}</p>
                <p><span>고객명 :</span>{detail?.customer_name}</p>
                <p><span>주문 금액 :</span>{detail?.order_amount}</p>
                <p><span>주문 상태 :</span>{detail?.order_status}</p>
                <p><span>주문 날짜 :</span>{detail?.order_date?.slice(0, 10)}</p>
            </div>
            {is_admin && (
                <EditDeleteButton txt={"주문"} item={detail} id={detail?.order_id}
                    address={"orders"} editPage={"ecommerce/ordersEdit"} />
            )}
        </div>
    );
}

export default Orders;