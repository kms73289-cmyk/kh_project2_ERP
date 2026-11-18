import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function TransactionForm() {
    const { state } = useLocation();
    const detail = state?.detail;

    const { empid, type, transaction_id } = useParams();
    // navi를 위한 empid | 재사용을 위한 type | api식별을 위한 trasaction_id
    const navi = useNavigate();
    const isEdit = Boolean(transaction_id);
    // transaction_id가 있는 상태면 isedit모드

    const [transaction, setTransaction] = useState({
        transaction_title: "",
        transaction_type: "",
        amount: "",
        transaction_date: "",
        memo: "",
        project_id: "",
        budget_id: ""
    });
    // useState로 무조건 값을 받아오지 않는다 => 생성에서는 초기화가 필요

    const transactionType = isEdit ? transaction.transaction_type : type;
    // isEdit일때 수입인지 지출인지를 결정 
    // 아닐때는 수입등록or지출등록 버튼을 누를때 보낸 파라티머 type으로 수입인지 지출인지 결정
    // (서버 응답 전까지 버튼을 비 활성화 하는 역할도함)

    const [projects, setProjects] = useState([]);
    // 예산과 프로젝트를 select하기 위한 변수

    const [allBudgets, setAllBudgets] = useState([]);
    const yearMonth = transaction.transaction_date.slice(0, 7);

    useEffect(() => {
        if (transactionType !== "EXPENSE") return;

        axios.get("http://localhost:3000/budgets/all")
            .then(({ data }) => {
                setAllBudgets(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error(err);
                setAllBudgets([]);
            });
    }, [transactionType]);

    const budgets = allBudgets.filter(
        (budget) => budget.yearMonth === yearMonth
    );

    // 등록·수정 화면 모두 프로젝트 목록 조회
    useEffect(() => {
        axios.get("http://localhost:3000/projects")
            .then(res => setProjects(res.data))
            .catch(err => {
                console.error(err);
                setProjects([]);
            });
    }, []);

    // 지출 등록에서 거래일과 같은 달의 예산 조회(의존성에 yearMonth)
    useEffect(() => {
        if (!isEdit || !detail || String(detail.transaction_id) !== transaction_id) {
            return;
        }

        setTransaction({
            transaction_title: detail.transaction_title ?? "",
            transaction_type: detail.transaction_type,
            amount: String(detail.amount ?? ""),
            transaction_date: detail.transaction_date?.slice(0, 10) ?? "",
            memo: detail.memo ?? "",
            project_id: String(detail.project_id ?? ""),
            budget_id: String(detail.budget_id ?? ""),
        });
    }, [isEdit, detail, transaction_id]);

    const handleValue = (e) => {
        const { name, value } = e.target;
        const next = { ...transaction, [name]: value };

        if (name === "transaction_date" && value.slice(0, 7) !== yearMonth) {
            next.budget_id = "";
        }

        setTransaction(next);
        // form안에 name이 transaction_date인 input이 바뀔때 현제 yearMonth와 다르면 예산 초기화
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            transaction_title: transaction.transaction_title.trim(),
            amount: Number(transaction.amount),
            transaction_date: transaction.transaction_date,
            memo: transaction.memo
        };

        let request;

        // isEdit가 true냐 false냐에 따라 data뒤에 붙는 항목이 달라진다
        // ...data는 전개구문, 같은 속성명이 있으면 뒤에 적은 값이 적용된다
        // (굳이 안해도 되지만 전개하지 않으면 json이 중첩되며 . 접근이 늘어남)
        // (지금은 같은속성명 값 바꾸는게 아니라 새로운 속성을 추가하는데 사용)
        if (isEdit) {
            request = axios.patch(
                `http://localhost:3000/transactions/${transaction_id}`,
                {
                    ...data,
                    project_id: transaction.project_id
                        ? Number(transaction.project_id)
                        : null,
                    budget_id: transactionType === "EXPENSE" && transaction.budget_id
                        ? Number(transaction.budget_id)
                        : null
                }
            );
        } else {
            request = axios.post("http://localhost:3000/transactions", {
                ...data,
                transaction_type: transactionType,
                project_id: transaction.project_id ? Number(transaction.project_id) : null,
                budget_id: transactionType === "EXPENSE" && transaction.budget_id
                    ? Number(transaction.budget_id)
                    : null,
                created_by: Number(empid)
            });
        }

        // promise객체를 담은 request
        request
            .then((res) => {
                if (!isEdit && res.data.affectedRows === 0) {
                    alert(
                        transactionType === "INCOME"
                            ? "해당 프로젝트를 찾을 수 없습니다."
                            : "거래일과 같은 달의 예산을 선택해 주세요."
                    );
                    return;
                }

                alert(isEdit ? "거래를 수정했습니다." : "거래를 등록했습니다.");
                navi(`/main/${empid}/finance/transactionManagement`);
            })
            .catch((err) => {
                alert("거래 저장에 실패했습니다.");
            });
    };

    let title;
    if (isEdit) {
        title = "거래 수정";
    } else if (type === "INCOME") {
        title = "수입 등록";
    } else if (type === "EXPENSE") {
        title = "지출 등록";
    } else {
        return <p>잘못된 거래 유형입니다.</p>;
        // 화면을 리턴하는 코드는 useEffect보다 아래에 있어야함
    }

    const buttonText = isEdit ? "수정 저장" : title;

    if (isEdit && (!detail || String(detail.transaction_id) !== transaction_id)) {
        return <p>수입·지출 관리 목록에서 수정할 거래를 다시 선택해주세요.</p>;
    }

    return (
        <div className="input">
            <h1>{title}</h1>
            <div className="input-container">
                <form className="erp-form" onSubmit={handleSubmit}>
                    <div className="inputform">
                        <label htmlFor="transaction_title">거래명</label>
                        <div className="input-data">
                            <input
                                id="transaction_title"
                                name="transaction_title"
                                type="text"
                                value={transaction.transaction_title}
                                onChange={handleValue}
                                required
                            />
                        </div>
                    </div>

                    <div className="inputform">
                        <label htmlFor="amount">금액(원)</label>
                        <div className="input-data">
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                min="1"
                                step="1"
                                value={transaction.amount}
                                onChange={handleValue}
                                required
                            />
                        </div>
                    </div>

                    <div className="inputform">
                        <label htmlFor="transaction_date">거래일</label>
                        <div className="input-data">
                            <input
                                id="transaction_date"
                                name="transaction_date"
                                type="date"
                                value={transaction.transaction_date}
                                onChange={handleValue}
                                required
                            />
                        </div>
                    </div>

                    <div className="inputform">
                        <label htmlFor="memo">메모</label>
                        <div className="input-data">
                            <textarea
                                id="memo"
                                name="memo"
                                value={transaction.memo}
                                onChange={handleValue}
                            />
                        </div>
                    </div>


                    <div className="inputform">
                        <label htmlFor="project_id">
                            {transactionType === "INCOME" ? "프로젝트 (필수)" : "프로젝트 (선택)"}
                        </label>
                        <div className="input-data">
                            <select
                                id="project_id"
                                name="project_id"
                                value={transaction.project_id}
                                onChange={handleValue}
                                required={transactionType === "INCOME"}
                            >
                                <option value="">
                                    {transactionType === "INCOME" ? "프로젝트를 선택하세요" : "연결할 프로젝트 없음"}
                                </option>

                                {projects.map(project => (
                                    <option key={project.project_id} value={project.project_id}>
                                        {project.project_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {transactionType === "EXPENSE" && (
                        <div className="inputform">
                            <label htmlFor="budget_id">예산 항목 (필수)</label>
                            <div className="input-data">
                                <select
                                    id="budget_id"
                                    name="budget_id"
                                    value={transaction.budget_id}
                                    onChange={handleValue}
                                    required
                                >
                                    <option value="">
                                        {yearMonth ? "예산을 선택하세요" : "거래일을 먼저 선택하세요"}
                                    </option>

                                    {budgets.map(budget => (
                                        <option key={budget.budget_id} value={budget.budget_id}>
                                            {budget.budget_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <button className="input-submit" type="submit" disabled={isEdit && !transactionType}>
                        {buttonText}
                    </button>
                    {/* 서버 응답전에는 비 활성화 */}

                </form>
            </div>
        </div>
    );
}

export default TransactionForm;