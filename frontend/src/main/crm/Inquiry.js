import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ShowBoxNumber } from "../dependence/Cpnt";
import { inq_status_arr } from "../dependence/Arr";

function Inquiry({ inquiries, is_admin }) {
    const [searchText, setSearchText] = useState("");
    const [keyword, setKeyword] = useState("");
    const [detail, setDetail] = useState(null);
    const [select, setSelect] = useState("전체");
    useEffect(() => {
        setDetail(prev =>
            inquiries.find(i => i.inquiry_id === prev?.inquiry_id)
            ?? inquiries[0]
            ?? null
        );
    }, [inquiries]);

    // 고객 이름 또는 문의 제목으로 검색
    const filteredInquiries = inquiries.filter(inquiry =>
        (select === "전체" || inquiry.inquiry_status === select) && (
            (inquiry.customer_name ?? "").includes(keyword) ||
            (inquiry.inquiry_title ?? "").includes(keyword)));
    return (
        <div>
            <h1>문의 현황</h1>
            <div className="box-container">
                {inq_status_arr.map(txt => {
                    if (txt == "전체")
                        return <ShowBoxNumber key={txt} txt={txt} length={inquiries.length} />
                    else
                        return <ShowBoxNumber key={txt} txt={txt} length={inquiries.filter(i => i.inquiry_status == txt).length} />
                })}
            </div>

            <div className="container-top">
                <div className="top-button">
                    {inq_status_arr.map(txt => (
                        <button key={txt} className={select === txt ? "selected" : "unselected"}
                            type="button" onClick={() => setSelect(txt)}>
                            {txt}
                        </button>
                    ))}
                </div>
                <div className="top-searchinput">
                    <input
                        type="text" placeholder="고객 이름/문의 제목을 검색하세요" value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            if (e.target.value.trim() === "")
                                setKeyword("");
                        }}
                    />
                    <button type="button" onClick={() => setKeyword(searchText.trim())}>검색</button>
                </div>
            </div>
            <div className="container">
                <ShowListInq inquiries={filteredInquiries} setDetail={setDetail} is_admin={is_admin} />
                <HistoryDetail detail={detail} is_admin={is_admin} />
            </div>
        </div>

    );
}

function ShowListInq({ inquiries, setDetail, is_admin }) {
    const navi = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const totalPages = Math.max(1, Math.ceil(inquiries.length / pageSize));
    const pageList = inquiries.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const deleteInquiry = async (item) => {
        if (!window.confirm("이 문의를 삭제하시겠습니까?"))
            return;
        try {
            const res = await axios.delete(`http://localhost:3000/inquiries/${item.inquiry_id}`)
            alert("문의 삭제 완료");
        } catch (err) {
            alert("문의 삭제 실패");
        }
    }
    return (
        <div className="center">
            <table border="1">
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>고객명</th>
                        <th>담당자</th>
                        <th>등록일</th>
                        <th>상태</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    {pageList.length === 0 ?
                        (<tr><td colSpan="6">문의가 없습니다.</td></tr>) :
                        (pageList.map((item) => (
                            <tr key={item.inquiry_id}>
                                <td className="onClickTable" onClick={() => setDetail(item)}>
                                    <strong>{item.inquiry_title}</strong>
                                </td>
                                <td>{item.customer_name}</td>
                                <td>{item.name ?? "미배정"}</td>
                                <td>{item.received_at?.slice(0, 10)}</td>
                                <td>{item.inquiry_status}</td>
                                <td>
                                    {item.inquiry_status === "미정" && (
                                        <button className="edit-button" onClick={() => navi(`../customers/editInquiry/${item.inquiry_id}`, { state: { inquiry: item, edit: false } })}>
                                            상담하기
                                        </button>
                                    )}
                                    {item.inquiry_status === "대기" && (
                                        <button className="edit-button" onClick={() => navi(`../customers/editInquiry/${item.inquiry_id}`, { state: { inquiry: item, edit: false } })}>
                                            상담 내용 작성
                                        </button>
                                    )}
                                    {(is_admin && item.inquiry_status === "보관") && (
                                        <button className="delete-button" type="button" onClick={() => deleteInquiry(item)}>문의 삭제</button>
                                    )}
                                </td>
                            </tr>
                        )))}
                </tbody>
            </table>
            <div className="select-date">
                <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    이전
                </button>
                <span> {page} / {totalPages} 페이지 </span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
}

function HistoryDetail({ detail, is_admin }) {
    const navi = useNavigate();
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>{detail?.inquiry_title}</h3>
                <p><span>고객</span>{detail?.customer_name}</p>
                <p><span>담당자</span>{detail?.name ?? "미배정"}</p>
                <p><span>상태</span>{detail?.inquiry_status}</p>
                <p><span>접근 경로</span>{detail?.source_channel}</p>
                <p><span>등록일</span>{detail?.received_at?.slice(0, 10)}</p>
                <p><span>문의 내용</span></p>
                <p>{detail?.inquiry_details}</p>
                <p><span>상담 내용</span></p>
                <p>{detail?.consultation_notes}</p>
            </div>
            {(is_admin && detail != null) && (
                <div className="edit-delete">
                    <button className="edit-button" type="button" onClick={() =>
                        navi(`../customers/editInquiry/${detail?.inquiry_id}`,
                            { state: { inquiry: detail, edit: true } })}>
                        문의 수정
                    </button>
                </div>
            )}
        </div>
    )
}

export default Inquiry;