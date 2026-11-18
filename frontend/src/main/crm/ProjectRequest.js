import React, { useEffect, useState } from "react"

import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";
import { request_status_arr } from "../dependence/Arr";

function ProjectRequest({ requests, is_admin }) {
    const [select, setSelect] = useState("전체");
    const [search, setSearch] = useState("");//검색문장

    const filteredRequests = requests.filter(r =>
        (search.trim() === ""
            || r.customer_name?.includes(search.trim())
            || r.request_title?.includes(search.trim()))
        &&
        (select === "전체" || r.project_request_status === select)
    );

    const [detail, setDetail] = useState(null);
    useEffect(() => {
        setDetail(requests[0] ?? null);
    }, [requests]);

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
    const pageList = filteredRequests.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    return (
        <div>
            <h1>프로젝트 요청 현황</h1>
            <div className="box-container">
                {
                    request_status_arr.map((txt) => {
                        if (txt === "전체")
                            return <ShowBoxNumber key={txt} txt={txt} length={requests.length} />
                        else
                            return <ShowBoxNumber key={txt} txt={txt} length={requests.filter(r => r.project_request_status === txt).length} />
                    })
                }
            </div>
            <div className="container-top">
                <div className="top-button">
                    {request_status_arr.map(txt => (
                        <button key={txt} className={select === txt ? "selected" : "unselected"}
                            type="button" onClick={() => setSelect(txt)}>
                            {txt}
                        </button>
                    ))}
                </div>
                <div className="top-searchinput">
                    <input type="text" placeholder="고객 이름/요청 제목 검색" onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>고객명</th>
                                <th>요청일</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageList.map((item) => (
                                <tr key={item.project_request_id}>
                                    <td className="onClickTable" onClick={() => setDetail(item)}>
                                        <strong>{item.request_title}</strong>
                                    </td>
                                    <td>{item.customer_name}</td>
                                    <td>{item.requested_at?.slice(0, 10)}</td>
                                    <td>{item.project_request_status}</td>
                                </tr>
                            ))}
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
                <div className="right">
                    <div className="right-detailInfo">
                        <h3>{detail?.request_title}</h3>
                        <p><span>고객</span>{detail?.customer_name}</p>
                        <p><span>희망 마감일</span>{detail?.desired_due_date?.slice(0, 10)}</p>
                        <p><span>요청일</span>{detail?.requested_at?.slice(0, 10)}</p>
                        <p><span>상태</span>{detail?.project_request_status}</p>
                        <p><span>요청 내용</span></p>
                        <p>{detail?.requirements}</p>
                    </div>
                    {(is_admin && detail != null) && (
                        <EditDeleteButton txt={"요청"} item={detail} id={detail?.project_request_id}
                            address={"requests"} editPage={"customers/editrequest"} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectRequest;