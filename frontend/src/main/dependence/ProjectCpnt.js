import React from "react";

import "./cpnt.css";

export function ShowSearchMember({ state, setState, bool }) {//프로젝트의 참여자
    return (
        <div className="participant-list">
            {
                state?.map((item) => (
                    <span className="nametag" key={item?.employee_id}>
                        {item?.name}
                        {
                            bool?
                            <button type="button" onClick={() => setState(state?.filter((p) => p.employee_id !== item?.employee_id))}>[X]</button>:
                            null
                        }
                    </span>
                ))
            }
        </div>
    );
}
export function Progress({ progress }) {//진행도
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
    );
}