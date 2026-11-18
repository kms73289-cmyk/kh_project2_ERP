import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchMember, SearchProject } from "../dependence/Cpnt";
import { task_priority_arr } from "../dependence/Arr";
import { handleSubmit } from "../dependence/Func";

function TaskNew({ bool, projects }) {
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    const location = useLocation();
    const task = location.state?.item;
    const [tMember, setTmember] = useState(bool ? null : { employee_id: task.task_manager, name: task.name });//검색해서 담당자 데이터 가져오기
    const [selpj, setSelpj] = useState(bool ? null : projects.find(t => t.project_id === task.project_id));
    const [input, setInput] = useState(() =>
        bool ?
            { tname: "", priority: "", manager: "", start: today , end: today, progress: 0, projectId: "" } :
            { tid: task.task_id, tname: task.task_name, priority: task.task_priority, manager: task.task_manager, start: task.task_start.slice(0, 10), end: task.task_end.slice(0, 10), progress: task.task_progress, projectId: task.project_id }
    );

    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const submit = (e) => {
        e.preventDefault();
        if(!tMember || !selpj){
            alert("빈칸이 있습니다.");
            return;
        }
        const data = { ...input, manager: tMember?.employee_id ?? input.manager, projectId: bool? selpj.project_id : task?.project_id };
        handleSubmit({ data:data, bool:bool, saveAdress:"saveTask", updateAdress:"updateTask",
             mainPage:"projects/projectTask", txt:"업무" });
    }
    return (
        <div className="input">
            {bool ? <h1>업무 등록</h1> : <h1>업무 수정</h1>}
            <div className="input-container">
                <form onSubmit={submit}>
                    <div className="inputform">
                        <label>업무명</label>
                        <div className="input-data"><input type="text" name="tname" value={input.tname} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>우선순위</label>
                        <div className="input-data">
                            {
                                task_priority_arr.map((txt, idx) => (
                                    <button key={idx} className={input.priority === txt ? "selected" : "unselected"} type="button" name="priority" value={txt} onClick={handleChange}>
                                        {txt}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="inputform">
                        <SearchMember setState={setTmember} />
                        <div className="input-data"><input type="text" value={tMember?.name ?? ""} readOnly /></div>
                    </div>
                    <SearchProject setState={setSelpj}/>
                    <div className="inputform">
                        <label>시작일</label>
                        <div className="input-data"><input type="date" name="start" value={input.start} onChange={handleChange} required
                            min={selpj?.project_start_date?.slice(0, 10)} max={selpj?.project_end_date?.slice(0, 10)}
                        /></div>
                    </div>
                    <div className="inputform">
                        <label>마감일</label>
                        <div className="input-data"><input type="date" name="end" value={input.end} onChange={handleChange} required
                            min={selpj?.project_start_date?.slice(0, 10)} max={selpj?.project_end_date?.slice(0, 10)}
                        /></div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default TaskNew;