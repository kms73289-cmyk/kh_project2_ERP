import axios from "axios";
import React, { useEffect, useState } from "react";

import { ShowBoxNumber } from "../dependence/Cpnt";
import "./hrm.css";

function HRMDashboard() {
    const [employees, setEmployees] = useState([]);
    const [summaryAttendance, setSummaryAttendance] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [departments, setDepartments] = useState([]);

    const today = new Date().toLocaleDateString("sv-SE", {timeZone: "Asia/Seoul"});

    useEffect(() => {
        axios.get("http://localhost:3000/searchMember")
            .then((res) => setEmployees(res.data));
        axios.get("http://localhost:3000/attendance")
            .then((res) => setSummaryAttendance(res.data));
        axios.get("http://localhost:3000/leave")
            .then((res) => setLeaveRequests(res.data))
        axios.get("http://localhost:3000/departments")
            .then((res) => setDepartments(res.data))
    }, []);

    const departmentCounts = departments.map((department) => ([
        department.department_name,
        employees.filter(
            (employee) =>
                Number(employee.department_id) === Number(department.department_id) &&
                employee.employment_status !== "퇴사"
        ).length
    ]));

    const currentMonth = today.slice(0, 7);
    const monthlyAttendance = summaryAttendance.filter(
        (record) => record.attendance_date?.slice(0, 7) === currentMonth
    );
    const todayLeaveCount = leaveRequests.filter((record) =>
        record.request_status === "승인" &&
        record.leave_start_date?.slice(0, 10) <= today &&
        record.leave_end_date?.slice(0, 10) >= today
    ).length;

    return (
        <div>
            <h1>인사현황</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"전체 직원"} cnt={true} length={employees.filter(e => e.employment_status !== "퇴사").length} />
                <ShowBoxNumber txt={"오늘 출근"} cnt={true} length={summaryAttendance.filter((record) =>
                    record.attendance_date?.slice(0, 10) === today &&
                    record.attendance_status === "정상").length} />
                <ShowBoxNumber txt={"연차 사용"} cnt={true} length={todayLeaveCount} />
                <ShowBoxNumber txt={"미출근"} cnt={true} length={summaryAttendance.filter((record) =>
                    record.attendance_date?.slice(0, 10) === today &&
                    record.attendance_status === "결근").length} />
            </div>
            <div className="container-top">
                <p>{today}</p>
            </div>
            <div className="container">
                <div className="center">
                    <div className="center-listout">
                        <h3>부서별 직원 현황</h3>
                        {departmentCounts.map((department, index) => (
                            <div className="dept-list" key={index}>
                                <p>{department[0]}</p>
                                <p>{department[1]}명</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right">
                    <div className="right-detailInfo">
                        <h3>이번 달 근태 현황</h3>
                        <p><span>정상 출근</span>{monthlyAttendance.filter((record) => record.attendance_status === "정상").length}건</p>
                        <p><span>지각</span>{monthlyAttendance.filter((record) => record.attendance_status === "지각").length}건</p>
                        <p><span>조퇴</span>{monthlyAttendance.filter((record) => record.attendance_status === "조퇴").length}건</p>
                        <p><span>결근</span>{monthlyAttendance.filter((record) => record.attendance_status === "결근").length}건</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HRMDashboard;