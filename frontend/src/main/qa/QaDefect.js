import React, { useEffect, useState } from "react";

import { EditDeleteButton } from "../dependence/Cpnt";

function QaDefect({ testid }) {
    const [defect, setDefect] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/qadefect")
            .then(res => res.json())
            .then(data => setDefect(data))
            .catch(err => console.log(err));
    }, []);
    return (
        <div>

            <div className="qalist-container">
                {defect.filter(d => d.test_id == testid).map(d => (
                    <ListDefect key={d.defect_id} item={d} setDefect={setDefect} />
                ))}
            </div>
        </div>
    );
}

function ListDefect({ item }) {
    return (
        <div className="right-detaillist">
            <h3><span>결함 제목</span>{item?.title}</h3>
            <p><span>담당자</span>{item?.name}</p>
            <p><span>결함 내용</span>{item?.description}</p>
            <p><span>심각도</span>{item?.severity}</p>
            <p><span>처리 상태</span>{item?.status}</p>
            <p><span>처리 내용</span>{item?.resolution ?? ""}</p>
            <p><span>기록 버전</span>{item?.version}</p>
            <EditDeleteButton txt={"결함"} item={item} id={item?.defect_id} address={"qadefect"} editPage={"qa/editDefect"} />
        </div>
    );
}

export default QaDefect;