import React from "react";
import axios from "axios";

export function handleSubmit({ data, bool, saveAdress, updateAdress, mainPage, txt }) {
    const request = bool
        ? axios.post(`http://localhost:3000/${saveAdress}`, data)
        : axios.put(`http://localhost:3000/${updateAdress}`, data);
    request.then(res => {
        console.log("응답:", res.data);
        alert(bool ? txt + " 추가 완료" : txt + " 수정 완료");
        window.location.replace(`/main/${window.location.pathname.split("/")[2]}/${mainPage}`);
    }).catch(err => console.log("요청 오류:", err));
}
export function handleSubmitImg({ data, formData, saveAdress, updateAdress, mainPage, bool, txt }) {
    axios.post("http://localhost:3000/uploadImg", formData).then(res => {
        console.log("이미지 응답", res.data);
    }).catch(err => console.log("요청 오류:", err));
    const req = bool ?
        axios.post(`http://localhost:3000/${saveAdress}`, data) :
        axios.put(`http://localhost:3000/${updateAdress}`, data);
    req.then(res => {
        console.log("응답:", res.data);
        alert(bool ? txt + " 추가 완료" : txt + " 수정 완료");
        window.location.replace(`/main/${window.location.pathname.split("/")[2]}/${mainPage}`);
    }).catch(err => console.log("요청 오류:", err));
}