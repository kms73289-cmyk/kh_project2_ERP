import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchMember, SearchProject } from "../dependence/Cpnt";
import { handleSubmit } from "../dependence/Func";

function QaTestNew({ bool }) {
    const location = useLocation();
    const t = location.state?.item;
    const [project, setProject] = useState(bool ? null : { project_id: t.project_id, project_name: t.project_name });
    const [manager, setManager] = useState(bool ? null : { employee_id: t.employee_id, name: t.name });
    const [input, setInput] = useState(() =>
        bool ?
            { title: "", steps: "", expected: "" } :
            { test_id: t.test_id, title: t.title, steps: t.steps, expected: t.expected }
    );
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

    return (
        <div className="input">
            {bool ? <h1>QA 테스트 추가</h1> : <h1>QA 테스트 수정</h1>}
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (project === null || manager === null) {
                        alert("프로젝트명 및 담당자를 입력하세요.");
                        return;
                    }
                    const data = { ...input, project_id: bool ? project.project_id : t.project_id, employee_id: manager.employee_id };
                    handleSubmit({ data: data, bool: bool, saveAdress: "saveTest", updateAdress: "updateTest", mainPage: "qa/test", txt: "테스트" });

                }}>
                    <SearchProject setState={setProject} />
                    <div className="inputform">
                        <label>담당자</label>
                        <SearchMember setState={setManager} />
                        <div className="input-data"><input type="text" value={manager?.name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>테스트명</label>
                        <div className="input-data"><input type="text" name="title" value={input.title} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>확인순서</label>
                        <div className="input-data"><input type="text" name="steps" value={input.steps} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>예상결과</label>
                        <div className="input-data"><input type="text" name="expected" value={input.expected} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default QaTestNew;