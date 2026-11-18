const express = require("express");
const db = require("../db");
const router = express.Router();

function selectdata(sql, res) {
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return res.json("Error");
        }
        return res.json(data);
    });
}
// 사원 id, 이름 검색
router.get("/searchMember", (req, res) => {
    const sql = "SELECT e.*, d.department_name FROM employees e LEFT JOIN departments d USING(department_id)";
    selectdata(sql, res);
});

// 프로젝트 + 매니저 이름 검색
router.get("/projects", (req, res) => {
    const sql = `SELECT p.*, e.name AS manager_name 
    FROM projects p 
    JOIN employees e ON p.project_manager = e.employee_id`;
    selectdata(sql, res);
});
// 프로젝트 참여자 검색
router.get("/member", (req, res) => {
    const sql = `SELECT m.*, e.name
    FROM project_members m
    JOIN employees e ON m.employee_id = e.employee_id`;
    selectdata(sql, res);
});
// 업무 검색
router.get("/tasks", (req, res) => {
    const sql = `SELECT t.*, e.name 
    FROM tasks t JOIN employees e 
    ON t.task_manager = e.employee_id`;
    selectdata(sql, res);
});
// 업무 체크리스트 검색
router.get("/taskList", (req, res) => {
    const sql = `SELECT c.*, e.name, t.task_name 
    FROM task_checklists c JOIN tasks t ON t.task_id = c.task_id LEFT 
    JOIN employees e ON t.task_manager = e.employee_id`;
    selectdata(sql, res);
});
// 일정 조회
router.get("/schedule", (req, res) => {
    const sql = "SELECT s.*, e.name FROM schedules s JOIN employees e USING(employee_id)";
    selectdata(sql, res);
})
//커뮤니티--------------------------------------------------------------
//전체 게시글 조회
router.get('/posts', (req, res) => {
    const sql = `SELECT posts.*, employees.name AS author
                FROM posts
                JOIN employees ON posts.employee_id = employees.employee_id
                ORDER BY posts.post_id DESC`;
    selectdata(sql, res);
});
//내 게시글 조회
router.get('/employees/:employeeId/posts', (req, res) => {
    const sql = `SELECT posts.*, employees.name AS author
                FROM posts
                JOIN employees ON posts.employee_id = employees.employee_id
                WHERE posts.employee_id = ?
                ORDER BY posts.post_id DESC`;

    db.query(sql, [req.params.employeeId], (err, results) => {
        if (err) {
            return res.status(500).json("Error");
        }
        res.json(results);
    });
});

