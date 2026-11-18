import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { SearchMember } from "../dependence/Cpnt";
import { SearchCustomer } from "../dependence/crmCpnt";
import { handleSubmit } from "../dependence/Func";
import { inq_channel_arr, inq_status_arr } from "../dependence/Arr";

function InquiryForm({ bool }) {
    const { inquiry_id } = useParams();
    const location = useLocation();
    const inquiry = location.state?.inquiry;
    const edit = location.state?.edit; //true면 전체 수정, false면 inquiry.inquiry_status

    const [emp, setEmp] = useState(bool ? null : { employee_id: inquiry?.employee_id, name: inquiry?.name });//검색한 담당자 객체
    const [cust, setCust] = useState(bool ? null : { customer_id: inquiry?.customer_id, customer_name: inquiry?.customer_name });//검색한 고객 객체
    const [input, setInput] = useState(bool ?
        { custId: "", empId: "", inqTitle: "", inqDetail: "", notes: "", status: "", channel: "" } :
        {
            custId: inquiry.customer_id,
            empId: inquiry.employee_id,
            inqTitle: inquiry.inquiry_title,
            inqDetail: inquiry.inquiry_details,
            notes: inquiry.consultation_notes,
            status: inquiry.inquiry_status,
            channel: inquiry.source_channel,
            inqId: inquiry_id
        }
    );
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    return (
        <div className="input">
            {bool ? <h1>문의 등록</h1> : <h1>문의 수정</h1>}
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = { ...input, empId: emp?.employee_id ?? input.empId ?? "", custId: cust?.customer_id ?? input.custId };
                    handleSubmit({
                        data: data, bool: bool, saveAdress: "inquiries", updateAdress: "updateInq",
                        mainPage: "customers/Inquiry", txt: "문의"
                    });
                }}>
                    <div className="inputform">
                        <label>고객명</label>
                        {bool || edit ? <SearchCustomer setState={setCust} /> : ""}
                        <div className="input-data"><input type="text" value={cust?.customer_name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>담당자</label>
                        {bool || edit || inquiry.inquiry_status === "미정" ? <SearchMember setState={setEmp} /> : ""}
                        <div className="input-data"><input type="text" value={emp?.name ?? ""} readOnly /></div>
                    </div>
                    <div className="inputform">
                        <label>문의명</label>
                        <div className="input-data">
                            <input type="text" name="inqTitle" value={input.inqTitle} onChange={handleChange} autoComplete="off" required readOnly={!bool && !edit} />
                        </div>
                    </div>
                    <div className="inputform">
                        <label>문의 내용</label>
                        <div className="input-data">
                            <textarea name="inqDetail" value={input.inqDetail} onChange={handleChange} required readOnly={!bool && !edit && inquiry.inquiry_status != "미정"} />
                        </div>
                    </div>
                    <div className="inputform">
                        <label>문의 답변</label>
                        <div className="input-data">
                            <textarea name="notes" value={input.notes} onChange={handleChange} readOnly={!bool && !edit && inquiry.inquiry_status != "대기"} />
                        </div>
                    </div>
                    {!bool && (
                        <div className="inputform">
                            <label>상태</label>
                            <div className="input-data">
                                {inq_status_arr.filter(arr => arr != "전체").map((txt, idx) => (
                                    <button key={idx} className={input.status === txt ? "selected" : "unselected"} type="button" name="status" value={txt} onClick={handleChange}>
                                        {txt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="inputform">
                        <label>문의 경로</label>
                        <div className="input-data">
                            {inq_channel_arr.map((txt, idx) => (
                                <button key={idx} className={input.channel === txt ? "selected" : "unselected"} type="button" name="channel" value={txt} onClick={handleChange} disabled={!bool && !edit}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="input-submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default InquiryForm;