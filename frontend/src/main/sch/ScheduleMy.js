import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { CategoryColor, ChangeMonthBtn, DateSchedule, MonthCalendar, WeekSchedule } from "../dependence/ScheduleCpnt";
import { colorCategory } from "../dependence/Arr";
import './calendar.css';
import './chart.css';

dayjs.extend(isoWeek);//isoWeek 플러그인 활성화

function ScheduleMy({ tasks, projects, schedules }) {
    const today = dayjs();
    const [year, setYear] = useState(today.year()); //년도
    const [month, setMonth] = useState(today.month() + 1); //월(0 ~ 11) + 1
    const [week, setWeek] = useState(today.isoWeekYear() + "-W" + String(today.isoWeek()).padStart(2, "0"));
    const [event, setEvent] = useState([]);
    const [startDate, setStartDate] = useState(today.startOf("isoWeek"));
    const [detail, setDetail] = useState(today.format("YYYY-MM-DD"));
    const colcate = colorCategory.filter(c => c.ctgr != "요청 마감일");
    useEffect(() => {
        const events = [];
        projects.forEach(p => {
            events.push({ id: p.project_id, title: p.project_name + " 시작", category: colcate[0].col, date: p.project_start_date.slice(0, 10), label: "담당자", name: p.manager_name });
            events.push({ id: p.project_id, title: p.project_name + " 마감", category: colcate[0].col, date: p.project_end_date.slice(0, 10), label: "담당자", name: p.manager_name });
        });
        tasks.forEach(t => {
            events.push({ id: t.task_id, title: t.task_name + " 시작", category: colcate[1].col, date: t.task_start.slice(0, 10), label: "담당자", name: t.name });
            events.push({ id: t.task_id, title: t.task_name + " 마감", category: colcate[1].col, date: t.task_end.slice(0, 10), label: "담당자", name: t.name });
        });
        schedules.forEach(s => {
            events.push({ id: s.schedule_id, title: s.s_content, category: colcate[2].col, date: s.s_date.slice(0, 10), label: "등록자", name: s.name });
        });
        setEvent(events);
    }, [tasks, projects, schedules]);

    const is_today = event.some(e => e.date === detail);
    const changeWeek = (e) => {
        const weekvalue = e.target.value;
        setWeek(weekvalue);
        const [y, w] = weekvalue.split("-W");
        setStartDate(dayjs(y + "-01-04").startOf("isoWeek").add(w - 1, "week"));
    }

    return (
        <div>
            <h1>내 일정</h1>
            <div className="mytop-container">
                <div className="select-date">
                    <h2>주간 업무 차트</h2>
                    <input type="week" value={week} onChange={changeWeek} />
                </div>
                <div className="chart-box">
                    <div className="chart-title">업무 \ 요일</div>
                    <div className="chart-week">
                        {
                            Array.from({ length: 7 }, (_, idx) => (
                                <div key={idx}>
                                    <span>{startDate.add(idx, "day").format("MM/DD")}</span><br />
                                    {startDate.add(idx, "day").format("ddd")}
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    tasks.map((item) =>
                        <WeekSchedule key={item.task_id} item={item} startDate={startDate} />)
                }
            </div>
            <div className="mybot-container">
                <div className="my-calender">
                    <div>
                        <ChangeMonthBtn year={year} setYear={setYear} month={month} setMonth={setMonth} />
                        <MonthCalendar year={year} month={month} event={event} setDetail={setDetail} />
                        <CategoryColor colorCategory={colcate} />
                    </div>
                </div>
                <div className="my-today">
                    <div className="select-date">
                        <h2>일간 일정</h2>
                        <p>{detail}</p>
                    </div>
                    {!is_today && (
                        <div className="sch-list" style={{ border: "1px solid var(--color-text)" }}>
                            <p>일정이 없습니다.</p>
                        </div>
                    )}
                    {is_today && (
                        <div>
                            {
                                event.filter(e => e.date === detail && e.category != "#6BAA91")
                                    .map((item, idx) => (
                                        <DateSchedule key={idx} item={item} bool={false} />
                                    ))
                            }
                            {
                                event.filter(e => e.date === detail && e.category == "#6BAA91")
                                    .map((item, idx) => (
                                        <DateSchedule key={idx} item={item} bool={true} schedules={schedules} />
                                    ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ScheduleMy;