import axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";

function BudgetManagement({ is_admin }) {

    const [allBudgets, setAllBudgets] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const [year, setYear] = useState(() =>
        String(new Date().getFullYear())
    );
    const [month, setMonth] = useState(() =>
        String(new Date().getMonth() + 1).padStart(2, "0")
    );
    // 날짜가 바뀌어도 현제 날짜로 시작하게 만듬
    const yearMonth = `${year}-${month}`;
    // 글자 이어 붙여서 yearMonth => db조회 시 필요
    const [refreshCount, setRefreshCount] = useState(0);
    // 삭제후 재조회를 위한 useEffect의 의존성

    const currentYear = new Date().getFullYear();
    const years = [];

    for (let y = currentYear - 3; y <= currentYear + 1; y++) {
        years.push(String(y));
    }
    // 체크박스에서 선택하는 year 범위 선택

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3000/budgets/all"),
            axios.get("http://localhost:3000/budgets/expenses"),
        ])
            .then(([budgetRes, expenseRes]) => {
                setAllBudgets(budgetRes.data);
                setAllExpenses(expenseRes.data);
            })
            .catch((err) => {
                console.error(err);
                setAllBudgets([]);
                setAllExpenses([]);
            });
    }, [refreshCount]);

    const budgetCategory = allBudgets.filter(
        (budget) => budget.yearMonth === yearMonth
    );

    const budgetIds = new Set(
        budgetCategory.map((budget) => String(budget.budget_id))
    );

    const expenses = allExpenses.filter(
        (expense) => budgetIds.has(String(expense.budget_id))
    );

    const detail =
        budgetCategory.find(
            (budget) => budget.budget_id === selectedBudgetId
        ) ?? budgetCategory[0] ?? null;

    const totalBudget = budgetCategory.reduce(
        (sum, budget) => sum + Number(budget.budget_amount),
        0
    );
    // reduce로 합계 구하기

    const totalUsed = expenses.reduce(
        (sum, expense) => sum + Number(expense.expense_amount),
        0
    );

    const remainingBudget = totalBudget - totalUsed;

    // 예산 항목 삭제
    const budgetDelete = () => {
        if (!detail) return;
        const id = detail.budget_id;
        if (!window.confirm(`'${detail.budget_name}' 예산을 삭제할까요?`)) return;

        axios.delete(`http://localhost:3000/budgets/${id}`)
            .then(() => {
                setRefreshCount(count => count + 1);
                // 항목 삭제 후 refresh(useEffect의 의존성 호출)
            })
            .catch(err => {
                alert(err.response?.data?.message || "예산 삭제에 실패했습니다.");
            });
    };

    return (
        <div>
            <h1>예산관리</h1>
            <div className="box-container">
                <ShowBoxNumber txt="총예산" length={`${totalBudget.toLocaleString("ko-KR")}원`} />
                {/* toLocaleString 숫자를 지정한 지역의 표기 방식에 맞춰 문자열로 바꿔주는 함수 */}

                <ShowBoxNumber txt="사용액" length={`${totalUsed.toLocaleString("ko-KR")}원`} />

                <ShowBoxNumber txt="남은예산" length={`${remainingBudget.toLocaleString("ko-KR")}원`} />
            </div>
            <div className="container-top">
                <div className="select-date">
                    <select
                        aria-label="조회 연도"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}년</option>
                        ))}
                    </select>

                    <select aria-label="조회 월" value={month} onChange={e => setMonth(e.target.value)}>
                        {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                            <option key={m} value={m}>{m}월</option>
                        ))}
                    </select>
                </div>
                {/* useEffect의 의존성 yearMonth를 변경하는 select */}
            </div>
            <div className="container">
                <div className="center">
                    {budgetCategory.map(budget => (
                        <BudgetBar
                            key={budget.budget_id}
                            budget={budget}
                            onSelect={setSelectedBudgetId}
                        />
                    ))}
                </div>

                <div className="right">
                    <Detail
                        is_admin={is_admin}
                        detail={detail}
                        expenses={expenses.filter(expense =>
                            expense.budget_id === detail?.budget_id
                        )}
                        // 지출목록중 선택된 예산 항목의 아이드를 가지고 있는 것만 filter
                        onDelete={budgetDelete}
                    />
                </div>
            </div>
        </div>
    )
}

function BudgetBar({ budget, onSelect }) {
    return (
        <div className="center-list" onClick={() => onSelect(budget.budget_id)}>
            <h3>{budget.budget_name}</h3>
            <p><span>예산</span>{budget.budget_amount.toLocaleString("ko-KR")}원</p>
        </div>
    );
}

function Detail({ detail, expenses, onDelete, is_admin }) {

    const navigate = useNavigate();
    const { empid } = useParams();

    if (!detail) {
        return <p>조회할 예산이 없습니다.</p>;
    }

    return (
        <div className="right-detailInfo">
            <h2>{detail.budget_name} 상세</h2>
            <p>편성액: {detail.budget_amount.toLocaleString("ko-KR")}원</p>

            {is_admin && (
                <div className="edit-delete">
                    <button
                        className="edit-button"
                        type="button"
                        onClick={() => navigate(`/main/${empid}/finance/budgets/${detail.budget_id}/edit`,
                            { state: { detail } }
                        )}
                    >
                        예산 수정
                    </button>
                    <button
                        className="delete-button"
                        type="button"
                        onClick={onDelete}
                        disabled={expenses.length > 0}
                    // 지출 항목이 있는 예산은 삭제가 불가능하다
                    >
                        예산 삭제
                    </button>
                </div>
            )
            }

            <h3>지출 내역</h3>

            {expenses.length === 0 ? (
                <p>등록된 지출이 없습니다.</p>
            ) : (
                expenses.map(expense => (
                    <div key={expense.transaction_id}>
                        <h4>{expense.transaction_title}</h4>
                        <p>지출액: {expense.expense_amount.toLocaleString("ko-KR")}원</p>
                        <p>날짜 : {expense.transaction_date?.slice(0, 10)}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default BudgetManagement;