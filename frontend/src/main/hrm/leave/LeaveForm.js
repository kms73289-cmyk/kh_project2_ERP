import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LeaveForm() {
    const navigate = useNavigate();
    const today =new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(startDate);
    const [reason, setReason] = useState("");

    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end - start;
        return diff / (1000 * 60 * 60 * 24) + 1;
    }
    const validateDates = () => {
        if (!startDate || !endDate) {
            alert("연차 시작일과 종료일을 선택해 주세요.");
            return false;
        }
        if (startDate > endDate) {
            alert("종료일은 시작일보다 빠를 수 없습니다.");
            return false;
        }
        return true;
    };
    const handleSubmit = () => {
        if (!validateDates()) return;
        if (!reason.trim()) {
            alert("신청 사유를 입력해 주세요.");
            return;
        }
        axios.post("http://localhost:3000/leave", {
            employee_id: empid,
            leave_start_date: startDate,
            leave_end_date: endDate,
            leave_days: calculateDays(),
            leave_reason: reason
        })
            .then(() => {
                alert("연차 신청이 완료되었습니다.");
                navigate(-1);
            })
            .catch((err) => {
                console.log(err);
                alert("연차 신청에 실패했습니다.");
            });
    }

    return (
        <div className="input">
            <h1>연차 신청</h1>
            <div className="input-container">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="inputform">
                        <label>연차 시작일</label>
                        <div className="input-data"><input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                    </div>
                    <div className="inputform">
                        <label>연차 종료일</label>
                        <div className="input-data"><input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                    </div>
                    <div className="inputform">
                        <label>신청 일수</label>
                        <div className="input-data">{calculateDays()}일</div>
                    </div>
                    <div className="inputform">
                        <label>신청 사유</label>
                        <div className="input-data">
                            <textarea
                                placeholder="신청 사유를 입력해주세요."
                                value={reason} rows="3" maxLength="200"
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="input-submit">신청하기</button>
                </form>
            </div>
        </div>
    );
}

export default LeaveForm;