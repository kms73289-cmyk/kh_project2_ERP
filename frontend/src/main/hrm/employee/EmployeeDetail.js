import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const is_admin = empl?.is_admin == 1;
    const [employee, setEmployee] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:3000/searchMember")
            .then((res) => {
                console.log("조회 결과:", res.data);
                console.log("현재 ID:", id);

                const selectedEmployee = res.data.find(
                    e => Number(e.employee_id) === Number(id)
                );
                setEmployee(selectedEmployee || null);
            });
    }, [id]);
    if (!employee) {
        return <div>직원 정보를 불러오는 중...</div>;
    }
    const handleResign = () => {
        if (employee.employment_status === "퇴사") {
            alert("이미 퇴사 처리된 직원입니다.");
            return;
        }
        if (window.confirm(`${employee?.name || "해당 직원"} 님을 정말 퇴사 처리하시겠습니까?`)) {
            axios.put(`http://localhost:3000/employees/${id}/resign`)
                .then(() => {
                    alert("퇴사 처리가 완료되었습니다.");

                    axios.get("http://localhost:3000/searchMember")
                        .then((res) => {
                            const updatedEmployee = res.data.find(
                                e => Number(e.employee_id) === Number(id)
                            );
                            setEmployee(updatedEmployee || null);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    alert("퇴사 처리에 실패했습니다.");
                });
        }
    };

    return (
        <div>
            <h1>직원 상세정보</h1>
            <div className="container">
                <div className="half">
                    <div className="right-detailInfo">
                        <h3>인사 정보</h3>
                        <p><span>부서</span>{employee?.department_name || "-"}</p>
                        <p><span>직급</span>{employee.position || "-"}</p>
                        <p><span>고용 형태</span>{employee.employment_type || "-"}</p>
                        <p><span>입사일</span>{employee.hire_date ? String(employee.hire_date).slice(0, 10) : "-"}</p>
                        <p><span>재직 상태</span>{employee.employment_status || "-"}</p>
                        <p><span>퇴사일</span>{employee.resignation_date ? String(employee.resignation_date).slice(0, 10) : "-"}</p>
                        {
                            is_admin && (<div className="edit-delete">
                                <button className="edit-button" type="button" onClick={()=>navigate(`../hrm/employeesform/${id}`, {state:{e:employee}})}>수정</button>
                                {employee?.employment_status !== "퇴사" && (
                                    <button className="delete-button" type="button" onClick={handleResign}>퇴사 처리</button>
                                )}
                            </div>)
                        }
                    </div>
                </div>
                <div className="half">
                    <div className="right-detailInfo">
                        <h3>기본 정보</h3>
                        <p><span>이름</span>{employee?.name}</p>
                        <p><span>사번</span>{employee.employee_id}</p>
                        <p><span>연락처</span>{employee.phone}</p>
                        <p><span>이메일</span>{employee?.email || "-"}</p>
                        <p><span>주소</span>{employee?.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetail;