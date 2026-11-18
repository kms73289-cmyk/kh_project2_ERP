import React, { useState } from "react";
import dayjs from "dayjs";

import { ShowBoxNumber } from "../dependence/Cpnt";
import { ecm_category_arr } from "../dependence/Arr";
import "./ecm.css";

function EcommerceManagement({ products, orders }) {
    const latelyOrder = orders.filter(o => dayjs(o.order_date).isAfter(dayjs().subtract(15, "day")));
    const [select, setSelect] = useState(ecm_category_arr[0]);//버튼

    return (
        <div>
            <h1>전체 목록</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"전체 상품"} length={products.length} />
                <ShowBoxNumber txt={"전체 주문"} length={orders.length} />
                <ShowBoxNumber txt={"최근 주문"} length={latelyOrder.length} />
            </div>
            <div className="container-top">
                <div className="top-button">
                    <label>카테고리</label>
                    {
                        ecm_category_arr.map(txt => (
                            <button key={txt} className={select === txt ? "selected" : "unselected"} type="button" onClick={() => setSelect(txt)}>{txt}</button>
                        ))
                    }
                </div>
            </div>
            <div className="ecm-container">
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>상품가</th>
                                <th>해당 상품 주문량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.filter(p => select === "전체" || p.category == select).map(p =>
                                <tr key={p.product_id}>
                                    <td>{p.product_name}</td>
                                    <td>{p.product_price}</td>
                                    <td>{orders.filter(o => o.product_id === p.product_id).length}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>전체 주문</h3>
                    <div className="side">
                        {orders.map(o => <SideList key={o.order_id} item={o} bool={true} />)}
                    </div>
                </div>
                <div>
                    <h3>최근 주문</h3>
                    <div className="side">
                        {latelyOrder.map(lo => <SideList key={lo.order_id} item={lo} bool={false} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SideList({ item, bool }) {
    return (
        <div className="side-list">
            <h3><span>상품명</span>{item.product_name}</h3>
            <p><span>주문번호</span>{item.order_number}</p>
            {bool && (
                <p><span>주문날짜</span>{dayjs(item.order_date).format("YYYY-MM-DD")}</p>
            )}
        </div>
    );
}

export default EcommerceManagement;
