import React, { useEffect, useState } from "react";

import { Progress, ShowSearchMember } from "../dependence/ProjectCpnt";
import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";

function ProjectTask({ projects, projectMember, tasks, is_admin }) {
    const [prjt, setPrjt] = useState("");
    const [detail, setDetail] = useState(null);
    const priority = ["전체", "높음", "보통", "낮음"];

    useEffect(() => {
        if (projects.length > 0 && prjt === "") {
            setPrjt(String(projects[0].project_id));
        }
    }, [projects, prjt]);
    useEffect(() => {
        setDetail(tasks.find(t => String(t.project_id) === prjt) ?? null);
    }, [tasks, prjt]);

    return (
        <div>
            <h1>프로젝트 / 업무</h1>
            <div className="box-container">
                {
                    priority.map((txt) => {
                        if (txt === "전체")
                            return <ShowBoxNumber key={txt} txt={txt} length={tasks.length} />
                        else
                            return <ShowBoxNumber key={txt} txt={txt} length={tasks.filter(t => t.task_priority === txt).length} />
                    })
                }
            </div>
            <div className="container-top">
                <div className="top-button">
                    <label>참여자</label>
                    <ShowSearchMember state={projectMember.filter(m => m.project_id == prjt)} bool={false} />
                </div>
                <div className="top-searchinput">
                    <label>프로젝트 선택</label>
                    <select onChange={(e) => setPrjt(e.target.value)}>
                        {projects.map(p => (
                            <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="container">

                <div className="center">
                    {//해당 프로젝트에 관련된 업무 리스트
                        tasks.filter(t => t.project_id == prjt).map(task => (
                            <TaskBar key={task.task_id} t={task} setDetail={setDetail} />
                        ))
                    }
                </div>
                <TaskDetail detail={detail} is_admin={is_admin} />
            </div>
        </div >
    );
}

function TaskBar({ t, setDetail }) {
    return (
        <div className="center-list" onClick={() => setDetail(t)}>
            <h3>{t.task_name}</h3>
            <p><span>담당자</span> {t.name}</p>
            <Progress progress={t.task_progress} />
        </div>
    );
}

function TaskDetail({ detail }) {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const is_admin = empl?.is_admin == 1;
    if (!detail) {
        return (
            <div className="right">
                <p>업무를 선택해 주세요.</p>
            </div>
        );
    }
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>{detail?.task_name}</h3>
                <p><span>담당자</span>{detail?.name}</p>
                <p><span>우선순위</span>{detail?.task_priority}</p>
                <p><span>시작일</span>{detail?.task_start?.slice(0, 10)}</p>
                <p><span>마감일</span>{detail?.task_end?.slice(0, 10)}</p>
                <p><span>진행률</span></p>
                <Progress progress={detail?.task_progress} />
            </div>
            {is_admin && (
                <EditDeleteButton txt={"업무"} item={detail} id={detail?.task_id} address={"tasks"} editPage={"projects/TaskNew"} />
            )}
        </div>
    );
}

export default ProjectTask;