import React, { useEffect, useState } from "react";
import axios from "axios";

import { Progress } from "../dependence/ProjectCpnt";
import { ShowBoxNumber } from "../dependence/Cpnt";
import MyTodo from "./MyTodo";
import "./prjt.css"

function ProjectMy({ myProject, myTask, tasks, taskList }) {
    const [detail, setDetail] = useState(null);
    const [searchMyPrjt, setSearchMyPrjt] = useState("");
    useEffect(() => {
        if (myTask.length > 0 && detail === null)
            setDetail(myTask[0]);
    }, [myTask]);

    const calcPrgrs = (tid, progress) => {
        const pid = tasks.find(i => i.task_id == tid)?.project_id;
        const p_tasks = tasks.filter(t => t.project_id == pid && t.task_id != tid);
        //reduce() : 하나의 결과값으로 누적하는 함수, 배열.reduce((누적값, 현재요소) => 계산식, 초기값)
        const p_progress = Math.round(
            (p_tasks.reduce((sum, t) => sum + Number(t.task_progress), 0) + Number(progress))
            / (p_tasks.length + 1)
        );
        axios.put("http://localhost:3000/updatetaskProgress", { tid, progress, pid, p_progress })
            .then(res => {
                console.log(res.data);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
    return (
        <div>
            <h1>내 프로젝트</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"프로젝트"} length={myProject.length} />
                <ShowBoxNumber txt={"업무"} length={myTask.length} />
                <ShowBoxNumber txt={"할 일"} length={taskList.filter(l => myTask.some(t => t.task_id === l.task_id)).length} />
            </div>
            <div className="container-top">
                <div className="top-searchinput">
                    <label>프로젝트 검색</label>
                    <input type="search" placeholder="검색" onChange={(e) => setSearchMyPrjt(e.target.value)} />
                </div>
            </div>
            <div className="container">
                <div className="center">
                    {
                        myProject.filter((i) => i.project_name.includes(searchMyPrjt))
                            .map((p) => (
                                <MyProject key={p.project_id} project={p} myTask={myTask} setDetail={setDetail} />
                            ))
                    }
                </div>
                <MyTodo taskList={taskList} detail={detail} calcPrgrs={calcPrgrs} />
            </div>
        </div>
    );
}

function MyProject({ project, myTask, setDetail }) {//내 프로젝트
    return (
        <div className="center-listout">
            <h3><span>프로젝트명</span>{project.project_name}</h3>
            <p><span>프로젝트 담당자</span>{project.manager_name}</p>
            {
                myTask.filter(t => t.project_id === project.project_id).map(m => (
                    <MyTask key={m.task_id} myTask={m} setDetail={setDetail} />
                ))
            }
        </div>
    );
}

function MyTask({ myTask, setDetail }) {//내 업무
    return (
        <div className="center-list" onClick={() => setDetail(myTask)}>
            <h3><span>업무명</span> {myTask?.task_name}</h3>
            <p><span>우선순위</span> {myTask?.task_priority}</p>
            <p><span>시작일</span> {myTask?.task_start?.slice(0, 10)}</p>
            <p><span>마감일</span> {myTask?.task_end?.slice(0, 10)}</p>
            <div><p><span>진행률</span></p>
                <Progress progress={myTask?.task_progress} />
            </div>
        </div>
    );
}

export default ProjectMy;