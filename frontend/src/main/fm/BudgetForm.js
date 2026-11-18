import axios from "axios";
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";

function BudgetForm() {
    const { empid, budget_id } = useParams();
    const { state } = useLocation();

    const isEdit = Boolean(budget_id);
    const budget = state?.detail;
    const [budgetProperties, setBudgetProperties] = useState({
        budget_name: "",
        budget_amount: "",
    });
    const [year, setYear] = useState(() =>
        String(new Date().getFullYear())
    );
    const [month, setMonth] = useState(() =>
        String(new Date().getMonth() + 1).padStart(2, "0")
        // new Date() => 현제 날짜와 시각
        // getMonth() => 1월 = 0
        // +1 => 1
        // String() => "1"
        // padStart(2, "0") => "01"
        // 처음 세팅할 때 필요
    );

    const navi = useNavigate();
    // 파라미터로 예산 아이디를 받아오면 isEdit가 true가 된다
    const [loadedBudgetId, setLoadedBudgetId] = useState(null);
    // 동기화 목적이긴 이라서 없어도 된다
    // (수정저장 버튼은 해당 예산을 불러온 다음에 보이게 만드는것에 사용)

    const currentYear = new Date().getFullYear();
    const years = [];

    for (let y = currentYear; y <= currentYear + 1; y++) {
        years.push(String(y));
    }

    if (isEdit && !years.includes(year)) {
        years.push(year);
        years.sort();
    }

    useEffect(() => {
        if (
            !isEdit ||
            !budget ||
            String(budget.budget_id) !== budget_id ||
            !budget.yearMonth
        ) {
            return;
        }

        const [savedYear, savedMonth] = budget.yearMonth.split("-");

        setBudgetProperties({
            budget_name: budget.budget_name ?? "",
            budget_amount: String(budget.budget_amount ?? ""),
        });
        setYear(savedYear);
        setMonth(savedMonth);
        setLoadedBudgetId(budget_id);
    }, [isEdit, budget, budget_id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            budget_name: budgetProperties.budget_name.trim(),
            budget_amount: Number(budgetProperties.budget_amount)
        };

        let request;

        if (isEdit) {
            request = axios.patch(`http://localhost:3000/budgets/${budget_id}`, data);
        } else {
            request = axios.post("http://localhost:3000/budgets", {
                ...data,
                yearMonth: `${year}-${month}`
            });
        }

        // request에는 이미 보낸 요청의 결과를 기다릴수 있는 promise객체가 담긴다
        // (서버응답을 기다리는 동안 promise는 pending(처리가 끝나지 않은)상태이다)
        request
            .then(() => {
                alert("예산을 저장했습니다.");
                navi(`/main/${empid}/finance/budgetManagement`);
            })
            .catch(() => {
                alert("예산 저장에 실패했습니다.");
            });
    };

    const handleValue = (e) => {

        setBudgetProperties({
            ...budgetProperties, [e.target.name]: e.target.value
        })

    }

    if (
        isEdit &&
        (!budget || String(budget.budget_id) !== budget_id || !budget.yearMonth)
    ) {
        return <p>예산 목록에서 수정할 항목을 다시 선택해주세요.</p>;
    }

    return (
        <div className="input">
            <h1>
                {
                    isEdit ? "예산 수정" : "예산 등록"
                }
            </h1>
            <div className="input-container">
                <form className="erp-form" onSubmit={handleSubmit}>
                    <div className="inputform">
                        <label htmlFor="budget_name">예산 항목</label>
                        <div className="input-data">
                            <input
                                id="budget_name"
                                type="text"
                                name="budget_name"
                                value={budgetProperties.budget_name}
                                onChange={handleValue}
                                required
                            />
                        </div>
                    </div>
                    <div className="inputform">
                        <label htmlFor="budget_amount">예산 금액</label>
                        <div className="input-data">
                            <input
                                id="budget_amount"
                                type="number"
                                name="budget_amount"
                                value={budgetProperties.budget_amount}
                                onChange={handleValue}
                                min="0"
                                step="1"
                                required
                            />
                        </div>
                    </div>
                    <div className="inputform">
                        <label>예산 적용월 선택</label>
                        <div className="input-data">
                            <select
                                aria-label="조회 연도"
                                value={year}
                                disabled={isEdit}
                                onChange={e => setYear(e.target.value)}
                            >
                                {years.map(y => (
                                    // year는 배열인데 for문을 통해 현제 년도부터 다음 년도까지 채워 넣었다
                                    <option key={y} value={y}>{y}년</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-data">
                            <select aria-label="조회 월" value={month} disabled={isEdit} onChange={e => setMonth(e.target.value)}>
                                {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                    <option key={m} value={m}>{m}월</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button className="input-submit" disabled={isEdit && loadedBudgetId !== budget_id}>
                        {isEdit ? "수정 저장" : "예산 등록"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BudgetForm;