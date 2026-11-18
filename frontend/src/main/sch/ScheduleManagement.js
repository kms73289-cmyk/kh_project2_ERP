import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import './calendar.css';
import { CategoryColor, ChangeMonthBtn, DateSchedule, MonthCalendar } from "../dependence/ScheduleCpnt";
import { colorCategory } from "../dependence/Arr";

function ScheduleManagement({ tasks, projects, schedules, requests }) {
    const today = dayjs();
    const [year, setYear] = useState(today.year()); //년도
    const [month, setMonth] = useState(today.month() + 1); //월(0 ~ 11) + 1
    const [event, setEvent] = useState([]);
    const [detail, setDetail] = useState(today.format("YYYY-MM-DD"));
    
    useEffect(() => {
        const events = [];
        requests.forEach(r => {
            events.push({ title: r.request_title + " 마감", category: colorCategory[0].col, date: r.desired_due_date?.slice(0, 10), label: "고객명", name: r.customer_name });
        });
        projects.forEach(p => {
            events.push({ title: p.project_name + " 시작", category: colorCategory[1].col, date: p.project_start_date.slice(0, 10), label: "담당자", name: p.manager_name });
            events.push({ title: p.project_name + " 마감", category: colorCategory[1].col, date: p.project_end_date.slice(0, 10), label: "담당자", name: p.manager_name });
        });
        tasks.forEach(t => {
            events.push({ title: t.task_name + " 시작", category: colorCategory[2].col, date: t.task_start.slice(0, 10), label: "담당자", name: t.name });
            events.push({ title: t.task_name + " 마감", category: colorCategory[2].col, date: t.task_end.slice(0, 10), label: "담당자", name: t.name });
        });
        schedules.filter(s => !s.hidden).forEach(s => {
            events.push({ title: s.s_content, category: colorCategory[3].col, date: s.s_date.slice(0, 10), label: "등록자", name: s.name });
        });

        setEvent(events);
    }, [tasks, projects, schedules, requests])
    return (
        <div>
            <h1>전체 일정</h1>
            <div className="sch-container">
                <div className="sch-left">
                    <ChangeMonthBtn year={year} setYear={setYear} month={month} setMonth={setMonth} />
                    <MonthCalendar year={year} month={month} event={event} setDetail={setDetail} />
                    <div>
                        <CategoryColor colorCategory={colorCategory}/>
                    </div>
                </div>

                <div className="sch-right">
                    <div className="select-date">
                        <h2>일간 일정</h2>
                        <p>{detail}</p>
                    </div>
                    {
                        event.some(e => e.date === detail) ?
                            event.filter(e => e.date === detail).map((item, idx) => (
                                <DateSchedule key={idx} item={item} bool={false}/>
                            )) :
                            <div className="sch-list" style={{ border: "1px solid var(--color-text)" }}>
                                <p>일정이 없습니다.</p>
                            </div>
                    }
                </div>
            </div>
        </div>

    );
}

export default ScheduleManagement;