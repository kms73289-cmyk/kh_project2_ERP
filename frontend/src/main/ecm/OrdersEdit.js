import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { handleSubmit } from "../dependence/Func";
import { order_status_arr } from "../dependence/Arr";

function OrdersEdit() {
    const statusLabels = order_status_arr.filter(arr => arr !== "전체");
    const location = useLocation();
    const input = location.state?.item;
    const [select, setSelect] = useState(input.order_status);
    return (
        <div className="input">
            <h1>주문 변경</h1>
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = { id: input.order_id, status: select }
                    handleSubmit({
                        data: data, bool: false, saveAdress: "", updateAdress: "updateOrder",
                        mainPage: "ecommerce/orders", txt: "주문"
                    });
                }}>
                    <div className="inputform">
                        <label>주문번호</label>
                        <div className="input-data"><input type="text" name="tname" value={input.order_number} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>고객명</label>
                        <div className="input-data"><input type="text" name="tname" value={input.customer_name} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>상품명</label>
                        <div className="input-data"><input type="text" name="tname" value={input.product_name} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>결제 금액</label>
                        <div className="input-data"><input type="number" name="tname" value={input.order_amount} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>결제 날짜</label>
                        <div className="input-data"><input type="date" name="tname" value={input.order_date?.slice(0, 10)} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>결제 상태</label>
                        <div className="input-data">
                            {statusLabels.map((txt, idx) => (
                                <button key={idx} className={select === txt ? "selected" : "unselected"} type="button"
                                    name="status" value={txt} onClick={(e) => setSelect(e.target.value)}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                        <button className="input-submit">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OrdersEdit;