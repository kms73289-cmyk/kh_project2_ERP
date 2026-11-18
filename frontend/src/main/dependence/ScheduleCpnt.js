import React from "react";
import dayjs from "dayjs";
import { EditDeleteButton } from "./Cpnt";

export function MonthCalendar({ year, month, event, setDetail }) {
    const firstDay = dayjs(`${year}-${month}-01`).day(); // 1일의 요일 (일요일 = 0)
    const lastDate = dayjs(`${year}-${month}-01`).daysInMonth(); // 해당 월의 마지막 날짜
    const weekcnt = Math.ceil((firstDay + lastDate) / 7);

    return (
        <div className="calendar">
            <table border="1">
                <thead>
                    <tr>
                        {
                            ["일", "월", "화", "수", "목", "금", "토"].map(txt => {
                                if (txt === "일")
                                    return <th className="thsun" key={txt}>{txt}</th>
                                if (txt === "토")
                                    return <th className="thsat" key={txt}>{txt}</th>
                                else
                                    return <th className="thnone" key={txt}>{txt}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from({ length: weekcnt }, (_, w) => (
                            <tr key={w}>
                                {
                                    Array.from({ length: 7 }, (_, d) => {
                                        const date = w * 7 + d - firstDay + 1;
                                        return date < 1 || date > lastDate ?
                                            <td className={d === 0 ? "tdsun" : d === 6 ? "tdsat" : ""} key={d}></td> :
                                            <td className={d === 0 ? "tdsun" : d === 6 ? "tdsat" : ""} key={d}
                                                onClick={() => setDetail(dayjs(`${year}-${month}-${date}`).format("YYYY-MM-DD"))}>
                                                <div>{date}</div>
                                                {
                                                    event.filter(e => e.date === dayjs(`${year}-${month}-${date}`).format("YYYY-MM-DD"))
                                                        .filter((e, idx, arr) => arr.findIndex(item => item.category === e.category) === idx)
                                                        .map(evt => (
                                                            <div className="full" key={date} type="button"
                                                                style={{ backgroundColor: `${evt.category}` }}>
                                                            </div>
                                                        ))
                                                }
                                            </td>
                                    })
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

//달력 카테고리별 색상
export function CategoryColor({ colorCategory }) {
    return (
        <div>
            {
                colorCategory.map(c => (
                    <p className="inline-p">
                        <span style={{ color: `${c.col}` }}>●</span>{c.ctgr}
                    </p>
                ))
            }
        </div>
    );
}

//달력 버튼
export function ChangeMonthBtn({ year, setYear, month, setMonth }) {
    const changeMonth = (n) => {
        const next = Number(month + n);
        if (next > 12 || next < 1)
            setYear(year + n);
        setMonth((next + 11) % 12 + 1);
    }
    return (
        <div className="select-date">
            <h2>월간 달력</h2>
            <span>{year} 년</span>
            <button type="button" onClick={() => changeMonth(-1)}>&lt;</button>
            <span>{month} 월</span>
            <button type="button" onClick={() => changeMonth(1)}>&gt;</button>
        </div>
    );
}

//일일 일정
export function DateSchedule({ item, bool, schedules }) {
    return (
        <div className="sch-list" style={{ border: `1px solid ${item.category}` }}>
            <h4 style={{ color: `${item.category}` }}>{item.title}</h4>
            <p><span>{item.label}</span> {item.name}</p>
            {bool && (
                <EditDeleteButton txt={"일정"} item={schedules.find(s => s.schedule_id === item.id)} id={item.id} address={"delsch"} editPage={"schedules/scheduleNew"} />
            )}
        </div>
    );
}

export function WeekSchedule({ item, startDate }) {
    if (startDate.isAfter(dayjs(item.task_end), "day") || dayjs(item.task_start_date).isAfter(startDate.add(6, "day"), "day"))
        return null;
    const start = Math.max(1, dayjs(item.task_start).diff(startDate, "day") + 1);
    const end = Math.min(8, dayjs(item.task_end).diff(startDate, "day") + 2);
    return (
        <div className="chart-box" key={item.task_id}>
            <div className="chart-title">{item.task_name}</div>
            <div className="chart-week">
                <div className="chart-bar" style={{ gridColumn: `${start}/${end}`, backgroundColor: "darkCyan" }}>
                    {item.task_name}
                    <span>{dayjs(item.task_start).format("MM/DD")} - {dayjs(item.task_end).format("MM/DD")}</span>
                </div>
            </div>
        </div>
    );
}