import { Link, useLocation } from "react-router-dom";

function Header() {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const { pathname } = useLocation();
    const category = pathname.split("/")[3];
    return (
        <header>
            <Link className={!category ? "headertrue" : "headerfalse"} to={`/main/${empid}`}>홈</Link>
            <Link className={category === "projects" ? "headertrue" : "headerfalse"} to={`/main/${empid}/projects/projectMain`}>프로젝트 관리</Link>
            <Link className={category === "schedules" ? "headertrue" : "headerfalse"} to={`/main/${empid}/schedules/scheduleMain`}>일정 관리</Link>
            <Link className={category === "customers" ? "headertrue" : "headerfalse"} to={`/main/${empid}/customers/customerInfo`}>고객 관리</Link>
            <Link className={category === "ecommerce" ? "headertrue" : "headerfalse"} to={`/main/${empid}/ecommerce/ecommerce`}>이커머스</Link>
            <Link className={category === "community" ? "headertrue" : "headerfalse"} to={`/main/${empid}/community/postList`}>커뮤니티</Link>
            <Link className={category === "finance" ? "headertrue" : "headerfalse"} to={`/main/${empid}/finance/financialManagement`}>재무 관리</Link>
            <Link className={category === "qa" ? "headertrue" : "headerfalse"} to={`/main/${empid}/qa/test`}>품질관리</Link>
            <Link className={category === "hrm" ? "headertrue" : "headerfalse"} to={`/main/${empid}/hrm/hrmdashboard`}>인적자원관리</Link>

            <div className="right-user">
                <div>
                    <span><strong>{empl?.name}</strong> 님</span> 안녕하세요
                    <div className="user-icon">{empl?.name.slice(0, 1)}</div>
                </div>
            </div>
        </header>
    );
}

export default Header;