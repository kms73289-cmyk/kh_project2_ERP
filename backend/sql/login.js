const express = require("express");
const db = require("../db");
const router = express.Router();

// email 중복체크 (POST 요청이지만 SELECT 쿼리)
router.post("/duplic", (req, res) => {
    console.log("중복체크 실행중");
    const sql = "select `identity_email` from identities where `identity_email`=?";
    const values = [req.body.email];
    db.query(sql, values, (err, data) => {
        if (err) return res.json("Error");
        if (data.length === 0) return res.json("notduplic");
        else if (data.length > 0) return res.json("duplic");
    });
});

// 회원가입
router.post("/signup", (req, res) => {
    const sql = "insert into identities (`identity_name`, `identity_email`, `password`) values (?, ?, ?)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
        if (err) return res.json("Error");

        const sql2 = "INSERT INTO employees (`name`, `employee_id`, `email`) VALUES (?, ?, ?)";
        const values2 = [req.body.name, data.insertId, req.body.email];
        db.query(sql2, values2, (err, result) => {
            if (err) return res.json("Error");
            return res.json(result);
        });
    });
});

// 로그인 요청 (POST 요청이지만 SELECT 쿼리)
router.post("/login", (req, res) => {
    console.log("로그인 시도!");
    const sql = "select e.* from employees e JOIN identities i ON e.employee_id = i.identity_id WHERE i.identity_email=? and i.password=?";
    const values = [req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
        if (err) return res.json("Error");
        if (data.length === 1) {
            return res.json({ result: "success", data: data[0] });
        } else return res.json("fail");
    });
});

module.exports = router;