//특정 게시글 댓글 목록 조회
router.get('/posts/:id/comments', (req, res) => {
    const sql = `SELECT comments.*, employees.name AS author
            FROM comments
            JOIN employees ON comments.employee_id = employees.employee_id
            WHERE comments.post_id = ?
            ORDER BY comments.comment_id ASC`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json("Error");
        }
        res.json(results);
    });
});
//----------------------------------------------------------------------------
// 고객 문의 조회
router.get("/inquiries", (req, res) => {
    const sql = `SELECT i.*, c.*, e.name
                FROM inquiries i
                JOIN customers c ON i.customer_id = c.customer_id
                LEFT JOIN employees e ON i.employee_id = e.employee_id`
    selectdata(sql, res)
});
// 프로젝트 요청 목록 조회
router.get(`/project-requests`, (req, res) => {
    const sql = `SELECT pr.*, c.customer_name
            FROM project_requests pr
            JOIN customers c ON pr.customer_id = c.customer_id
            ORDER BY pr.requested_at DESC, pr.project_request_id`;
    selectdata(sql, res);
})
// 고객 목록
router.get("/customerlist", (req, res) => {
    const sql = `SELECT *  FROM customers`;
    selectdata(sql, res);
});
//---------------------------------------------------------------
//상품 조회
router.get("/products", (req, res) => {
    const sql = `SELECT *  FROM products`;
    selectdata(sql, res);
});
//주문 조회
router.get("/orders", (req, res) => {
    const sql = `SELECT o.*,CONCAT('ORD-', LPAD(o.order_id, 6, '0')) AS order_number, p.product_name, c.customer_name FROM orders o JOIN products p USING(product_id) JOIN customers c USING(customer_id)`;
    selectdata(sql, res);
});
//리뷰 조회
router.get("/reviews", (req, res) => {
    const sql = `SELECT r.*, p.product_id, p.product_name, c.customer_name, CONCAT('ORD-', LPAD(o.order_id, 6, '0')) AS order_number
                FROM reviews r
                JOIN orders o USING(order_id)
                JOIN products p USING(product_id)
                JOIN customers c USING(customer_id);`;
    selectdata(sql, res);
});
//이커머스
router.get("/store", (req, res) => {
    const sql = `SELECT * FROM store_layout`;
    selectdata(sql, res);
});
//------------------------------------------------------
//테스트 조회
router.get("/qatest",(req, res)=>{
    const sql = "SELECT t.*, e.name, p.project_name FROM qa_test t JOIN projects p USING(project_id) LEFT JOIN employees e USING(employee_id)";
    selectdata(sql, res);
});
//테스트 결과 조회
router.get("/qaresult",(req, res)=>{
    const sql = "SELECT r.*, e.name, t.title AS t_title FROM qa_result r JOIN qa_test t USING(test_id) LEFT JOIN employees e ON r.employee_id = e.employee_id";
    selectdata(sql, res);
});
//결함 조회
router.get("/qadefect",(req, res)=>{
    const sql = "SELECT d.*, e.name, t.title AS t_title FROM qa_defect d LEFT JOIN qa_test t USING(test_id) LEFT JOIN employees e ON d.employee_id = e.employee_id";
    selectdata(sql, res);
});
// ============================fm관련 api요청처리==================================
// 전체 예산 목록
router.get("/budgets/all", (req, res) => {
    const sql = `
        SELECT
            budget_id,
            budget_name,
            budget_amount,
            DATE_FORMAT(budget_month, '%Y-%m') AS yearMonth
        FROM budgets
        ORDER BY budget_id
    `;

    selectdata(sql, res);
});

// 예산에 연결된 전체 지출 목록
router.get("/budgets/expenses", (req, res) => {
    const sql = `
        SELECT
            f.transaction_id,
            f.budget_id,
            f.transaction_title,
            DATE_FORMAT(f.transaction_date, '%Y-%m-%d') AS transaction_date,
            f.amount AS expense_amount,
            f.memo
        FROM financial_transactions AS f
        INNER JOIN budgets AS b
            ON f.budget_id = b.budget_id
        WHERE f.transaction_type = 'EXPENSE'
        ORDER BY f.transaction_date DESC, f.transaction_id DESC
    `;

    selectdata(sql, res);
});

// 수입/지출 관련 목록
router.get("/transactions/all", (req, res) => {
    const sql = `
        SELECT f.*, p.project_name, e.name
        FROM financial_transactions f
        LEFT JOIN projects p ON p.project_id = f.project_id
        LEFT JOIN employees e ON e.employee_id = f.created_by
        ORDER BY transaction_date DESC, transaction_id DESC
    `;

    selectdata(sql, res);
});

// HRM(인적자원관리)----------------------------------------------
// 부서 목록 조회
router.get("/departments", (req, res) => {
    const sql = "SELECT d.*, e.name FROM departments d LEFT JOIN employees e ON e.employee_id = d.manager_id";
    selectdata(sql, res);
});

// 근태 기록 조회
router.get("/attendance", (req, res) => {
    const sql = `
    SELECT h.*, e.name, d.department_name
    FROM h_attendance h 
    JOIN employees e ON e.employee_id = h.employee_id 
    LEFT JOIN departments d ON e.department_id = d.department_id
`;
    selectdata(sql, res);
});
//연차 신청내역 조회
router.get("/leave", (req, res) => {
    const sql = `
        SELECT l.*, e.name
        FROM h_leave_requests l
        JOIN employees e ON e.employee_id = l.employee_id
        ORDER BY created_at DESC
    `;
selectdata(sql, res)
});

module.exports = router;
