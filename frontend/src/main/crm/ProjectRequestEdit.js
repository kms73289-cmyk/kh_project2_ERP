import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { SearchCustomer } from "../dependence/crmCpnt";
import { handleSubmit } from "../dependence/Func";

function ProjectRequestEdit({ bool }) {
    const { reqid } = useParams();
    const location = useLocation();
    const req = location.state?.item;
    const [cust, setCust] = useState(bool ? null : { customer_id: req?.customer_id, customer_name: req?.customer_name });//검색한 고객 객체
    const [input, setInput] = useState(
        bool ?
            { custId: "", title: "", date: "", requirement: "", status: "대기" } :
            {
                prid: reqid,
                custId: req.customer_id,
                title: req.request_title,
                date: req.desired_due_date?.slice(0, 10),
                requirement: req.requirements,
                status: req.project_request_status
            }
    )
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const submit = (e) => {
        e.preventDefault();
        if (!cust) {
            alert("고객을 입력하지 않았습니다.");
            return;
        }
        const data = { ...input, custId: cust?.customer_id ?? input.custId };
        handleSubmit({
            data: data, bool: bool, saveAdress: "project-requests", updateAdress: "updatereq",
            mainPage: "customers/request", txt: "요청"
        });
    }

    return (
        <div className="input">
            {bool ? <h1>프로젝트 요청 생성</h1> : <h1>프로젝트 요청 수정</h1>}
            <div className="input-container">
                <form onSubmit={submit}>
                    <div className="inputform">
                        <label>고객명</label>
                        <SearchCustomer setState={setCust} />
                        <div className="input-data"><input type="text" value={cust?.customer_name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>요청명</label>
                        <div className="input-data">
                            <input type="text" name="title" value={input.title} onChange={handleChange} autoComplete="off" required />
                        </div>
                    </div>
                    <div className="inputform">
                        <label>요청 내용</label>
                        <div className="input-data">
                            <textarea name="requirement" value={input.requirement} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="inputform">
                        <label>희망 마감일</label>
                        <div className="input-data">
                            <input type="date" name="date" value={input.date} onChange={handleChange} autoComplete="off" required />
                        </div>
                    </div>
                    {!bool && (
                        <div className="inputform">
                            <label>상태</label>
                            <div className="input-data">
                                {["대기", "진행", "완료"].map((txt, idx) => (
                                    <button key={idx} className={input.status === txt ? "selected" : "unselected"} type="button" name="status" value={txt} onClick={handleChange}>
                                        {txt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default ProjectRequestEdit;