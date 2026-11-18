import React, { useEffect, useState } from "react";

import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";
import QaResulte from "./QaResulte";
import QaDefect from "./QaDefect";

function QaTest() {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const is_admin = empl?.is_admin == 1;
    const [search, setSearch] = useState("");
    const [test, setTest] = useState([]);
    const [detail, setDetail] = useState(null);
    const [click, setClick] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/qatest')
            .then(res => res.json())
            .then(data => {
                setTest(data);
                setDetail(data[0]);
            }).catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>QA 현황 요약</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"전체 테스트 목록"} length={test.length} />
            </div>
            <div className="container-top">
                <div className="top-searchinput">
                    <label>테스트 검색</label>
                    <input type="text" placeholder="테스트명" onChange={(e) => setSearch(e.target.value)} autoComplete="off" />
                </div>
            </div>
            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>테스트명</th>
                                <th>프로젝트명</th>
                                <th>담당자</th>
                                <th>비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                test.filter(t => t.title.includes(search)).map(t => (
                                    <tr key={t.test_id}>
                                        <td className="onClickTable" onClick={() => setDetail(t)}>
                                            <strong>{t.title}</strong>
                                        </td>
                                        <td>{t.project_name}</td>
                                        <td>{t.name}</td>
                                        <td style={{ width: "32%" }}>
                                            {is_admin && (
                                                <EditDeleteButton txt={"테스트"} item={t} id={t?.test_id} address={"qatest"} editPage={"qa/editTest"} />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="right">
                    <DetailTest detail={detail} setClick={setClick} click={click} />
                    {click ?
                        <QaResulte testid={detail?.test_id} /> :
                        <QaDefect testid={detail?.test_id} />
                    }
                </div>
            </div>
        </div>
    );
}

function DetailTest({ detail, setClick, click }) {
    return (
        <div className="right-detailInfo">
            <h3>
                {detail?.title}
                {click ? <i>테스트 결과 관리</i> : <i>결함 관리</i>}
                <button className="edit-button" type="button" onClick={() => setClick(!click)}>
                    {click ? "결함 보기" : "실행 결과 보기"}
                </button>
            </h3>
            <p><span>프로젝트명</span>{detail?.project_name}</p>
            <p><span>담당자</span>{detail?.name}</p>
            <p><span>확인순서</span>{detail?.steps}</p>
            <p><span>예상결과</span>{detail?.expected}</p>
        </div>
    );
}

export default QaTest;