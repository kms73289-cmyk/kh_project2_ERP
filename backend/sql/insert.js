const express = require("express");
const db = require("../db");
const router = express.Router();

function savedata(sql, value, res) {
    db.query(sql, value, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json("InsertError");
        }
        return res.json(data);
    });
}

// 새 프로젝트 저장하기
router.post("/saveProject", (req, res) => {
    const sql = "INSERT INTO projects (`project_name`, `project_manager`, `project_start_date`, `project_end_date`, `project_progress`, `project_status`) VALUES (?)";
    const sql2 = "INSERT INTO project_members (`project_id`, `employee_id`) VALUES ?";
    const values = [req.body.project_name, req.body.project_manager, req.body.project_start_date, req.body.project_end_date, req.body.project_progress, req.body.project_status];
    db.query(sql, [values], (err, results) => {
        if (err)
            return res.json("InsertError");
        const project_id = results.insertId;
        const members = req.body.participants.map(item => [project_id, item.employee_id]);
        if (members.length === 0)
            return res.json(results);
        db.query(sql2, [members], (err, data) => {
            if (err)
                return res.status(500).json("InsertError");
            return res.json(data);
        });
    });
});
//업무 등록
router.post("/saveTask", (req, res) => {
    const sql = `INSERT INTO tasks 
    (task_name, task_priority, task_manager, task_start, task_end, task_progress, project_id)
     VALUES (?)`;
    const value = [req.body.tname, req.body.priority, req.body.manager, req.body.start, req.body.end, req.body.progress, req.body.projectId];
    savedata(sql, [value], res);
});
//업무 리스트 등록
router.post("/saveChecklist", (req, res) => {
    const sql = `INSERT INTO task_checklists
    (checklist_name, complete, task_id)
    VALUES (?, 0, ?)`;
    const value = [req.body.listname, req.body.taskid];
    savedata(sql, value, res);
});
//일정 등록
router.post("/saveSchedule", (req, res) => {
    const sql = `INSERT INTO schedules(s_content, employee_id, s_date, hidden)
    VALUES (?, ?, ?, ?)`;
    const value = [req.body.content, req.body.empid, req.body.s_date, req.body.hidden];
    savedata(sql, value, res);
});

//--------------------------------------------------
//게시글 등록
router.post('/posts', (req, res) => {

    const sql = `INSERT INTO posts
    (post_title, board_type, post_type, is_secret, post_content, employee_id)
    VALUES (?, ?, ?, ?, ?, ?)`;
    savedata(sql, [
        req.body.title,
        req.body.boardType,
        req.body.postType,
        req.body.isSecret ? 1 : 0,
        req.body.content,
        req.body.empid
    ], res);
});

//댓글 등록
router.post(`/posts/:id/comments`, (req, res) => {
    const sql = "INSERT INTO comments (post_id, employee_id, comment_content) VALUES (?, ?, ?)";
    savedata(sql, [req.params.id, req.body.employee_id, req.body.content], res);
});

// ===========================================================================================
// 문의 등록
router.post("/inquiries", (req, res) => {
    const sql = `INSERT INTO inquiries
    (customer_id, employee_id, inquiry_title, inquiry_details, inquiry_status, consultation_notes, source_channel)
    VALUES (?, ?, ?, ?, '미정', ?, ?)`;
    const value = [
        req.body.custId,
        req.body.empId || null,
        req.body.inqTitle,
        req.body.inqDetail,
        req.body.notes || null,
        req.body.channel,
    ];
    savedata(sql, value, res);
});
//고객 등록
router.post("/customers", (req, res) => {
    const sql = "INSERT INTO customers (customer_name, customer_phone) VALUES (?, ?)";
    const value = [
        req.body.custName,
        req.body.custPhone
    ];
    savedata(sql, value, res);
})
//프로젝트 요청 생성
router.post("/project-requests", (req, res) => {
    const sql = `INSERT INTO project_requests
    (customer_id, request_title, desired_due_date, requirements, project_request_status)
    VALUES (?)`;
    const value = [
        req.body.custId,
        req.body.title,
        req.body.date,
        req.body.requirement,
        req.body.status
    ]
    savedata(sql, [value], res);
});
//------------------------------------------
//상품 등록
router.post("/saveProduct", (req, res) => {
    const sql = `INSERT INTO products
    (category, product_name, product_description, product_image, product_price, product_description_image)
    VALUES (?)`;
    const value = [
        req.body.cate,
        req.body.pdname,
        req.body.description,
        req.body.product_image,
        req.body.price,
        req.body.product_description_image
    ];
    savedata(sql, [value], res);
});
//-----------------------------------------------------------------------
router.post("/saveTest", (req, res) => {
    const sql = `INSERT INTO qa_test
    (project_id, employee_id, title, steps, expected)
    VALUES (?)`;
    const value = [
        req.body.project_id,
        req.body.employee_id,
        req.body.title,
        req.body.steps,
        req.body.expected
    ];
    savedata(sql, [value], res);
});
router.post("/saveResult", (req, res) => {
    const sql = `INSERT INTO qa_result
    (test_id, employee_id, actual, outcome, executed_on)
    VALUES (?)`;
    const value = [
        req.body.test_id,
        req.body.employee_id,
        req.body.actual,
        req.body.outcome,
        req.body.executed_on
    ];
    savedata(sql, [value], res);
});
router.post("/saveDefect", (req, res) => {
    const sql = `INSERT INTO qa_defect
    (test_id, employee_id, title, description, severity, status, resolution)
    VALUES (?)`;
    const value = [
        req.body.test_id,
        req.body.employee_id,
        req.body.title,
        req.body.description,
        req.body.severity,
        req.body.status,
        req.body.resolution
    ];
    savedata(sql, [value], res);
});
// ====================================fm관련 api요청처리==========================
// 예산 항목 추가
router.post("/budgets", (req, res) => {

    const { budget_name, budget_amount, yearMonth } = req.body;
    const budget_month = `${yearMonth}-01`;
    const sql = `
        INSERT INTO budgets (
            budget_name,
            budget_amount,
            budget_month
          )
          VALUES (?, ?, ?)
    `
    savedata(sql, [budget_name, budget_amount, budget_month], res);
})

