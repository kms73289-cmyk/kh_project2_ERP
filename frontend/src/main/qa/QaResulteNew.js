import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchMember, SearchTest } from "../dependence/Cpnt";
import { handleSubmit } from "../dependence/Func";
import { res_outcome_arr } from "../dependence/Arr";

function QaResulteNew({ bool }) {
    const location = useLocation();
    const item = location.state?.item;
    const [test, setTest] = useState(bool ? null : { test_id: item.test_id, title: item.t_title });
    const [manager, setManager] = useState(bool ? null : { employee_id: item.employee_id, name: item.name });
    const [input, setInput] = useState(() =>
        bool ?
            { actual: "", outcome: "성공", executed_on: "" } :
            { result_id: item.result_id, actual: item.actual, outcome: item.outcome, executed_on: item.executed_on?.slice(0, 10) }
    );
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    return (
        <div className="input">
            {bool ? <h1>QA 테스트 결과 추가</h1> : <h1>QA 테스트 결과 수정</h1>}
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (test === null || manager === null) {
                        alert("테스트명 및 담당자를 입력하세요.");
                        return;
                    }
                    const data = { ...input, test_id: bool ? test.test_id : item.test_id, employee_id: manager.employee_id };
                    handleSubmit({
                        data: data, bool: bool, saveAdress: "saveResult", updateAdress: "updateResult",
                        mainPage: "qa/test", txt: "테스트 결과"
                    });
                }}>
                    <SearchTest setState={setTest} />
                    <div className="inputform">
                        <label>담당자</label>
                        <SearchMember setState={setManager} />
                        <div className="input-data"><input type="text" value={manager?.name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>실제 결과</label>
                        <div className="input-data"><input type="text" name="actual" value={input.actual} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>판정</label>
                        <div className="input-data">
                            {res_outcome_arr.map(txt => (
                                <button key={txt} className={input.outcome === txt ? "selected" : "unselected"} type="button" name="outcome" value={txt} onClick={handleChange}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="inputform">
                        <label>실행일</label>
                        <div className="input-data"><input type="date" name="executed_on" value={input.executed_on} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default QaResulteNew;