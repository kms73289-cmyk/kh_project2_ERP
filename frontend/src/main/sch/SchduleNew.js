import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { handleSubmit } from "../dependence/Func";

function ScheduleNew({ empid, bool }) {
    const location = useLocation();
    const sch = location.state?.item;
    const today = dayjs().format("YYYY-MM-DD");

    const [input, setInput] = useState(
        bool ?
            { content: "", empid: empid, hidden: false, s_date: today } :
            { sid: sch.schedule_id, content: sch.s_content, hidden: sch.hidden, s_date: dayjs(sch.s_date).format("YYYY-MM-DD") }
    );
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setInput({ ...input, [name]: type === "checkbox" ? checked : value });
    };
    return (
        <div className="input">
            {bool ? <h1>내 일정 등록</h1> : <h1>내 일정 수정</h1>}
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = { ...input };
                    handleSubmit({
                        data: data, bool: bool, saveAdress: "saveSchedule", updateAdress: "updateSchedule",
                        mainPage: "schedules/scheduleMain", txt: "일정"
                    });
                }}>
                    <div className="inputform">
                        <label>일정 내용</label>
                        <div className="input-data"><input type="text" name="content" value={input.content} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>나만보기</label>
                        <div className="input-data"><input type="checkbox" name="hidden" value={input.hidden} onChange={handleChange} /></div>
                    </div>
                    <div className="inputform">
                        <label>날짜</label>
                        <div className="input-data"><input type="date" name="s_date" min={bool ? today : undefined} value={input.s_date} onChange={handleChange} required /></div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default ScheduleNew;