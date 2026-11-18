import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./cpnt.css";

//사원 검색
export function SearchMember({ setState }) {
    const [searchName, setSearchName] = useState(""); //검색할 이름
    const [searchResults, setSearchResults] = useState([]); //검색 결과
    useEffect(() => {
        axios.get("http://localhost:3000/searchMember")
            .then(res => setSearchResults(res.data))
            .catch(err => console.log(err));
    }, []);
    return (
        <div>
            <div className="input-data">
                <input type="search" name="searchName" placeholder="이름 검색" value={searchName} onChange={(e) => setSearchName(e.target.value)} autoComplete="off" />
            </div>
            <div>
                {
                    searchName.trim() !== "" && searchResults.filter(empl => empl.name.includes(searchName.trim())).map(item => (
                        <li key={item.employee_id}>
                            {item.employee_id} : {item.name}
                            <button type="button" onClick={() => setState(item)}>추가</button>
                        </li>
                    ))
                }
            </div>
        </div>
    );
}
//프로젝트 검색
export function SearchProject({ setState }) {
    const [searchResults, setSearchResults] = useState([]); //검색 결과
    useEffect(() => {
        axios.get("http://localhost:3000/projects")
            .then(res => {
                setSearchResults(res.data);
                setState(res.data[0]);
            })
            .catch(err => console.log(err));
    }, []);
    return (
        <div className="inputform">
            <label>프로젝트 선택</label>
            <div className="input-data">
                <select onChange={(e) => setState(searchResults.find(p => p.project_id == e.target.value))}>
                    {searchResults.map(p => (
                        <option key={p.project_id} value={p.project_id}>
                            {p.project_name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
//테스트 검색
export function SearchTest({ setState }) {
    const [searchResults, setSearchResults] = useState([]); //검색 결과
    useEffect(() => {
        axios.get("http://localhost:3000/qatest")
            .then(res => {
                setSearchResults(res.data);
                setState(res.data[0]);
            })
            .catch(err => console.log(err));
    }, []);
    return (
        <div className="inputform">
            <label>테스트 선택</label>
            <div className="input-data">
                <select onChange={(e) => setState(searchResults.find(t => t.test_id == e.target.value))}>
                    {searchResults.map(item => (
                        <option key={item.test_id} value={item.test_id}>
                            {item.title}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export function SearchBox({ value, onChange, placeholder }) {
    return (
        <input
            type="search"
            aria-label={placeholder}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
}

// 총합
export function ShowBoxNumber({ txt, length, cnt }) {
    return (
        <div className="box-length">
            <h3>{txt}</h3>
            <p><span>{length ?? 0}</span>{cnt ? "명" : " 건"}</p>
        </div>
    );
}
// 퍼센트
export function ShowBoxPercent({ txt, count, total }) {
    const percent = total > 0 ? Math.round(count / total * 100) : 0;
    return (
        <div className="box-length">
            <h3>{txt}</h3>
            <div className="percent-circle"
                style={{ background: `conic-gradient(#008B8B ${percent}%, #DCE5EC 0)` }}>
                <span>{percent}%</span>
            </div>
        </div>
    );
}

//수정 삭제 버튼 컴포넌트
export function EditDeleteButton({ txt, item, id, address, editPage }) {
    const navi = useNavigate();
    return (
        <div className="edit-delete">
            <button className="edit-button" type="button" onClick={() =>
                navi(`../${editPage}/${id}`, { state: { item } })}>
                {txt} 수정
            </button>
            <button className="delete-button" type="button" onClick={(e) => {
                if (!window.confirm(`해당 ${txt}을(를) 삭제하시겠습니까?`))
                    return;
                axios.delete(`http://localhost:3000/${address}/${id}`)
                    .then(() => {
                        alert(txt + " 삭제 완료");
                        window.location.reload();
                    }).catch(err => console.log(err));
            }}>
                {txt} 삭제
            </button>
        </div>
    );
}