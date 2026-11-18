import React, { useEffect, useState } from "react";

import { Progress, ShowSearchMember } from "../dependence/ProjectCpnt";
import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";
import { project_status_arr } from "../dependence/Arr";

function ProjectManagement({ projects, projectMember }) {
    const [searchProject, setSearchProject] = useState("");//프로젝트 검색
    const [detail, setDetail] = useState(null);//프로젝트 상세보기 객체 저장
    const [select, setSelect] = useState("");//버튼

    useEffect(() => {
        if (projects.length > 0 && detail === null) {
            setDetail(projects[0]);
            setSelect(project_status_arr[0]);
        }
    }, [projects, detail]);
    return (
        <div>
            <h1>프로젝트</h1>
            <div className="box-container">
                {
                    project_status_arr.map((txt) => {
                        if (txt === "전체")
                            return <ShowBoxNumber key={txt} txt={txt + " 프로젝트"} length={projects.length} />
                        else {
                            const length = projects.filter(p => p.project_status === txt).length
                            return <ShowBoxNumber key={txt} txt={txt + " 프로젝트"} length={length} />
                        }
                    })
                }
            </div>
            <div className="container-top">
                <div className="top-button">
                    {
                        project_status_arr.map((txt) => (
                            <button key={txt} className={select === txt ? "selected" : "unselected"} type="button" onClick={() => setSelect(txt)}>{txt}</button>
                        ))
                    }
                </div>
                <div className="top-searchinput">
                    <label>프로젝트 검색</label>
                    <input type="search" placeholder="검색" onChange={(e) => setSearchProject(e.target.value)} />
                </div>
            </div>
            <div className="container">
                <div className="center">
                    {
                        projects
                            .filter(item => (select === "전체" || item.project_status === select) && item.project_name.includes(searchProject))
                            .map((p) => (
                                <ProjectBar key={p.project_id} project={p} setDetail={setDetail} />
                            ))
                    }
                </div>
                <Detail detail={detail} projectMember={projectMember?.filter(p => p.project_id == detail?.project_id)} />
            </div>
        </div>
    );
}

function ProjectBar({ project, setDetail }) {//프로젝트 카드
    return (
        <div className="center-list" onClick={() => setDetail(project)}>
            <h3>{project.project_name}</h3>
            <p><span>담당자</span> {project.manager_name}</p>
            <p><span>상태</span>{project.project_status}</p>
            <Progress progress={project.project_progress} />
        </div>
    );
}

function Detail({ detail, projectMember}) {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const is_admin = empl?.is_admin == 1;
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>{detail?.project_name}</h3>
                <p><span>담당자</span>{detail?.manager_name}</p>
                <p><span>시작일</span>{detail?.project_start_date.slice(0, 10)}</p>
                <p><span>마감일</span>{detail?.project_end_date.slice(0, 10)}</p>
                <p><span>상태</span>{detail?.project_status}</p>
                <p><span>진행률</span></p>
                <Progress progress={detail?.project_progress} />
                <p><span>참여자</span></p>
                <ShowSearchMember state={projectMember} bool={false} />
            </div>
            {(is_admin && detail != null) && (
                <EditDeleteButton txt={"프로젝트"} item={{ detail, projectMember }} id={detail?.project_id} address={"projects"} editPage={"projects/projectNew"} />
            )}
        </div>
    );
}

export default ProjectManagement;