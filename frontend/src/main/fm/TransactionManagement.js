import axios from "axios";
import React, { useEffect, useState } from "react"
import { ShowBoxNumber, SearchBox } from "../dependence/Cpnt";
import { useNavigate, useParams } from "react-router-dom";

function TransactionManagement({ is_admin }) {

    const { empid } = useParams();
    const navi = useNavigate();
    const [allTransactions, setAllTransactions] = useState([]);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/transactions/all")
            .then(({ data }) => {
                setAllTransactions(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error(err);
                setAllTransactions([]);
            });
    }, []);


    const [search, setSearch] = useState("");

    const [year, setYear] = useState(() =>
        String(new Date().getFullYear())
    );
    const [month, setMonth] = useState(() =>
        String(new Date().getMonth() + 1).padStart(2, "0")
    );
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 3; y <= currentYear + 1; y++) {
        years.push(String(y));
    }
    const yearMonth = `${year}-${month}`;

    const transactionList = allTransactions.filter(
        (transaction) => transaction.transaction_date?.slice(0, 7) === yearMonth
    );

    const detail = transactionList.find(
        (transaction) => transaction.transaction_id === selectedTransactionId
    ) ?? null;

    const totalIncome = transactionList.filter(t => t.transaction_type === "INCOME").reduce(
        (sum, income) => sum + Number(income.amount), 0
    )

    const totalExpense = transactionList.filter(t => t.transaction_type === "EXPENSE").reduce(
        (sum, expense) => sum + Number(expense.amount), 0
    )

    const basePath = `/main/${empid}/finance/transactions`;
    // base path을 설정(url)

    const transactionDelete = () => {
        if (!detail) return;

        const confirmed = window.confirm(
            `'${detail.transaction_title}' 거래를 삭제할까요?`
        );
        if (!confirmed) return;

        const id = detail.transaction_id;

        axios.delete(`http://localhost:3000/transactions/${id}`)
            .then(() => {
                setAllTransactions((prev) =>
                    prev.filter((transaction) => transaction.transaction_id !== id)
                );
            })
            .catch(() => {
                alert("거래 삭제에 실패했습니다.");
            });
    };

    return (
        <div>
            <h1>수입 지출 관리</h1>

            <div className="box-container">
                <ShowBoxNumber txt="수입" length={`${totalIncome.toLocaleString("ko-KR")}`} type="원" />

                <ShowBoxNumber txt="지출" length={`${totalExpense.toLocaleString("ko-KR")}`} type="원" />

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
                {
                    is_admin && (
                        <div className="top-searchinput">
                            <button type="button" onClick={() => navi(`${basePath}/new/INCOME`)}>
                                수입 등록
                            </button>
                            <button type="button" onClick={() => navi(`${basePath}/new/EXPENSE`)}>
                                지출 등록
                            </button>
                        </div>
                    )
                }
                <div className="top-searchinput">
                    <label>검색</label>
                    <SearchBox value={search} onChange={setSearch} placeholder="거래명 검색" />
                </div>
            </div>

            <div className="fm-container">
                <div className="fm-part">
                    {transactionList
                        .filter(t => t.transaction_type === "INCOME" && t.transaction_title.includes(search.trim()))
                        .map(t => (
                            <TransactionBar
                                key={t.transaction_id}
                                transaction={t}
                                setDetail={(transaction) =>
                                    setSelectedTransactionId(transaction.transaction_id)
                                }
                            />
                        ))}
                </div>

                <div className="fm-part">
                    {transactionList
                        .filter(t => t.transaction_type === "EXPENSE" && t.transaction_title.includes(search.trim()))
                        .map(t => (
                            <TransactionBar
                                key={t.transaction_id}
                                transaction={t}
                                setDetail={(transaction) =>
                                    setSelectedTransactionId(transaction.transaction_id)
                                }
                            />
                        ))}
                </div>
                <Detail
                    is_admin={is_admin}
                    detail={detail}
                    onEdit={() =>
                        navi(`${basePath}/${detail.transaction_id}/edit`, {
                            state: { detail },
                        })
                    }
                    onDelete={transactionDelete}
                />
            </div>
        </div>
    )
}

function TransactionBar({ transaction, setDetail }) {
    return (
        <div className="fm-list" onClick={() => setDetail(transaction)}>
            <h3>{transaction.transaction_title}</h3>
            <p>금액: {Number(transaction.amount).toLocaleString("ko-KR")}원</p>
            <p>날짜: {transaction.transaction_date.slice(0, 10)}</p>
        </div>
    );
}



function Detail({ detail, onEdit, onDelete, is_admin }) {
    if (!detail) {
        return <p>선택된 거래가 없습니다.</p>;
    }

    return (
        <div className="fm-list">
            <h3><span>거래 상세</span>{detail.transaction_title}</h3>
            <p>메모: {detail.memo || "등록된 메모가 없습니다."}</p>

            {is_admin && (
                <div className="edit-delete">
                    <button className="edit-button" type="button" onClick={onEdit}>거래 수정</button>
                    <button className="delete-button" type="button" onClick={onDelete}>거래 삭제</button>
                </div>
            )
            }
        </div>
    );
}

export default TransactionManagement;