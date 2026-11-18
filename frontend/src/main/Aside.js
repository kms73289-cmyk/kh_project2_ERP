import { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";


function Aside() {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const is_admin = empl?.is_admin == 1;

    const [asideOpen, setAsideOpen] = useState(true);
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("erp-theme") === "dark" ? "dark" : "light";
        } catch {
            return "light";
        }
    });
    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem("erp-theme", theme);
        } catch { }
    }, [theme]);
    useEffect(() => {
        const timer = window.setTimeout(() => {
            document.documentElement.classList.remove("erp-theme-changing");
        }, 350);

        return () => window.clearTimeout(timer);
    }, [theme]);
    useEffect(() => {
        return () => document.documentElement.classList.remove("erp-theme-changing");
    }, []);
    const toggleTheme = () => {
        document.documentElement.classList.add("erp-theme-changing");
        setTheme(current => current === "dark" ? "light" : "dark");
    };

    const navi = useNavigate();
    const location = useLocation();
    const category = location.pathname.split("/")[3] || "home";

    return (
        <aside className={`sidebar ${asideOpen ? "" : "is-collapsed"}`}>
            <button type="button" className="sidebar-toggle"
                onClick={() => setAsideOpen(open => !open)}
                aria-label={asideOpen ? "사이드 메뉴 접기" : "사이드 메뉴 펼치기"}
                aria-expanded={asideOpen}
            >
                <span aria-hidden="true">
                    {asideOpen ? "«" : "»"}
                </span>
            </button>
            {category === "home" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}`}>MY PAGE</NavLink>
                </>
            )

            }
            {category === "projects" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/projects/projectMain`}>전체 프로젝트</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/projects/projectTask`}>프로젝트 / 업무</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/projects/projectMy`}>내 프로젝트</NavLink>
                    {
                        is_admin && (
                            <>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/projects/projectNew`}>프로젝트 등록</NavLink>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/projects/TaskNew`}>업무 등록</NavLink>
                            </>
                        )
                    }
                </>
            )}
            {category === "schedules" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/schedules/scheduleMain`}>전체 일정</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/schedules/scheduleNew`}>일정 등록</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/schedules/scheduleProject`}>프로젝트 일정</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/schedules/scheduleMy`}>나의 일정 관리</NavLink>
                </>
            )}
            {category === "customers" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/customers/customerInfo`}> 고객 정보 </NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/customers/customerNew`}>고객 등록</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/customers/Inquiry`}>문의 현황</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/customers/editInquiry`}>문의 생성</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/customers/request`}>프로젝트 요청 현황</NavLink>

                    {
                        is_admin && (<NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/customers/editrequest`}>프로젝트 요청 생성</NavLink>)
                    }
                </>
            )}
            {category === "ecommerce" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/ecommerce/ecommerce`}>전체 목록</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/ecommerce/productNew`}>상품 등록</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/ecommerce/product`}>상품 관리</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/ecommerce/orders`}>주문 관리</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/ecommerce/reviews`}>리뷰 관리</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/ecommerce/layout/`}>판매 사이트 설정</NavLink>
                </>
            )}
            {category === "community" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/community/postList`}>게시글 목록</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/community/myPosts`}>내 게시글</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/community/postWrite`}>게시글 작성</NavLink>
                </>
            )}
            {category === "qa" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/qa/test`}>테스트 관리</NavLink>
                    {
                        is_admin && (
                            <>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/qa/testNew`}>테스트 등록</NavLink>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/qa/resultNew`}>테스트 결과 등록</NavLink>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/qa/defectNew`}>결함 등록</NavLink>
                            </>
                        )
                    }
                </>
            )}
            {category === "finance" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/finance/FinancialManagement`}>재무 현황</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/finance/BudgetManagement`}>예산 관리</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/finance/TransactionManagement`}>수입/지출 관리</NavLink>
                    {
                        is_admin && (<NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/finance/BudgetNew`}>예산 항목 등록</NavLink>)
                    }
                </>
            )}
            {category === "hrm" && (
                <>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/hrm/hrmdashboard`}>인사 현황</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/hrm/employees`}>직원·부서관리</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/hrm/leaveform`}>연차 신청</NavLink>
                    {
                        is_admin && (
                            <>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/hrm/leave`}>연차 관리</NavLink>
                                <NavLink className={({ isActive }) => isActive ? "select" : ""} to={`/main/${empid}/hrm/attendance`}>근태 관리</NavLink>
                            </>
                        )
                    }
                </>
            )
            }
            <ul>
                <li className="sidebar-settings" onClick={toggleTheme}>
                    Mode Setting : {theme === "dark" ? "Dark" : "Light"}
                </li>
                <li onClick={() => {
                    sessionStorage.removeItem("empl");
                    navi("/");
                }}>Logout</li>
            </ul>
        </aside>
    );
}

export default Aside;