import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { handleSubmit } from "../dependence/Func";

function ReviewEdit() {
    const location = useLocation();
    const input = location.state?.item;
    const [inputdata, setInputData] = useState("");
    return (
        <div className="input">
            <h1>리뷰 답변</h1>
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = { id: input.review_id, reply: inputdata }
                    handleSubmit({
                        data: data, bool: false, saveAdress: "", updateAdress: "updateReview",
                        mainPage: "ecommerce/reviews", txt: "리뷰 응답"
                    });
                }}>
                    <div className="inputform">
                        <label>고객명</label>
                        <div className="input-data"><input type="text" name="tname" value={input.customer_name} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>상품명</label>
                        <div className="input-data"><input type="text" name="tname" value={input.product_name} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>리뷰 내용</label>
                        <div className="input-data">{input.comment}</div>
                    </div>
                    <div className="inputform">
                        <label>리뷰 날짜</label>
                        <div className="input-data"><input type="date" name="tname" value={input.created_at?.slice(0, 10)} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>답변 등록</label>
                        <div className="input-data">
                            <textarea name="admin_reply" value={inputdata} onChange={(e) => setInputData(e.target.value)} rows="10" cols="30" />
                        </div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default ReviewEdit;