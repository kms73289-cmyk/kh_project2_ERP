import React, { useEffect, useState } from "react";

import { EditDeleteButton } from "../dependence/Cpnt";

function QaResulte({ testid }) {
    const [result, setResult] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/qaresult")
            .then(res => res.json())
            .then(data => setResult(data))
            .catch(err => console.log(err));
    }, []);
    return (
        <div className="qalist-container">
            {result.filter(r => r.test_id == testid).map(r => (
                <ListResult key={r.result_id} item={r} />
            ))}
        </div>

    );
}

function ListResult({ item }) {
    return (
        <div className="right-detaillist">
            <h3><span>테스트 결과</span>{item?.actual}</h3>
            <p><span>담당자</span>{item?.name}</p>
            <p><span>판정</span>{item?.outcome}</p>
            <p><span>실행일</span>{item?.executed_on?.slice(0, 10)}</p>
            <p><span>테스트 버전</span>{item?.test_version}</p>
            <EditDeleteButton txt={"결과"} item={item} id={item?.result_id} address={"qaresult"} editPage={"qa/editResult"} />
        </div>
    );
}
export default QaResulte;