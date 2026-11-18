import React, { useEffect, useState } from "react";
import axios from "axios";

function LeaveList() {
    const [leave, setLeave] = useState([]);//연차 데이터
    const [searchName, setSearchName] = useState("");// 이름 검색
    const [searchStatus, setSearchStatus] = useState("대기");// 상태 검색

    const [edit, setEdit] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:3000/leave")
            .then((res) => setLeave(res.data));
    }, []);

    return (
        <div>
            <h1>연차 관리</h1>
            <div className="container-top">
                <div className="top-searchinput">
                    <label>신청자</label>
                    <input placeholder="사원명" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <label>상태</label>
                    <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                        <option value="전체">전체</option>
                        <option value="대기">대기</option>
                        <option value="승인">승인</option>
                        <option value="반려">반려</option>
                        <option value="취소">취소</option>
                    </select>
                    <button type="button" onClick={() => {
                        setSearchName("");
                        setSearchStatus("대기");
                    }}>초기화</button>
                </div>
            </div>

            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>신청자</th>
                                <th>신청 기간</th>
                                <th>신청 사유</th>
                                <th>신청일</th>
                                <th>상태</th>
                                <th>비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leave.filter(l => (l.name || "").includes(searchName) && (searchStatus === "전체" || l.request_status === searchStatus))
                                    .map((l) => (
                                        <tr key={l.request_id} >
                                            <td>{l.name}</td>
                                            <td>{String(l.leave_start_date).slice(0, 10)}
                                                {"~"}{String(l.leave_end_date).slice(0, 10)}
                                            </td>
                                            <td>{l.leave_reason}</td>
                                            <td>{String(l.created_at).slice(0, 10)}</td>
                                            <td>{l.request_status}</td>
                                            <td>
                                                {l.request_status === "대기" && (
                                                    <button type="button" className="edit-button"
                                                        onClick={() => setEdit(l)}>
                                                        변경
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
                {edit && (<LeaveApproval leave={edit} />)}
            </div>
        </div>
    )
}

function LeaveApproval({ leave }) {
    const rejectLeave = () => {
        if (!window.confirm("해당 연차 신청을 반려하시겠습니까?")) {
            return;
        }
        axios.put(`http://localhost:3000/leave/${leave?.request_id}/reject`)
            .then(() => {
                alert("반려 처리되었습니다.");
                window.location.reload();
            })
            .catch((err) => {
                alert("반려 처리에 실패했습니다.")
            });
    };
    const approveLeave = () => {
        if (!window.confirm("해당 연차 신청을 승인하시겠습니까?")) {
            return;
        }
        axios.put(`http://localhost:3000/leave/${leave?.request_id}/approve`)
            .then(() => {
                alert("승인 처리되었습니다.")
                window.location.reload();
            })
            .catch((err) => {
                if (err.response?.data === "잔여 연차가 부족합니다.") {
                    alert("남은 연차 신청일이 없습니다.");
                } else {
                    alert("승인 처리에 실패했습니다.");
                }
            });
    };
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>{leave?.name || "-"}</h3>
                <p>
                    <span>신청 기간</span>
                    {leave ? String(leave.leave_start_date).slice(0, 10) : "-"}
                    {" ~ "}
                    {leave ? String(leave.leave_end_date).slice(0, 10) : "-"}
                </p>
                <p><span>신청일</span>{leave ? String(leave.created_at).slice(0, 10) : "-"}</p>
                <p><span>신청 사유</span>{leave?.leave_reason || "-"}</p>
            </div>
            {
                leave?.request_status === "대기" && (
                    <div className="edit-delete">
                        <button className="edit-button" type="button" onClick={approveLeave}>승인하기</button>
                        <button className="delete-button" type="button" onClick={rejectLeave}>반려하기</button>
                    </div>
                )
            }
        </div>
    )
}
export default LeaveList;