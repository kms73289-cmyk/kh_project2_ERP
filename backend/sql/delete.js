const express = require("express");
const db = require("../db");
const router = express.Router();

function deleterow(sql, id, res) {
    db.query(sql, id, (err, data) => {
        if (err)
            return res.status(500).json({ result: "DPerror" });
        if (data.affectedRows === 0)
            return res.status(404).json({ result: "notFound" });
        return res.json({ result: "success" });
    });
}

// 해당 프로젝트 삭제
router.delete("/projects/:id", (req, res) => {
    const sql = "DELETE FROM projects WHERE project_id = ?";
    deleterow(sql, [req.params.id], res);
});
// 해당 업무 삭제
router.delete("/tasks/:id", (req, res) => {
    const sql = "DELETE FROM tasks WHERE task_id = ?";
    deleterow(sql, [req.params.id], res);
});
//해당 할일 삭제
router.delete("/listDelet/:id", (req, res) => {
    const sql = "DELETE FROM task_checklists WHERE list_number = ?";
    deleterow(sql, [req.params.id], res);
})
//해당 일정 삭제
router.delete("/delsch/:id", (req, res) => {
    const sql = "DELETE FROM schedules WHERE schedule_id = ?";
    deleterow(sql, [req.params.id], res);
})
//----------------------------------------
//게시글 삭제
router.delete("/posts/:id", (req, res) => {
    const sql = "DELETE FROM posts WHERE post_id = ?";
    deleterow(sql, [req.params.id], res);
});
// 댓글 삭제
router.delete("/comments/:id", (req, res) => {
    const sql = "DELETE FROM comments WHERE comment_id = ? AND employee_id = ?";
    deleterow(sql, [req.params.id, req.body.empid], res);
});
//------------------------------------------
// 보관중인 문의 삭제 기능
router.delete("/inquiries/:id", (req, res) => {
    const sql = `DELETE FROM inquiries WHERE inquiry_id = ?`;
    deleterow(sql, [req.params.id], res);
});
// 요청 삭제
router.delete("/requests/:id", (req, res) => {
    const sql = `DELETE FROM project_requests WHERE project_request_id = ?`;
    deleterow(sql, [req.params.id], res);
});
//-------------------------------------------
// 제품 삭제
router.delete("/products/:id",(req, res)=>{
    const sql = `DELETE FROM products WHERE product_id = ?`;
    deleterow(sql, [req.params.id], res);
})
router.delete("/orders/:id",(req, res)=>{
    const sql = `DELETE FROM orders WHERE orders_id = ?`;
    deleterow(sql, [req.params.id], res);
})
//----------------------------------------------------
router.delete("/qatest/:id", (req, res) => {
    const sql = `DELETE FROM qa_test WHERE test_id = ?`;
    deleterow(sql, [req.params.id], res);
});

router.delete("/qaresult/:id", (req, res) => {
    const sql = `DELETE FROM qa_result WHERE result_id = ?`;
    deleterow(sql, [req.params.id], res);
});

router.delete("/qadefect/:id", (req, res) => {
    const sql = `DELETE FROM qa_defect WHERE defect_id = ?`;
    deleterow(sql, [req.params.id], res);
});
// ===========================fm관련 api요청처리============================
// 예산항목 삭제
router.delete("/budgets/:budget_id", (req, res) => {
    const sql = "DELETE FROM budgets WHERE budget_id = ?";

    deleterow(sql, [req.params.budget_id], res)
});

// 수입 / 지출 삭제
router.delete("/transactions/:transaction_id", (req, res) => {
    const { transaction_id } = req.params;

    const sql = `
      DELETE FROM financial_transactions
      WHERE transaction_id = ?
    `;

    deleterow(sql, [transaction_id],res)
});

// HRM(인적자원관리)----------------------------------------------------
//부서 삭제
router.delete("/departments/:id", (req, res) => {
    const { id } = req.params;

    const sql = "delete from departments where department_id = ?";

    deleterow(sql, [id], res);
});

module.exports = router;
