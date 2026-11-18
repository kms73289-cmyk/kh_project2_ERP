import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ShowSearchMember } from "../dependence/ProjectCpnt";
import { SearchMember } from "../dependence/Cpnt";
import { handleSubmit } from "../dependence/Func";
import { project_status_arr } from "../dependence/Arr";

function ProjectNew({ bool, requests }) {
    const location = useLocation();
    const p = location.state?.item?.detail;//수정할 데이터(프로젝트 데이터)
    const m = location.state?.item?.projectMember;//수정할 데이터(프로젝트 참가자)

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    const [manager, setManager] = useState(bool ? null : { employee_id: p.project_manager, name: p.manager_name });//매니저
    const [participants, setParticipants] = useState(bool ? [] : m);//참가자
    const [input, setInput] = useState(() =>
        bool ?
            { project_name: '', project_start_date: today, project_end_date: today, project_progress: 0, project_status: '대기' } :
            { project_name: p.project_name, project_start_date: p.project_start_date?.slice(0, 10), project_end_date: p.project_end_date?.slice(0, 10), project_progress: p.project_progress, project_status: p.project_status }
    );
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const submit = (e) => {
        e.preventDefault();
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));//기존 객체에서 project_end_date만 새로운 값으로 덮어쓰기
        const data = { ...input, project_manager: manager?.employee_id, participants: participants, project_id: p?.project_id };
        handleSubmit({
            data: data, bool: bool, saveAdress: "saveProject", updateAdress: "updateProject",
            mainPage: "projects/projectMain", txt: "프로젝트"
        });
    }

    return (
        <div className="input">
            {bool ? <h1>프로젝트 생성</h1> : <h1>프로젝트 수정</h1>}
            <ShowReq requests={requests} />
            <div className="input-container">
                <form onSubmit={submit}>
                    <div className="inputform">
                        <label>프로젝트명</label>
                        <div className="input-data"><input type="text" name="project_name" value={input.project_name} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>담당자</label>
                        <SearchMember setState={setManager} />
                        <div className="input-data"><input type="text" value={manager?.name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>시작일</label>
                        <div className="input-data"><input type="date" name="project_start_date" min={bool ? today : input.project_start_date} value={input.project_start_date} onChange={handleChange} required /></div>
                    </div>
                    <div className="inputform">
                        <label>마감일</label>
                        <div className="input-data"><input type="date" name="project_end_date" min={input.project_start_date} value={input.project_end_date} onChange={handleChange} required /></div>
                    </div>
                    {!bool && (
                        <div className="inputform">
                            <label>상태설정</label>
                            <div className="input-data">
                                {project_status_arr.filter(txt => txt != "전체").map((txt, idx) => (
                                    <button key={idx} type="button" name="project_status" value={txt}
                                        className={input.project_status === txt ? "selected" : "unselected"} onClick={handleChange}>
                                        {txt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {
                        bool && (
                            <div className="inputform">
                                <label>참가자</label>
                                {/* some()은 배열에서 조건에 맞는 요소가 하나라도 있으면 true를 반환 */}
                                <SearchMember setState={(item) => setParticipants(prev => prev.some(p => p.employee_id === item.employee_id) ? prev : [...prev, item])} />
                                <ShowSearchMember state={participants} setState={setParticipants} bool={true} />
                            </div>
                        )
                    }
                    <button className="input-submit">저장</button>
                </form>
            </div>

        </div>
    );
}
function ShowReq({ requests }) {
    const [req, setReq] = useState(null);
    const selectableRequests = requests.filter(r => r.project_request_status === "대기");
    useEffect(() => setReq(requests[0]), []);
    return (
        <div className="inputform">
            <label>요청 선택</label>
            <div className="input-data">
                <select value={req?.project_request_id ?? ""}
                    onChange={e => setReq(requests.find(r =>
                        String(r.project_request_id) === e.target.value) ?? null)}>
                    {
                        selectableRequests.map(r => (
                            <option key={r.project_request_id} value={r.project_request_id}>
                                {r.request_title}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className="input-show">
                <p><span>요청명: </span>{req?.request_title}</p>
                <p><span>요구사항: </span>{req?.requirements}</p>
                <p><span>희망 납기일: </span>{req?.desired_due_date?.slice(0, 10)}</p>
                <p><span>요청일: </span>{req?.requested_at?.slice(0, 10)}</p>
            </div>
        </div>
    );
}
export default ProjectNew;