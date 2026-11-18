import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function EmployeeForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const loc = useLocation();
    const e = loc.state?.e;

    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const is_admin = empl?.is_admin == 1;

    const handleSubmit = () => {
        axios.put(`http://localhost:3000/employees/${id}`, formData)
            .then(() => {
                alert("직원 수정 성공");
                navigate("../hrm/employees");
            })
            .catch(() => {
                alert("직원 수정 실패");
            })
    };

    const [formData, setFormData] = useState({
        name: e?.name || "",
        phone: e?.phone || "",
        email: e?.email || "",
        address: e?.address || "",
        department_id: e?.department_id || "",
        position: e?.position || "",
        employment_type: e?.employment_type || "",
        hire_date: e?.hire_date
            ? String(e.hire_date).slice(0, 10)
            : "",
        employment_status: e?.employment_status || "재직"
    });

    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3000/departments")
            .then((res) => {
                setDepartments(res.data);
            })
    }, []);

    return (
        <div className="input">
            <h1>직원 수정</h1>
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <div className="container">
                        <div className="half">
                            <h3>기본 정보</h3>

                            <div className="inputform">
                                <label>이름</label>
                                <div className="input-data">
                                    <input value={formData.name} required readOnly={Number(e?.employee_id) !== Number(empid)} />
                                </div>
                            </div>

                            <div className="inputform">
                                <label>연락처</label>
                                <div className="input-data">
                                    <input
                                        placeholder="010-0000-0000"
                                        value={formData.phone}
                                        readOnly={Number(e?.employee_id) !== Number(empid)}
                                        required
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                                            const phone = value.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3").replace(/-$/, "");
                                            setFormData({ ...formData, phone });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="inputform">
                                <label>이메일</label>
                                <div className="input-data"><input value={formData.email} readOnly /></div>
                            </div>

                            <div className="inputform">
                                <label>주소</label>
                                <div className="input-data"><input
                                    placeholder="주소 입력"
                                    value={formData.address}
                                    readOnly={Number(e?.employee_id) !== Number(empid)}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                /></div>
                            </div>
                        </div>

                        {is_admin && (
                            <div className="half">
                                <h3>인사 정보</h3>

                                <div className="inputform">
                                    <label>부서</label>
                                    <div className="input-data">
                                        <select
                                            value={formData.department_id}
                                            required
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                department_id: e.target.value ? Number(e.target.value) : ""
                                            })}
                                        >
                                            <option value="">부서 선택</option>
                                            {departments.map((department) => (
                                                <option key={department.department_id} value={department.department_id}>
                                                    {department.department_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="inputform">
                                    <label>직급</label>
                                    <div className="input-data">
                                        <select
                                            value={formData.position}
                                            required
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        >
                                            <option value="">직급 선택</option>
                                            <option value="사원">사원</option>
                                            <option value="대리">대리</option>
                                            <option value="과장">과장</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="inputform">
                                    <label>고용 형태</label>
                                    <div className="input-data">
                                        <select
                                            value={formData.employment_type}
                                            required
                                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                        >
                                            <option value="">고용 형태 선택</option>
                                            <option value="정규직">정규직</option>
                                            <option value="계약직">계약직</option>
                                            <option value="인턴">인턴</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="inputform">
                                    <label>입사일</label>
                                    <div className="input-data"><input
                                        type="date"
                                        value={formData.hire_date}
                                        required
                                        onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                                    /></div>
                                </div>

                                <div className="inputform">
                                    <label>재직 상태</label>
                                    <div className="input-data">
                                        <select
                                            value={formData.employment_status}
                                            onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}>
                                            <option value="재직">재직</option>
                                            <option value="휴직">휴직</option>
                                            <option value="퇴사">퇴사</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button className="input-submit">수정</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeForm;
