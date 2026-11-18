import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import "./login.css";

function Signup() {
    const [msgmail, setMsgmail] = useState(""); //아이디 중복확인
    const [msgpwd, setMsgpwd] = useState(""); //패스워드 조건
    const [msgeq, setMsgEq] = useState(""); //패스워드 확인 일치 or 불일치
    const [showpw, setShow] = useState(false); //패스워드 보이기 or 안보이기
    const [showpwe, setShowe] = useState(false); //패스워드 보이기 or 안보이기
    const [values, setValues] = useState({ name: '', email: '', password: '' });
    const navi = useNavigate();

    const checkpw = (e) => {//사용자 지정 조건 검사
        const pwelem = e.target;
        const pwvalue = e.target.value;
        let txt;
        if (!/[A-Z]/.test(pwvalue))
            txt = "대문자를 하나 이상 포함하세요.";
        else if (!/[a-z]/.test(pwvalue))
            txt = "소문자를 하나 이상 포함하세요.";
        else if (!/[0-9]/.test(pwvalue))
            txt = "숫자를 하나 이상 포함하세요.";
        else if (!/[^A-Za-z0-9]/.test(pwvalue))
            txt = "특수문자를 하나 이상 포함하세요.";
        else
            txt = "";
        pwelem.setCustomValidity(txt);
        setMsgpwd(txt);//출력용
    }
    const checkEq = (e) => {
        const pwckelem = e.target;
        let txt = (e.target.form.password.value === pwckelem.value) ? "" : "비밀번호가 일치하지 않습니다.";
        pwckelem.setCustomValidity(txt);
        setMsgEq(txt);//출력용
    }
    const checkEmail = (e) => {
        let txt;
        const emailElem = e.target.form.email;
        axios.post('http://localhost:3000/duplic', values).then(res => {
            console.log(res.data)
            if (res.data === "duplic") {
                txt = "email이 중복되었습니다";
                emailElem.setCustomValidity(txt);
            } else if (res.data === "notduplic") {
                txt = "email을 사용할 수 있습니다";
                emailElem.setCustomValidity("");
            }
            setMsgmail(txt);
        });
    }
    const handleInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });

        if (e.target.name === 'email') {
            setMsgmail("email중복 검사를 하세요");
            e.target.setCustomValidity("email중복 검사를 하세요");
        }
    }
    const submitData = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/signup', values).then(res => {
            alert("가입 성공");
            navi('/');
        })
    }
    return (
        <div className="login-container">
            <h1>사원 가입</h1>
            <form onSubmit={submitData}>
                <div className="line">
                    <label>이름</label>
                    <input placeholder='이름' name='name' pattern="[가-힣]+" onChange={handleInput} required />
                </div>
                <div className="line">
                    <label>이메일</label>
                    <input placeholder='이메일' name='email' type='email' onChange={handleInput} required />
                    <div className='email-check'>
                        <button className='none' type="button" onClick={checkEmail}>이메일 중복 체크</button>
                        {msgmail && <p>{msgmail}</p>}
                    </div>
                </div>
                <div className="line">
                    <label>비밀번호</label>
                    <div className="password-input">
                        <input type={showpw ? "text" : "password"} name="password" onInput={checkpw} onChange={handleInput} placeholder="비밀번호" required />
                        <input type="button" className="password-toggle" name="changetype" value={showpw ? "숨기기" : "보이기"} onChange={handleInput} onClick={() => setShow(!showpw)} />
                    </div>
                    {msgpwd && <p>{msgpwd}</p>}
                </div>
                <div className="line">
                    <label>비밀번호 확인</label>
                    <div className="password-input">
                        <input type={showpwe ? "text" : "password"} name="pwck" placeholder="비밀번호 확인" onInput={checkEq} required />
                        <input type="button" className="password-toggle" name="changetype" value={showpwe ? "숨기기" : "보이기"} onChange={handleInput} onClick={() => setShowe(!showpwe)} />
                    </div>
                    {msgeq && <p>{msgeq}</p>}
                </div>
                <button className="centersubmit">가입하기</button>
            </form>
            <div className="link">
                <p>계정이 있은신가요?</p>
                <Link to="/login">사원 가입</Link>
            </div>
        </div>
    );
}

export default Signup;