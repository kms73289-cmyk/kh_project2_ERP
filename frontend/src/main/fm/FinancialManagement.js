import React, { useEffect, useState } from "react"
import axios from "axios";

import { ShowBoxNumber, SearchBox, ShowBoxPercent } from "../dependence/Cpnt"
import "./fm.css"

function FinancialManagement() {
    const [allTransactions, setAllTransactions] = useState([]);
    const [allBudgets, setAllBudgets] = useState([]);

    const [detail, setDetail] = useState(null);

    const [search, setSearch] = useState("");

    const [year, setYear] = useState(() =>
        String(new Date().getFullYear())
    );
    const [month, setMonth] = useState(() =>
        String(new Date().getMonth() + 1).padStart(2, "0")
    );
    const yearMonth = `${year}-${month}`;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 10; y <= currentYear + 1; y++) {
        years.push(String(y));
    }
    useEffect(() => {
        axios.get("http://localhost:3000/transactions/all")
            .then(({ data }) => {
                setAllTransactions(Array.isArray(data) ? data : []);
            })
            .catch(console.error);

        axios.get("http://localhost:3000/budgets/all")
            .then(({ data }) => {
                setAllBudgets(Array.isArray(data) ? data : []);
            })
            .catch(console.error);
    }, []);

    const monthlyTransactions = allTransactions.filter(
        (transaction) => transaction.transaction_date?.slice(0, 7) === yearMonth
    );
    const incomes = monthlyTransactions.filter(
        (transaction) => transaction.transaction_type === "INCOME"
    );

    const expenses = monthlyTransactions.filter(
        (transaction) => transaction.transaction_type === "EXPENSE"
    );

    const budgets = allBudgets.filter(
        (budget) => budget.yearMonth === yearMonth
    );

    // 컴포넌트에 들어갈 각 숫자 계산
    const totalIncome = incomes.reduce(
        (sum, income) => sum + Number(income.amount),
        0
    );
    const totalExpense = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );
    const totalBudget = budgets.reduce(
        (sum, budget) => sum + Number(budget.budget_amount),
        0
    );
    const balance = totalIncome - totalExpense;
    return (
        <div>
            <h1>재무현황</h1>
            <div>
                <div className="box-container">
                    <ShowBoxNumber txt="총수입" length={`${totalIncome.toLocaleString("ko-KR")}원`} />
                    <ShowBoxNumber txt="총지출" length={`${totalExpense.toLocaleString("ko-KR")}원`} />
                    <ShowBoxNumber txt="수입 - 지출" length={`${balance.toLocaleString("ko-KR")}원`} />
                    <ShowBoxPercent txt="예산 사용율" count={totalExpense} total={totalBudget} />
                </div>
                <div className="container-top">
                    <div className="select-date">
                        <select
                            aria-label="조회 연도"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value);
                                setDetail(null);
                            }}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}년</option>
                            ))}
                        </select>

                        <select
                            aria-label="조회 월"
                            value={month}
                            onChange={(e) => {
                                setMonth(e.target.value);
                                setDetail(null);
                            }}
                        >
                            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                <option key={m} value={m}>{m}월</option>
                            ))}
                        </select>
                    </div>
                    <div className="top-searchinput">
                        <label>검색</label>
                        <SearchBox value={search} onChange={setSearch} placeholder="프로젝트명 또는 예산 항목 검색" />
                    </div>
                </div>

                <div className="fm-container">
                    <div className="fm-part">
                        <h2>수입 목록</h2>

                        {incomes.filter(c => c.project_name.includes(search.trim())).map(i => {
                            if (i.length === 0)
                                return <p>수익이 없습니다.</p>
                            return (
                                <div className="fm-list" key={i.project_id}>
                                    <h3>{i.project_name}</h3>
                                    <p><span>수입액</span>{i.amount.toLocaleString("ko-KR")}원</p>
                                    <button type="button" className="edit-button" onClick={() =>
                                        setDetail({ type: "INCOME", item: i })}>
                                        항목 보기
                                    </button>
                                </div>
                            );
                        })}

                        {incomes.length === 0 && (
                            <p>선택한 달에 등록된 수입이 없습니다.</p>
                        )}
                    </div>

                    <div className="fm-part">
                        <h2>예산 항목</h2>

                        {budgets.filter(budget => budget.budget_name.includes(search.trim())).map(budget => {
                            const usedAmount = expenses
                                .filter(expense => expense.budget_id === budget.budget_id)
                                .reduce(
                                    (sum, expense) => sum + Number(expense.amount),
                                    0
                                );

                            return (
                                <div className="fm-list" key={budget.budget_id}>
                                    <h3>{budget.budget_name}</h3>
                                    <p>
                                        <span>편성액</span> {Number(budget.budget_amount).toLocaleString("ko-KR")}원
                                    </p>
                                    <p><span>사용액</span> {usedAmount.toLocaleString("ko-KR")}원</p>
                                    <button
                                        className="edit-button"
                                        type="button"
                                        onClick={() => setDetail({
                                            type: "BUDGET",
                                            item: budget
                                        })}
                                    >
                                        항목 보기
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <Detail detail={detail} incomes={incomes} expenses={expenses} />
                </div>
            </div>
        </div >
    )
}

function Detail({ detail, incomes, expenses }) {
    if (!detail) {
        return <p>항목 보기를 눌러 주세요.</p>;
    }

    if (detail.type === "INCOME") {
        const selectedIncomes = incomes.filter(
            income => income.project_id === detail.item.project_id
        );
        // 선택된 프로젝트의 수입을 filter로 거른다

        // return하면 예산과 관련된 아래 코드를 실행하지 않는다
        return (
            <div className="fm-detail">
                <h2>{detail.item.project_name} 수입 내역</h2>

                {selectedIncomes.map(income => (
                    <div className="fm-list" key={income.transaction_id}>
                        <h3>{income.transaction_title}</h3>
                        <p><span>금액</span>{Number(income.amount).toLocaleString("ko-KR")}원</p>
                        <p><span>날짜</span>{income.transaction_date?.slice(0, 10)}</p>
                        <p><span>메모</span>{income.memo || "등록된 메모가 없습니다."}</p>
                    </div>
                ))}
            </div>
        );
    }

    const selectedExpenses = expenses.filter(
        expense => expense.budget_id === detail.item.budget_id
    );
    // 선택된 지출을 예산_id로 걸러 표시한다

    const usedAmount = selectedExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    const remainingBudget = Number(detail.item.budget_amount) - usedAmount;
    // 남은 예산

    return (
        <div className="fm-detail">
            <h2>{detail.item.budget_name} 지출 내역</h2>
            <div className="fm-list">
                <p><span>사용액</span>{usedAmount.toLocaleString("ko-KR")}원</p>
                <p><span>남은 예산</span>{remainingBudget.toLocaleString("ko-KR")}원</p>
            </div>
            {selectedExpenses.length === 0 ? (
                <p>등록된 지출이 없습니다.</p>
            ) : (
                selectedExpenses.map(expense => (
                    <div className="fm-list" key={expense.transaction_id}>
                        <h3>{expense.transaction_title}</h3>
                        <p><span>금액</span>{Number(expense.amount).toLocaleString("ko-KR")}원</p>
                        <p><span>날짜</span>{expense.transaction_date?.slice(0, 10)}</p>
                        <p><span>메모</span>{expense.memo || "등록된 메모가 없습니다."}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default FinancialManagement;