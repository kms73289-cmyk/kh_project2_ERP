import axios from "axios";
import React, { useEffect, useState } from "react";

import { ShowBoxNumber } from "../../dependence/Cpnt";
import "../hrm.css";

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);

    // 한국 시간 기준 오늘 날짜
    const today = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Seoul"
    });

    // 날짜 기본값을 오늘로 설정
    const [summaryDate, setSummaryDate] = useState(today);
    const [selectedDate, setSelectedDate] = useState(today);

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchName, setSearchName] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/attendance")
            .then((res) => {
                console.log(res.data);
                setAttendance(res.data);
            });
        axios.get("http://localhost:3000/searchMember")
            .then((res) => {
                setEmployees(res.data);
            });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDepartment, selectedStatus, selectedDate, searchName]);

    const filteredAttendance = attendance.filter((record) => {
        return (
            (selectedDepartment === "" || record?.department_name === selectedDepartment) &&
            (selectedStatus === "" || record.attendance_status === selectedStatus) &&
            (selectedDate === "" || String(record.attendance_date).slice(0, 10) === selectedDate) &&
            (searchName === "" || record?.name.includes(searchName))
        );
    });

    const summaryAttendance = attendance.filter(
        (record) => summaryDate === "" ||
            String(record.attendance_date).slice(0, 10) === summaryDate
    );

    //페이지네이션
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredAttendance.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleSaveAttendance = async (record) => {
        try {
            await axios.put(
                `http://localhost:3000/attendance/${record.attendance_id}`,
                {
                    check_in: record.checkIn || null,
                    check_out: record.checkOut || null,
                    attendance_status: record.status
                }
            );
            const res = await axios.get("http://localhost:3000/attendance");
            setAttendance(res.data);

            setSelectedRecord(null);
            alert("근태 기록이 수정되었습니다.");
        } catch (err) {
            console.log(err.response?.data);
            console.log(err);
            alert("근태 기록 수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>근태관리</h1>

            <div className="box-container">
                <ShowBoxNumber txt={"전체직원"} length={employees.length} cnt={true} />
                <ShowBoxNumber txt={"정상출근"} length={summaryAttendance.filter((record) => record.attendance_status === "정상").length} cnt={true} />
                <ShowBoxNumber txt={"지각"} length={summaryAttendance.filter((record) => record.attendance_status === "지각").length} cnt={true} />
                <ShowBoxNumber txt={"미출근"} length={summaryAttendance.filter((record) => record.attendance_status === "결근").length} cnt={true} />
            </div>

            <div className="container-top">
                <div className="select-date">
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">전체부서</option>
                        <option value="경영지원팀">경영지원팀</option>
                        <option value="인사팀">인사팀</option>
                        <option value="영업팀">영업팀</option>
                        <option value="개발팀">개발팀</option>
                    </select>

                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">전체 근태상태</option>
                        <option value="정상">정상 출근</option>
                        <option value="지각">지각</option>
                        <option value="조퇴">조퇴</option>
                        <option value="결근">결근</option>
                    </select>
                    <label>날짜 조회</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="top-searchinput">
                    <input placeholder="직원명 검색" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                </div>
            </div>
            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>사번</th>
                                <th>직원명</th>
                                <th>부서</th>
                                <th>날짜</th>
                                <th>출근시간</th>
                                <th>퇴근시간</th>
                                <th>근태상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="8">검색 결과가 없습니다.</td>
                                </tr>
                            ) : (
                                currentItems.map((record) => (
                                    <tr key={record.attendance_id}>
                                        <td>E{String(record.employee_id).padStart(4, "0")}</td>
                                        <td>
                                            {record.name}
                                        </td>
                                        <td>
                                            {record.department_name}
                                        </td>
                                        <td>{String(record.attendance_date).slice(0, 10)}</td>
                                        <td>{record.check_in || "-"}</td>
                                        <td>{record.check_out || "-"}</td>
                                        <td>{record.attendance_status}</td>
                                        <td><button className="edit-button" type="button" onClick={() => setSelectedRecord(record)}>수정</button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="select-date">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={totalPages === 0 || currentPage <= 1}
                        >
                            &lt;
                        </button>
                        {currentPage}
                        <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={totalPages === 0 || currentPage >= totalPages} >
                            &gt;
                        </button>
                    </div>
                </div>
                {selectedRecord && (
                    <AttendanceEditModal record={selectedRecord} onClose={() => setSelectedRecord(null)} onSave={handleSaveAttendance} />
                )}
            </div>
        </div>

    )
}

function AttendanceEditModal({ record, onClose, onSave }) {

    const [currentRecord, setCurrentRecord] = useState({
        attendance_id: record.attendance_id,
        employee_id: record.employee_id,
        date: String(record.attendance_date).slice(0, 10),
        checkIn: record.check_in?.slice(0, 5) || "",
        checkOut: record.check_out?.slice(0, 5) || "",
        status: record.attendance_status
    });
    const handleSave = () => {
        onSave(currentRecord);
    };

    return (
        <div className="right">
            <form onSubmit={handleSave}>
                <div className="right-detailInfo">
                    <h3>근태 기록 수정</h3>
                    <p><span>사번</span> E{String(currentRecord.employee_id).padStart(4, "0")}</p>
                    <div>
                        <label>근무일자</label>
                        <input
                            type="date"
                            value={currentRecord.date}
                            disabled
                        />
                    </div>
                    <div>
                        <label>출근 시간</label>
                        <input
                            type="time"
                            value={currentRecord.checkIn}
                            onChange={(e) => setCurrentRecord({ ...currentRecord, checkIn: e.target.value })}
                        />
                    </div>

                    <div>
                        <label >퇴근 시간</label>
                        <input
                            type="time"
                            value={currentRecord.checkOut}
                            onChange={(e) => setCurrentRecord({ ...currentRecord, checkOut: e.target.value })}

                        />
                    </div>

                    <div>
                        <label >근태 상태</label>
                        <select
                            value={currentRecord.status}
                            onChange={(e) => setCurrentRecord({ ...currentRecord, status: e.target.value })}
                        >
                            <option value="정상">정상</option>
                            <option value="지각">지각</option>
                            <option value="조퇴">조퇴</option>
                            <option value="결근">결근</option>
                        </select>
                    </div>
                </div>
                <div className="edit-delete">
                    <button className="edit-button">
                        저장
                    </button>
                    <button className="delete-button" type="button" onClick={onClose}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Attendance;