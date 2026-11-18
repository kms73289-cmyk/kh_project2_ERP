import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchMember, SearchTest } from "../dependence/Cpnt";
import { handleSubmit } from "../dependence/Func";
import { def_severity_arr, def_status_arr } from "../dependence/Arr";

function QaDefectNew({ bool }) {
    const location = useLocation();
    const item = location.state?.item;
    const [test, setTest] = useState(bool ? null : { test_id: item.test_id, title: item.t_title });
    const [manager, setManager] = useState(bool ? null : { employee_id: item.employee_id, name: item.name });
    const [input, setInput] = useState(() =>
        bool ?
            { title: "", description: "", severity: "보통", status: "접수", resolution: "" } :
            {
                defect_id: item.defect_id,
                title: item.title,
                description: item.description,
                severity: item.severity,
                status: item.status,
                resolution: item.resolution
            }
    );
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    return (
        <div className="input">
            {bool ? <h1>QA 결함 추가</h1> : <h1>QA 결함 수정</h1>}
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (test === null || manager === null) {
                        alert("테스트명 및 담당자를 입력하세요.");
                        return;
                    }
                    const data = { ...input, test_id: bool ? test.test_id : item.test_id, employee_id: manager.employee_id };
                    handleSubmit({ data: data, bool: bool, saveAdress: "saveDefect", updateAdress: "updateDefect", mainPage: "qa/test", txt: "결함" });
                }}>
                    <SearchTest setState={setTest} />
                    <div className="inputform">
                        <label>담당자</label>
                        <SearchMember setState={setManager} />
                        <div className="input-data"><input type="text" value={manager?.name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>결함 제목</label>
                        <div className="input-data"><input type="text" name="title" value={input.title} onChange={handleChange} autoComplete="off" /></div>
                    </div>
                    <div className="inputform">
                        <label>결함 내용</label>
                        <div className="input-data"><input type="text" name="description" value={input.description} onChange={handleChange} autoComplete="off" /></div>
                    </div>
                    <div className="inputform">
                        <label>심각도</label>
                        <div className="input-data">
                            {def_severity_arr.map(txt => (
                                <button key={txt} className={input.severity === txt ? "selected" : "unselected"}
                                    type="button" name="severity" value={txt} onClick={handleChange}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="inputform">
                        <label>처리 상태</label>
                        <div className="input-data">
                            {def_status_arr.map(txt => (
                                <button key={txt} className={input.status === txt ? "selected" : "unselected"}
                                    type="button" name="status" value={txt} onClick={handleChange}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="inputform">
                        <label>처리 내용</label>
                        <div className="input-data"><input type="text" name="resolution" value={input.resolution ?? ""} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div >
    );
}

export default QaDefectNew;