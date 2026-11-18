import axios from "axios";
import React, { useEffect, useState } from "react";
import { Progress } from "../dependence/ProjectCpnt";
import { handleSubmit } from "../dependence/Func";

function MyTodo({ taskList, detail, calcPrgrs }) {
    const list = taskList.filter(l => l.task_id == detail?.task_id);
    const [progress, setProgress] = useState("");

    useEffect(() => {
        setProgress(detail?.task_progress);
    }, [detail]);

    const [checks, setChecks] = useState({}); //변경된 체크리스트 기록
    const checkcomplete = (id, checked) => {
        const updated = { ...checks, [id]: checked ? 1 : 0 };
        setChecks(updated);
        const p = list.length > 0 ?
            Math.round(list.filter(i => (updated[i.list_number] ?? i.complete) == 1).length / list.length * 100) :
            0; //Math.round소수점 첫째 자리에서 반올림해서 정수로 만드는 함수, 업무 진행도 계산결과
        setProgress(p);
    }

    const seveList = (e) => {
        e.preventDefault();
        axios.put("http://localhost:3000/updatechecklist", { checks })
            .then(() => calcPrgrs(detail?.task_id, progress))
            .then(res => {
                console.log(res.data);
                alert("저장 완료");
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const deleteList = (id) => {
        if (!window.confirm("해당 할 일을 삭제하시겠습니까?")) return;
        axios.delete(`http://localhost:3000/listDelet/${id}`)
            .then(() => {
                alert("삭제 완료");
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="right">
            <div>
                <form onSubmit={seveList}>
                    <div className="list-add">
                        <h3>
                            <span>{detail?.task_name}</span> 진행률
                            <button type="submit">저장</button>
                        </h3>
                        <Progress progress={progress} />
                    </div>
                    <div className="list-in">
                        {
                            list.map(item => (
                                <div className="list" key={item.list_number}>
                                    <span>{item.checklist_name}</span>
                                    <input type="checkbox"
                                        checked={Boolean(checks[item.list_number] ?? item.complete)}
                                        onChange={(e) => checkcomplete(item.list_number, e.target.checked)} />
                                    <button type="button" onClick={() => deleteList(item.list_number)}>X</button>
                                </div>
                            ))
                        }
                    </div>
                </form>
            </div>

            <div className="list-add">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = { taskid: detail?.task_id, listname: e.target.elements.listname.value };
                    handleSubmit({
                        data: data, bool: true, saveAdress: "saveChecklist",
                        updateAdress: "", mainPage: "projects/projectMy", txt: "할일"
                    });
                }}>
                    <label>할일 추가</label>
                    <input type="text" name="listname" autoComplete="off" required />
                    <button type="submit">저장</button>
                </form>
            </div>
        </div>
    );
}

export default MyTodo;