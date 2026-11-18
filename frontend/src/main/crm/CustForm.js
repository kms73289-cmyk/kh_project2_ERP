import React, { useState } from "react";

import { handleSubmit } from "../dependence/Func";

function CustForm() {
    const [input, setInput] = useState(null);
    return (
        <div className="input">
            <h1>신규 고객 등록</h1>
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit({
                        data: input, bool: true, saveAdress: "customers", updateAdress: "", 
                        mainPage: "customers/customerInfo", txt: "신규 고객"
                    });
                }}>
                    <div className="inputform">
                        <label>이름</label>
                        <div className="input-data"><input type="text" name="custName" onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })} placeholder="아무개" pattern="[가-힣]+" required /></div>
                    </div>
                    <div className="inputform">
                        <label>연락처</label>
                        <div className="input-data"><input type="tel" name="custPhone" onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })} placeholder="010-1234-5678" pattern="01[016789]-[0-9]{3,4}-[0-9]{4}" required /></div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    )
}
export default CustForm;