// 수입·지출 등록(수입 요청과 지출 요청을 하나의 api에서 처리)
router.post("/transactions", (req, res) => {
    const {
        transaction_title, transaction_type, amount, transaction_date,
        memo, project_id, budget_id, created_by
    } = req.body;

    const insertSql = `
      INSERT INTO financial_transactions (
        transaction_title, transaction_type, amount, transaction_date,
        memo, project_id, budget_id, created_by
      )
    `;

    let sql;
    let values;

    if (transaction_type === "INCOME") {

        // 프로젝트가 존재하면 수입 거래를 한 건 추가
        sql = insertSql + `
            SELECT ?, 'INCOME', ?, ?, ?, p.project_id, NULL, ?
            FROM projects AS p
            WHERE p.project_id = ?
        `;
        values = [
            transaction_title.trim(),
            amount,
            transaction_date,
            memo || null,
            created_by,
            project_id
        ];
    } else if (transaction_type === "EXPENSE") {

        // 선택한 예산이 거래일과 같은 달에 편성됐을 때만 등록
        sql = insertSql + `
        SELECT ?, 'EXPENSE', ?, ?, ?, ?, b.budget_id, ?
        FROM budgets AS b
        WHERE b.budget_id = ? AND b.budget_month = ?
      `;
        const budgetMonth = `${transaction_date.slice(0, 7)}-01`;
        values = [
            transaction_title.trim(), amount, transaction_date, memo || null,
            project_id ?? null, created_by, budget_id, budgetMonth
        ];
    }

    savedata(sql, values, res);
});
// HRM(인적자원관리)-----------------------------------------------------

// 부서 등록

router.post("/departments", (req, res) => {
    const { department_name } = req.body;
    const sql = "insert into departments (department_name) values (?)";
    const values = [department_name];
    savedata(sql, values, res);
});

// 직원 등록
router.post("/employees", (req, res) => {
    const {
        email, name, phone, address, department_id, position, employment_type, hire_date, employment_status
    } = req.body;

    //계정 정보 등록
    const identitysql = 'insert into identities (identity_name, identity_email, password) values(?,?,?)';

    const identityValues = [name, email, "임시값"];

    db.beginTransaction((err) => {
        if (err) return res.status(500).send("직원 등록 실패");

        db.query(identitysql, identityValues, (err, identityResult) => {
            if (err) {
                return db.rollback(() => {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).send("이미 등록된 이메일입니다.")
                    }
                    res.status(500).send("계정 등록 실패");
                });
            }
            const identityId = identityResult.insertId;

            //직원 인사정보 등록
            const employeeSql = `insert into employees(employee_id, phone, address, department_id, 
            position, employment_type, hire_date,employment_status)
            values(?,?,?,?,?,?,?,?)`;

            const employeeValues = [identityId, phone, address, department_id, position, employment_type, hire_date || null, employment_status];

            db.query(employeeSql, employeeValues, (err) => {
                if(err){
                    return db.rollback(() => {
                        res.status(500).send("직원 등록 실패");
                    });
                }

                db.commit((err) => {
                    if(err){
                        return db.rollback(()=>{
                            res.status(500).send("직원 등록 실패");
                        });
                    }
                    res.send("직원 등록 성공")
                });
            });
        })
    })

});

// 연차 신청
router.post("/leave", (req, res) => {
    const {
        employee_id,
        leave_start_date,
        leave_end_date,
        leave_days,
        leave_reason
    } = req.body;

    const sql = `
        INSERT INTO h_leave_requests
        (employee_id, leave_start_date, leave_end_date, leave_days, leave_reason)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        employee_id,
        leave_start_date,
        leave_end_date,
        leave_days,
        leave_reason
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("연차 신청 실패");
        }
        res.send("연차 신청 성공");
    });
});

module.exports = router;
