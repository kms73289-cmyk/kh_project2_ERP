import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import "./home.css";

const number = value => Number(value) || 0;
const money = value => `${number(value).toLocaleString("ko-KR")}원`;
const shortDate = value => value?.slice(5, 10).replace("-", ".") || "미정";
const endpoints = { transactions: "/transactions/all", budgets: "/budgets/all", leaves: "/leave", results: "/qaresult", defects: "/qadefect" };

// QA 기준: 모든 실행 결과 중 outcome=실패. 결함은 완료를 포함한 전체 등록 건.
// 두 목록을 합산하거나 최근 실행 한 건으로 축약하지 않습니다.
export function qualityLists(results, defects) {
  return {
    failures: results.filter(item => item.outcome === "실패").sort((a, b) => (b.executed_on || "").localeCompare(a.executed_on || "")),
    defects
  };
}

function AdminHome({ empid, projects = [], inquiries = [], requests = [], orders = [], homeAction }) {
  const [resources, setResources] = useState({});
  useEffect(() => {
    const controller = new AbortController();
    Object.entries(endpoints).forEach(async ([key, endpoint]) => {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`, { signal: controller.signal });
        if (!response.ok) throw new Error("조회 실패");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("목록 형식 오류");
        if (!controller.signal.aborted) setResources(prev => ({ ...prev, [key]: { data } }));
      } catch (error) {
        if (!controller.signal.aborted) setResources(prev => ({ ...prev, [key]: { error: "데이터를 불러오지 못했습니다. 잠시 후 운영 현황을 다시 열어 주세요." } }));
      }
    });
    return () => controller.abort();
  }, []);

  const today = dayjs().format("YYYY-MM-DD");
  const month = today.slice(0, 7);
  const base = `/main/${empid}`;
  const leaves = resources.leaves?.data || [];
  const pending = leaves.filter(item => item.request_status === "대기");
  const transactions = (resources.transactions?.data || []).filter(item => item.transaction_date?.slice(0, 7) === month);
  const expenses = transactions.filter(item => item.transaction_type === "EXPENSE");
  const income = transactions.filter(item => item.transaction_type === "INCOME").reduce((sum, item) => sum + number(item.amount), 0);
  const expense = expenses.reduce((sum, item) => sum + number(item.amount), 0);
  const budgets = (resources.budgets?.data || []).filter(item => item.yearMonth === month);
  const budget = budgets.reduce((sum, item) => sum + number(item.budget_amount), 0);
  const excess = budgets.filter(item => expenses.filter(tx => String(tx.budget_id) === String(item.budget_id)).reduce((sum, tx) => sum + number(tx.amount), 0) > number(item.budget_amount));
  const financeReady = !!resources.transactions?.data && !!resources.budgets?.data;
  const financeError = resources.transactions?.error || resources.budgets?.error;
  const delayed = projects.filter(item => item.project_status !== "완료" && item.project_end_date?.slice(0, 10) < today);
  const unassigned = inquiries.filter(item => item.employee_id == null);
  const waitingRequests = requests.filter(item => item.project_request_status === "대기");
  const unpaid = orders.filter(item => item.order_status === "미결제");
  const quality = qualityLists(resources.results?.data || [], resources.defects?.data || []);
  // 기타 확인 필요에는 휴가와 QA를 포함하지 않습니다. 실패 결과와 결함은 서로 연관될 수 있습니다.
  const otherCount = delayed.length + excess.length + unassigned.length;
  const priorities = [
    ...delayed.map(item => ({ key: `project-${item.project_id}`, type: "프로젝트", text: `${item.project_name} 일정 지연`, due: shortDate(item.project_end_date), to: `${base}/projects/projectMain`, state: { selectedProjectId: item.project_id } })),
    ...excess.map(item => ({ key: `budget-${item.budget_id}`, type: "재무", text: `${item.budget_name} 예산 초과`, due: "이번 달", to: `${base}/finance/BudgetManagement` })),
    ...unassigned.map(item => ({ key: `inquiry-${item.inquiry_id}`, type: "상담", text: `${item.inquiry_title} 담당자 미배정`, due: "확인 필요", to: `${base}/customers/editInquiry/${item.inquiry_id}`, state: { inquiry: item, edit: true } }))
  ];
  return (
    <div className="admin-home">
      <div className="admin-heading">
        <div><h1>관리자 홈</h1><p>회사의 운영 현황과 확인할 항목을 한눈에 봅니다.</p></div>
        <div className="admin-heading-actions">{homeAction}<time dateTime={today}>{today.replaceAll("-", ".")} {"일월화수목금토"[dayjs().day()]}요일</time></div>
      </div>
      <div className="admin-summary">
        <Summary title="이번 달 수입" value={resources.transactions?.data ? money(income) : "—"} note={resources.transactions?.error ? "조회 실패" : !resources.transactions ? "불러오는 중" : month} />
        <Summary title="이번 달 지출" value={resources.transactions?.data ? money(expense) : "—"} note={resources.transactions?.error ? "조회 실패" : !resources.transactions ? "불러오는 중" : month} />
        <Summary title="휴가 승인 대기" value={resources.leaves?.data ? `${pending.length}건` : "—"} note={resources.leaves?.error ? "조회 실패" : !resources.leaves ? "불러오는 중" : "승인 대기 요청"} tone="blue" />
        <Summary title="기타 확인 필요" value={financeReady ? `${otherCount}건` : "—"} note="지연 프로젝트·예산 초과·미배정 상담" tone="red" />
      </div>
      <div className="admin-grid">
        <AdminFM income={income} expense={expense} budget={budget} excess={excess} ready={financeReady} error={financeError} base={base} />
        <AdminHM leaves={leaves} today={today} resource={resources.leaves} />
        <AdminQA {...quality} resources={resources} base={base} />
        <AdminPriority items={priorities} pending={resources.leaves?.data ? pending.length : null} ready={financeReady} />
        <AdminOrder base={base} unassigned={unassigned.length} requests={waitingRequests.length} unpaid={unpaid.length} />
      </div>
    </div>
  );
}
export default AdminHome;

function Summary({ title, value, note, tone = "" }) {
  return (
    <div className={`admin-summary-card ${tone}`}>
      <span>{title}</span><strong>{value}</strong><small>{note}</small>
    </div>
  );
}
function ScrollBody({ label, children, ...props }) {
  return <div className="admin-scroll" tabIndex={0} role="region" aria-label={label} {...props}>{children}</div>;
}
function AdminFM({ income, expense, budget, excess, ready, error, base }) {
  const rate = budget > 0 ? expense / budget * 100 : null;
  return <section className="admin-card admin-finance"><h2>재무 현황</h2>
    <ScrollBody label="재무 현황 본문">
      {error ? <p role="alert">{error}</p> : !ready ? <p>불러오는 중입니다.</p> : <>
        <h3>이번 달 수입 − 지출</h3><strong className="admin-balance">{money(income - expense)}</strong><p className="admin-muted">거래 입력 기준</p>
        <div className="admin-budget"><h3>예산 사용률 {rate == null ? "—" : `${rate.toFixed(1)}%`}</h3>
          <progress max="100" value={Math.min(100, rate || 0)} aria-label="예산 사용률" />
          {rate == null && <p className="admin-muted">이번 달 편성 예산이 없습니다.</p>}
        </div>
        <p className={excess.length ? "admin-warning" : "admin-muted"}>{excess.length ? `예산 초과 ${excess.length}건 · ${excess.map(item => item.budget_name).join(", ")}` : "예산 초과 항목이 없습니다."}</p>
      </>}
    </ScrollBody><Link className="admin-footer-link" to={`${base}/finance/financialManagement`}>재무 상세 보기</Link>
  </section>;
}
function AdminHM({ leaves, today, resource }) {
  const [tab, setTab] = useState("대기");
  const pending = leaves.filter(item => item.request_status === "대기");
  const current = leaves.filter(item => item.request_status === "승인" && item.leave_start_date <= today && item.leave_end_date >= today);
  const future = leaves.filter(item => item.request_status === "승인" && item.leave_start_date > today);
  const list = tab === "대기" ? pending : tab === "오늘" ? current : future;
  return <section className="admin-card admin-leave"><h2>휴가 요청 현황</h2>
    <div className="admin-metrics"><div>승인 대기<strong>{resource?.data ? `${pending.length}건` : "—"}</strong></div><div>오늘 휴가<strong>{resource?.data ? `${new Set(current.map(item => item.employee_id)).size}명` : "—"}</strong></div><div>휴가 예정<strong>{resource?.data ? `${future.length}건` : "—"}</strong></div></div>
    <div className="admin-tabs" role="group" aria-label="휴가 요청 구분">{[["대기", "승인 대기"], ["오늘", "오늘 휴가"], ["예정", "휴가 예정"]].map(([value, label]) => <button type="button" key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>{label}</button>)}</div>
    <ScrollBody label="휴가 요청 목록">{resource?.error ? <p role="alert">{resource.error}</p> : !resource?.data ? <p>불러오는 중입니다.</p> : <table><thead><tr><th>사원명</th><th>휴가 기간</th><th>일수</th></tr></thead><tbody>{list.map(item => <tr key={item.request_id}><td>{item.name || "사원 미연결"}</td><td>{shortDate(item.leave_start_date)}{item.leave_start_date !== item.leave_end_date && ` ~ ${shortDate(item.leave_end_date)}`}</td><td>{item.leave_days}일</td></tr>)}{!list.length && <tr><td colSpan={3}>해당 휴가 요청이 없습니다.</td></tr>}</tbody></table>}</ScrollBody>
    <small className="admin-muted">휴가 요청 실데이터 · 관리 화면은 아직 연결되지 않았습니다.</small><button type="button" className="admin-footer-link" disabled>휴가 관리 보기 · 준비 중</button>
  </section>;
}
export function AdminQA({ failures, defects, resources, base }) {
  const [tab, setTab] = useState("failures");
  const selected = tab === "failures" ? failures : defects;
  const dataKey = tab === "failures" ? "results" : "defects";
  const ready = resources[dataKey]?.data;
  const error = resources[dataKey]?.error;
  const count = (key, list) => resources[key]?.data ? list.length : "—";
  return <section className="admin-card admin-quality"><h2>품질 점검 현황</h2>
    <div className="admin-tabs" role="group" aria-label="품질 점검 구분">
      <button type="button" aria-pressed={tab === "failures"} onClick={() => setTab("failures")}>테스트 결과 실패 <span>{count("results", failures)}</span></button>
      <button type="button" aria-pressed={tab === "defects"} onClick={() => setTab("defects")}>결함 <span>{count("defects", defects)}</span></button>
    </div>
    <ScrollBody label={tab === "failures" ? "실패 테스트 목록" : "결함 목록"}>
      {error ? <p role="alert">{error}</p> : !ready ? <p>불러오는 중입니다.</p> : !selected.length ? <p className="admin-empty">{tab === "failures" ? "실패한 테스트가 없습니다" : "등록된 결함이 없습니다"}</p> :
        selected.map(item => <Link className="admin-quality-item" key={tab === "failures" ? item.result_id : item.defect_id}
          to={`${base}/qa/${tab === "failures" ? `editResult/${item.result_id}` : `editDefect/${item.defect_id}`}`} state={{ item }}>
          <strong>{tab === "failures" ? (item.t_title || "테스트 미연결") : (item.title || "제목 없음")}</strong><span className="admin-muted">담당자: {item.name || "미배정"}</span>{tab === "failures" && <span>{item.actual || "결과 내용 없음"}</span>}
          {tab === "failures" ? <span className="admin-muted">실행일 {shortDate(item.executed_on)}</span> : <span className="admin-badges"><span className={`admin-badge ${item.severity === "높음" ? "danger" : ""}`}>{item.severity || "미지정"}</span><span className="admin-badge">{item.status || "미지정"}</span></span>}
        </Link>)}
    </ScrollBody>
    <small className="admin-muted">항목 선택 시 기존 상세 수정 화면으로 이동합니다.</small>
    <Link className="admin-footer-link" to={`${base}/qa/test`}>품질 현황 보기</Link>
  </section>;
}
function AdminPriority({ items, pending, ready }) {
  return <section className="admin-card admin-priority"><h2>우선 확인할 항목</h2><ScrollBody label="우선 확인할 항목 목록">
    {!ready && <p className="admin-muted">재무 조회 완료 전에는 예산 초과 항목이 포함되지 않습니다.</p>}
    <table><thead><tr><th>구분</th><th>내용</th><th>기한</th></tr></thead><tbody>
      {pending > 0 && <tr><td>휴가</td><td>휴가 요청 승인 대기 {pending}건</td><td>확인 필요</td></tr>}
      {items.map(item => <tr key={item.key}><td>{item.type}</td><td><Link to={item.to} state={item.state}>{item.text}</Link></td><td>{item.due}</td></tr>)}
      {!items.length && ready && <tr><td colSpan={3}>그 외 우선 확인할 항목이 없습니다.</td></tr>}
    </tbody></table></ScrollBody></section>;
}
function AdminOrder({ base, unassigned, requests, unpaid }) {
  return <section className="admin-card admin-orders"><h2>신규 의뢰·주문</h2><ScrollBody label="신규 의뢰 및 주문 요약">
    <Link className="admin-order-row" to={`${base}/customers/Inquiry`}><span>미배정 상담</span><strong>{unassigned}건</strong></Link>
    <Link className="admin-order-row" to={`${base}/customers/request`}><span>대기 중인 제작 요청</span><strong>{requests}건</strong></Link>
    <Link className="admin-order-row" to={`${base}/ecommerce/orders`}><span>미결제 주문 목록</span><strong>{unpaid}건</strong></Link>
  </ScrollBody><div className="admin-shortcuts"><Link to={`${base}/customers/customerInfo`}>고객관계 보기 ›</Link><Link to={`${base}/ecommerce/orders`}>주문 관리 보기 ›</Link><Link to={`${base}/ecommerce/ecommerce`}>이커머스 보기 ›</Link></div></section>;
}
