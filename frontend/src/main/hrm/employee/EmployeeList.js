import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { ShowBoxNumber } from "../../dependence/Cpnt";
import "../hrm.css";

function EmployeeList() {
    //데이터 조회
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [editingDepartmentId, setEditingDepartmentId] = useState(null);
    const [editingDepartmentName, setEditingDepartmentName] = useState("");

    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const is_admin = empl?.is_admin == 1;

    const loadEmployees = () => {
        axios.get("http://localhost:3000/searchMember")
            .then(res => {
                setEmployees(res.data);
            });
        axios.get("http://localhost:3000/departments")
            .then(res => {
                setDepartments(res.data);
            });
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const addDepartment = () => {
        if (!newDepartmentName.trim()) {
            alert("부서명을 입력하세요.");
            return;
        }
        axios.post("http://localhost:3000/departments", {
            department_name: newDepartmentName.trim()
        })
            .then(() => {
                alert("부서가 등록되었습니다.");
                setNewDepartmentName("")
                loadEmployees();
            })
            .catch(err => {
                alert("부서 등록에 실패했습니다.");
            });
    };

    //부서 수정
    const startEditDepartment = (dept) => {
        setEditingDepartmentId(dept.department_id);
        setEditingDepartmentName(dept.department_name);
    };

    const saveDepartment = () => {
        if (!editingDepartmentName.trim()) {
            return;
        }
        axios.put(`http://localhost:3000/departments/${editingDepartmentId}`, {
            department_name: editingDepartmentName.trim()
        })
            .then(() => {
                setEditingDepartmentId(null);
                setEditingDepartmentName("");
                loadEmployees();
            })
            .catch(err => { alert("부서 수정에 실패했습니다."); });
    };

    //부서삭제
    const deleteDepartment = (dept) => {
        const employeeCount = employees.filter(
            emp => Number(emp.department_id) === Number(dept.department_id)
        ).length;

        if (employeeCount > 0) {
            alert("소속 직원이 있는 부서는 삭제할 수 없습니다.")
            return;
        }
        if (!window.confirm("해당 부서를 삭제하시겠습니까?")) {
            return;
        }
        axios.delete(`http://localhost:3000/departments/${dept.department_id}`)
            .then(() => {
                alert("부서가 삭제되었습니다.");
                loadEmployees();
            })
            .catch(err => {
                alert("부서 삭제에 실패했습니다.");
                console.error(err);
            });
    };

    // 필터링
    const [selectedDept, setSelectedDept] = useState("전체 부서");
    const [selectedPosition, setSelectedPosition] = useState("전체 직급");
    const [selectedStatus, setSelectedStatus] = useState("전체 재직 상태");

    const [searchName, setSearchName] = useState("");

    const filteredEmployees = employees.filter((employee) => {
        const department = departments.find(
            d => Number(d.department_id) === Number(employee.department_id)
        );
        return (
            (selectedDept === "전체 부서" || department?.department_name === selectedDept) &&
            (selectedPosition === "전체 직급" || employee.position === selectedPosition) &&
            (selectedStatus === "전체 재직 상태" || employee.employment_status === selectedStatus) &&
            (searchName.trim() === "" || employee?.name?.includes(searchName.trim()))
        );
    });
    //페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentEmployees = filteredEmployees.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    //부서
    const [newDepartmentName, setNewDepartmentName] = useState("");

    return (
        <div>
            <h1>직원·부서관리</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"직원 수"} length={filteredEmployees.length} />
            </div>
            <div className="container-top">
                <div className="select-date">
                    <select
                        value={selectedDept}
                        onChange={(e) => {
                            setSelectedDept(e.target.value);
                            setCurrentPage(1);
                        }}>
                        <option value="전체 부서">전체 부서</option>
                        {departments.map(dept => (
                            <option key={dept.department_id} value={dept.department_name}>
                                {dept.department_name}
                            </option>
                        ))}
                    </select>
                    <select value={selectedPosition} onChange={(e) => { setSelectedPosition(e.target.value); setCurrentPage(1); }}>
                        <option value="전체 직급">전체 직급</option>
                        <option value="사원">사원</option>
                        <option value="대리">대리</option>
                        <option value="과장">과장</option>
                    </select>
                    <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}>
                        <option value="전체 재직 상태">전체 재직 상태</option>
                        <option value="재직">재직</option>
                        <option value="퇴사">퇴사</option>
                    </select>
                </div>
                <div className="top-searchinput">
                    <input placeholder="직원명 검색" value={searchName} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }} />
                </div>
            </div>

            <div className="container">
                <div className="half">
                    <h3>사원 관리</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>사번</th>
                                <th>이름</th>
                                <th>부서</th>
                                <th>직급</th>
                                <th>입사일</th>
                                <th>재직 상태</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEmployees.length > 0 ? (
                                currentEmployees.map(employee => (
                                    <tr key={employee.employee_id}>
                                        <td>
                                            E{String(employee.employee_id).padStart(4, "0")}
                                        </td>
                                        <td><Link to={`../hrm/employeesdetail/${employee.employee_id}`}>
                                            <b>{employee.name}</b>
                                        </Link></td>
                                        <td>{employee.department_name}</td>
                                        <td>{employee.position}</td>
                                        <td>
                                            {employee.hire_date
                                                ? String(employee.hire_date).slice(0, 10)
                                                : "-"}
                                        </td>
                                        <td>{employee.employment_status}</td>
                                    </tr>
                                ))
                            ) : (<tr>
                                <td colSpan="6">검색 결과가 없습니다</td>
                            </tr>)}
                        </tbody>
                    </table>

                    <div className="select-date">
                        <button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={totalPages === 0 || currentPage <= 1} >
                            &lt;
                        </button>
                        <span> {currentPage}</span>
                        <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={totalPages === 0 || currentPage >= totalPages} >
                            &gt;
                        </button>
                    </div>
                </div>
                <div className="half">
                    <h3>부서 관리</h3>
                    <div>
                        <div className="half-input">
                            <label>신규 부서 등록</label>
                            <input placeholder="부서명을 입력하세요" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} />
                            <button type="button" onClick={addDepartment}>등록</button>
                        </div>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>부서명</th>
                                    <th>담당자</th>
                                    <th>사원</th>
                                    <th colSpan="2">비고</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map(dept => (
                                    <tr key={dept.department_id}>
                                        <td style={{ width: "26%" }}>
                                            {editingDepartmentId === dept.department_id ? (
                                                <input value={editingDepartmentName} onChange={(e) => setEditingDepartmentName(e.target.value)} />
                                            ) : (dept.department_name)}
                                        </td>
                                        <td>
                                            {dept.name}
                                        </td>
                                        <td>{employees.filter(
                                            emp => Number(emp.department_id) === Number(dept.department_id)
                                        ).length}명</td>
                                        <td style={{ width: "24%" }}>
                                            {is_admin && (
                                                <>
                                                    <button className="edit-button" type="button" onClick={() => startEditDepartment(dept)}>수정</button>
                                                    <button className="delete-button" type="button" onClick={() => deleteDepartment(dept)}>삭제</button>
                                                </>
                                            )}
                                        </td>
                                        <td style={{ width: "24%" }}>
                                            {editingDepartmentId === dept.department_id && (
                                                <>
                                                    <button className="edit-button" type="button" onClick={saveDepartment}>저장</button>
                                                    <button className="delete-button" type="button" onClick={() => setEditingDepartmentId(null)}>취소</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeList;