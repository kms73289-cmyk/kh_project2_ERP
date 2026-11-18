import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { WeekSchedule } from "../dependence/ScheduleCpnt";
import './chart.css';

dayjs.extend(isoWeek);//isoWeek 플러그인 활성화

function ScheduleProject({ projects, tasks }) {
    const today = dayjs();

    const [selectProject, setSelectProject] = useState(""); //선택한 프로젝트 아이디 저장

    const [year, setYear] = useState(today.year()); //년도
    const [week, setWeek] = useState(today.isoWeekYear() + "-W" + String(today.isoWeek()).padStart(2, "0")); //주차
    const [startDate, setStartDate] = useState(today.startOf("isoWeek"));

    useEffect(() => {
        setSelectProject(projects[0]?.project_id);
    }, [projects])

    const changeWeek = (e) => {
        const weekvalue = e.target.value;
        setWeek(weekvalue);
        const [y, w] = weekvalue.split("-W");
        setStartDate(dayjs(y + "-01-04").startOf("isoWeek").add(w - 1, "week"));
        //선택한 년도의 첫주 에서 해당 주차로 이동해서 월요일 날짜 가져오기
    }
    return (
        <div>
            <h1>차트 일정</h1>
            <div>
                <div className="select-date">
                    <h2>연간 프로젝트 차트</h2>
                    <button type="button" onClick={() => setYear(year - 1)}>&lt;</button>
                    {year} 년
                    <button type="button" onClick={() => setYear(year + 1)}>&gt;</button>
                </div>
            </div>
            <div>
                <div className="chart-box">
                    <div className="chart-title">프로젝트 \ 월</div>
                    <div className="chart-year">
                        {Array.from({ length: 12 }, (_, idx) => (
                            <div key={idx}>{idx + 1}월</div>
                        ))}
                    </div>
                </div>
                <div className="chart-outter">
                    {projects.filter(prjt =>
                        dayjs(prjt.project_start_date).year() <= year && dayjs(prjt.project_end_date).year() >= year)
                        .map((p) =>
                            <YearSchedule key={p.project_id} p={p} year={year} setSelectProject={setSelectProject} />
                        )}
                </div>
            </div>

            <div>
                <div className="select-date">
                    <h2>주간 업무 차트</h2>
                    <input type="week" value={week} onChange={changeWeek} />
                </div>
                <div className="chart-box">
                    <div className="chart-title">업무 \ 요일</div>
                    <div className="chart-week">
                        {Array.from({ length: 7 }, (_, idx) => (
                            <div key={idx}>
                                <span>{startDate.add(idx, "day").format("MM/DD")}</span><br />
                                {startDate.add(idx, "day").format("ddd")}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chart-outter">
                    {tasks.filter(task => task.project_id === selectProject).map((item) =>
                        <WeekSchedule key={item.task_id} item={item} startDate={startDate} />)
                    }
                </div>
            </div>
        </div>
    );
}

function YearSchedule({ p, year, setSelectProject }) {
    const start = dayjs(p.project_start_date).year() < year ? 1 : dayjs(p.project_start_date).month() + 1;
    const end = dayjs(p.project_end_date).year() > year ? 13 : dayjs(p.project_end_date).month() + 2;
    return (
        <div className="chart-box" key={p.project_id}>
            <div className="chart-title">
                {p.project_name}<br />
            </div>
            <div className="chart-year">
                <div className="chart-bar" style={{ gridColumn: `${start}/${end}`, backgroundColor: "steelblue" }}>
                    <button className="none-button" type="button" onClick={() => setSelectProject(p.project_id)}>{p.project_name}</button>
                    <span>{dayjs(p.project_start_date).format("YY/MM/DD")} - {dayjs(p.project_end_date).format("YY/MM/DD")}</span>
                </div>
            </div>
        </div>
    );
}

export default ScheduleProject;