import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import { ShowBoxNumber } from "../dependence/Cpnt";

function CustomerInfo({ customerList, inquiries, requests }) {
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");// 검색창에 입력 중인 값
    const [searchKeyword, setSearchKeyword] = useState("");// 실제 검색 필터에 적용할 값
    const [customer_id, setCustomer_id] = useState("");
    useEffect(() => { setCustomer_id(customerList[0]?.customer_id) }, [customerList]);
    // 전체 고객에서 이름 검색
    const filteredCustomers = customerList.filter((c) =>
        c.customer_name.includes(searchKeyword) || String(c.customer_id) === searchKeyword);
    const pageSize = 10;// 한 페이지에 표시할 고객 수
    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));// 전체 페이지 수 계산 (최소 1페이지)
    const startIndex = (page - 1) * pageSize;// 현재 페이지의 시작 인덱스를 계산하는 코드
    const visibleCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);// 현재 페이지에 표시할 고객 10명 추출
    const searchCustomer = () => {
        setSearchKeyword(searchText.trim());
        setPage(1);
    };
    return (
        <div>
            <h1>고객정보</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"전체 고객"} length={customerList.length} />
            </div>

            <div className="container-top">
                <div className="top-searchinput">
                    <input type="text" value={searchText} placeholder="고객명또는 고객번호 검색"
                        onChange={(e) => {
                            setSearchText(e.target.value)
                            if (e.target.value.trim() === "") {
                                setPage(1);
                                setSearchKeyword("")
                            }
                        }} />
                    <button type="button" onClick={searchCustomer}>고객 검색</button>
                </div>
            </div>

            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>고객번호</th>
                                <th>고객이름</th>
                                <th>전화번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                visibleCustomers.map((customer) => (
                                    <tr key={customer.customer_id}>
                                        <td>{customer.customer_id}</td>
                                        <td className="onClickTable" onClick={() => setCustomer_id(customer.customer_id)}>
                                            <strong>{customer.customer_name}</strong>
                                        </td>
                                        <td>{customer.customer_phone}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="select-date">
                        <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>이전</button>
                        <span> {page} / {totalPages}</span>
                        <button type="button" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>다음</button>
                    </div>
                </div>
                <CustomerDetail customer_id={customer_id} customerList={customerList} inquiries={inquiries} requests={requests} />
            </div>
        </div>
    )
}
function CustomerDetail({ customer_id, customerList, inquiries, requests }) {
    const inqinfo = inquiries.filter(c => c.customer_id == customer_id);//해당 고객 문의 정보
    const reqinfo = requests.filter(c => c.customer_id == customer_id);//해당 고객 요청 정보
    const info = customerList.find(c => c.customer_id == customer_id);//해당 고객 정보
    const [clickme, setClickme] = useState(true);
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>고객 상세정보</h3>
                <p><span>고객번호</span>{customer_id}</p>
                <p><span>고객이름</span>{info?.customer_name}</p>
                <p><span>핸드폰 번호</span>{info?.customer_phone}</p>
                <div className="edit-delete">
                    <button type="button" className={clickme ? "selected" : "unselected"} onClick={() => setClickme(true)}>문의</button>
                    <button type="button" className={!clickme ? "selected" : "unselected"} onClick={() => setClickme(false)}>요청</button>
                </div>
            </div>
            {
                clickme ? (
                    <div>
                        {
                            inqinfo.length === 0 ?
                                (<p>등록된 문의가 없습니다.</p>) :
                                (
                                    inqinfo.map(item => (
                                        <div className="right-detaillist" key={item.inquiry_id}>
                                            <h3><span>문의</span>{item.inquiry_title}</h3>
                                            <p><span>상담사</span>{item.name ?? "미배정"}</p>
                                            <p><span>접수일</span>{item.received_at?.slice(0, 10)}</p>
                                            <p><span>상태</span>{item.inquiry_status}</p>
                                            <p><span>접근 경로</span>{item.source_channel}</p>
                                        </div>
                                    ))
                                )
                        }
                    </div>
                ) : (
                    <div>
                        {
                            reqinfo.length === 0 ?
                                (<p>등록된 요청이 없습니다.</p>) : (
                                    reqinfo.map(item => (
                                        <div className="right-detaillist" key={item.project_request_id}>
                                            <h3><span>프로젝트 요청</span>{item.request_title}</h3>
                                            <p><span>요청내용</span>{item.requirements}</p>
                                            <p><span>요청일</span>{item.requested_at?.slice(0, 10)}</p>
                                            <p><span>희망 마감일</span>{item.desired_due_date?.slice(0, 10) ?? "미정"}</p>
                                            <p><span>진행상태</span>{item.project_request_status}</p>
                                        </div>
                                    ))
                                )
                        }
                    </div>
                )
            }
        </div>
    )
}
export default CustomerInfo;

// CustomerInfo.js	전체 고객 목록	고객 검색, 문의·프로젝트 건수, 페이지 이동
// CustomerDetail.js	고객 상세정보	고객 기본정보, 해당 고객의 문의·프로젝트 목록 - 위로 통합

// CustomerManagement.js	문의 관리 메인	문의 상태별 목록, 상담원 배정, 보관, 상세 이동
// CreateInquiry.js	문의 등록 시작	전화번호로 기존 고객 조회, 신규 고객 구분
// EnrolForm.js	문의 공통 입력 폼	문의 등록·수정, 상담 내용 작성, 상담 완료

// ProjectRequestHistory.js	프로젝트 요청 목록	요청을 대기·진행·완료 상태로 분류
// ProjectRequestForm.js	프로젝트 요청 공통 폼	요청 제목·요구사항·희망 납기일 입력 및 검증
// ProjectRequestEnrolment.js	프로젝트 요청 등록	문의 ID를 전달받아 프로젝트 요청 생성
// ProjectRequestEdit.js	프로젝트 요청 수정	기존 요청 정보 표시 및 수정 저장

// InquiryHistory.js	보관 문의 목록	보관된 문의 검색, 페이지 이동, 상세 조회
// HistoryDetail.js	문의 이력 상세	문의 내용 확인, 보관 해제(상태 변경), 삭제