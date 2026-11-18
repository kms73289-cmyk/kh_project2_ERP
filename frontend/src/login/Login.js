import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./login.css";

function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const navi = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/login', values)
            .then(res => {
                if (res.data.result === "success") {
                    alert("로그인 성공");
                    sessionStorage.setItem("empl", JSON.stringify(res.data.data));
                    navi('/main/' + res.data.data.employee_id);//로그인 완료 후 메인화면으로 넘어가기
                } else {
                    alert("아이디나 비밀번호를 확인하세요");
                    return;
                }
            })
    }

    const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div className="line">
                    <label> 이메일 </label>
                    <input type="email" name="email" placeholder="example@email.com" onChange={handleChange} />
                </div>

                <div className="line">
                    <label> 비밀번호 </label>
                    <input type="password" name="password" placeholder="비밀번호를 입력하세요" onChange={handleChange} />
                </div>

                <button className="centersubmit">로그인</button>
            </form>
            <div className="link">
                <p>계정이 없으신가요?</p>
                <Link to="/signup">사원 가입</Link>
            </div>
        </div>
    )
}

export default Login;