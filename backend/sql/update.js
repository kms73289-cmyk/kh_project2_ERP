const express = require("express");
const db = require("../db");
const router = express.Router();

function update(sql, value, res) {
    db.query(sql, value, (err, data) => {
        if (err)
            return res.status(500).json({ result: "UpdateError" });
        return res.json({ result: "success" });
    });
}

// 해당 프로젝트 업데이트
router.put("/updateProject", (req, res) => {
    const sql = "UPDATE projects SET project_name=?, project_manager=?, project_start_date=?, project_end_date=?, project_progress=?, project_status=? WHERE project_id=?";
    const value = [req.body.project_name, req.body.project_manager, req.body.project_start_date, req.body.project_end_date, req.body.project_progress, req.body.project_status, req.body.project_id];
    update(sql, value, res);
});
//해당 업무 업데이트
router.put("/updateTask", (req, res) => {
    const sql = "UPDATE tasks SET task_name=?,task_priority=?, task_manager=?, task_start=?, task_end=?, task_progress=?, project_id=? WHERE task_id=?";
    const value = [req.body.tname, req.body.priority, req.body.manager, req.body.start, req.body.end, req.body.progress, req.body.projectId, req.body.tid];
    update(sql, value, res);
});
//일정 업데이트
router.put("/updateSchedule", (req, res) => {
    const sql = "UPDATE schedules SET s_content = ?, s_date = ?, hidden = ? WHERE schedule_id = ?";
    const value = [req.body.content, req.body.s_date, req.body.hidden, req.body.sid];
    update(sql, value, res);
});

//진행도 저장
router.put("/updatechecklist", (req, res) => {
    const sql = "UPDATE task_checklists SET complete = ? WHERE list_number = ?";
    const checks = Object.entries(req.body.checks);
    let count = 0;
    checks.forEach(([key, value]) => {
        db.query(sql, [value, key], (err, data) => {
            if (err)
                return res.status(500).json({ result: "UpdateError" });
            count++;
            if (count === checks.length)
                return res.json({ result: "success" });
        });
    });
});
router.put("/updatetaskProgress", (req, res) => {
    const sql1 = "UPDATE tasks SET task_progress = ? WHERE task_id = ?";
    const value1 = [req.body.progress, req.body.tid];
    db.query(sql1, value1, (err, data) => {
        if (err)
            return res.status(500).json({ result: "UpdateError" });
        const sql2 = "UPDATE projects SET project_progress = ? WHERE project_id = ?";
        const value2 = [req.body.p_progress, req.body.pid];
        update(sql2, value2, res);
    });
});
//--------------------------------------------------------
//댓글 수정
// *사용자 아이디 바꾸기
router.put('/comments/:id', (req, res) => {
    const sql = "UPDATE comments SET comment_content = ? WHERE comment_id = ? AND employee_id = ?"
    const value = [req.body.content, req.params.id, req.body.empid];
    update(sql, value, res);
});

//게시글 수정
router.put('/editposts', (req, res) => {
    const sql = `UPDATE posts
             SET post_title = ?,
                 board_type = ?,
                 post_type = ?,
                 is_secret = ?,
                 post_content = ?
             WHERE post_id = ?`;
    const value = [
        req.body.title,
        req.body.boardType,
        req.body.postType,
        req.body.isSecret ? 1 : 0,
        req.body.content,
        req.body.id
    ];
    update(sql, value, res);
});
//-----------------------------------------------------
//문의 수정
router.put("/updateInq", (req, res) => {
    const sql = `UPDATE inquiries SET
                customer_id = ?,
                employee_id = ?,
                inquiry_title = ?,
                inquiry_details = ?,
                consultation_notes = ?,
                inquiry_status = ?,
                source_channel  = ?
                WHERE inquiry_id = ?`;
    const value = [
        req.body.custId,
        req.body.empId || null,
        req.body.inqTitle,
        req.body.inqDetail,
        req.body.notes,
        req.body.status,
        req.body.channel,
        req.body.inqId
    ];
    update(sql, value, res);
});

// 프로젝트 요청 수정
router.put("/updatereq", (req, res) => {
    const sql = `UPDATE project_requests SET
    customer_id = ?,
    request_title = ?,
    requirements = ?,
    desired_due_date = ?,
    project_request_status = ?
    WHERE project_request_id = ?`;
    const value = [
        req.body.custId,
        req.body.title,
        req.body.requirement,
        req.body.date,
        req.body.status,
        req.body.prid
    ]
    update(sql, value, res);
});
//--------------------------------------------------
//상품 업데이트
router.put("/updateProduct", (req, res) => {
    const sql = `UPDATE products SET
    category = ?,
    product_name = ?,
    product_description = ?,
    product_price = ?
    WHERE product_id = ?`;
    const value = [
        req.body.cate,
        req.body.pdname,
        req.body.description,
        req.body.price,
        req.body.pdid
    ]
    update(sql, value, res);
});
//주문 업데이트
router.put("/updateOrder", (req, res) => {
    const sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
    const value = [req.body.status, req.body.id];
    update(sql, value, res);
});
//리뷰 업데이트
router.put("/updateReview", (req, res) => {
    const sql = `UPDATE reviews
    SET admin_reply = ?,
    replied_at = CURRENT_TIMESTAMP
    WHERE review_id = ?`;
    const value = [req.body.reply, req.body.id];
    update(sql, value, res);
});
//홈페이지 데이터 업데이트
router.put("/updateStore", (req, res) => {
    const sql = "UPDATE store_layout SET content_text = ?, show_item = ?, image_path = COALESCE(?, image_path) WHERE layout_id = ?";
    const items = req.body.storeData;
    let count = 0;
    if (items.length === 0)
        return res.json({ result: "success" });
    items.forEach(item => {
        db.query(sql, [item.content_text, item.show_item, item.image_path, item.layout_id], (err, data) => {
            if (err) {
                console.log("SQL 오류:", err);
                return res.status(500).json({ result: "UpdateError" });
            }
            count++;
            if (count === items.length)
                return res.json({ result: "success" });
        });
    });
});
//----------------------------------------------------
router.put("/updateTest", (req, res) => {
    const sql = `UPDATE qa_test
    SET project_id=?, employee_id=?, title=?, steps=?, expected=?
    WHERE test_id=?`;
    const value = [
        req.body.project_id, req.body.employee_id,
        req.body.title, req.body.steps, req.body.expected,
        req.body.test_id
    ];
    update(sql, value, res);
});

router.put("/updateResult", (req, res) => {
    const sql = `UPDATE qa_result
    SET test_id=?, employee_id=?, actual=?, outcome=?, executed_on=?, test_version=test_version+1
    WHERE result_id=?`;
    const value = [
        req.body.test_id, req.body.employee_id,
        req.body.actual, req.body.outcome, req.body.executed_on,
        req.body.result_id
    ];
    update(sql, value, res);
});

router.put("/updateDefect", (req, res) => {
    const sql = `UPDATE qa_defect
    SET test_id=?, employee_id=?, title=?, description=?,
        severity=?, status=?, resolution=?, version=version+1
    WHERE defect_id=?`;
    const value = [
        req.body.test_id, req.body.employee_id,
        req.body.title, req.body.description,
        req.body.severity, req.body.status,
        req.body.resolution, req.body.defect_id
    ];
    update(sql, value, res);
});
// =====================================fm관련 api요청처리=============================
// 예산 항목 업데이트
router.patch("/budgets/:budget_id", (req, res) => {
    const { budget_id } = req.params;
    const { budget_name, budget_amount } = req.body;

    const sql = `
        UPDATE budgets
        SET budget_name = ?, budget_amount = ?
        WHERE budget_id = ?
    `;

    update(sql, [budget_name.trim(), budget_amount, budget_id], res);
});

// 수입 / 지출 수정
router.patch("/transactions/:transaction_id", (req, res) => {
    const { transaction_id } = req.params;
    const {
        transaction_title,
        amount,
        transaction_date,
        memo,
        project_id,
        budget_id
    } = req.body;

    const sql = `
  UPDATE financial_transactions AS f
  SET transaction_title = ?,
      amount = ?,
      transaction_date = ?,
      memo = ?,
      project_id = ?,
      budget_id = ?
  WHERE f.transaction_id = ?
    AND (
      (
        f.transaction_type = 'INCOME'
        AND ? IS NOT NULL
        AND ? IS NULL
      )
      OR
      (
        f.transaction_type = 'EXPENSE'
        AND EXISTS (
          SELECT 1
          FROM budgets AS b
          WHERE b.budget_id = ?
            AND b.budget_month = ?
        )
      )
    )
`;

    const values = [
        transaction_title.trim(),
        amount,
        transaction_date,
        memo || null,
        project_id ?? null,
        budget_id ?? null,
        transaction_id,

        project_id ?? null,
        budget_id ?? null,

        budget_id ?? null,
        `${transaction_date.slice(0, 7)}-01`
    ];

    update(sql, values, res);
});
// HRM(인적자원관리)-------------------------------------------

//부서 수정
router.put("/departments/:id", (req, res) => {
    const { department_name } = req.body;
    const { id } = req.params;

    const sql = "update departments set department_name = ? where department_id = ?";
    const values = [department_name, id]

    update(sql, values, res)
});

// 근태 기록 수정
router.put("/attendance/:id", (req, res) => {
    const { id } = req.params;
    const {
        check_in,
        check_out,
        attendance_status
    } = req.body;

    const sql = `
        UPDATE h_attendance
        SET  check_in = ?,
            check_out = ?,
            attendance_status = ?
        WHERE attendance_id = ?
    `;

    const values = [
        check_in || null,
        check_out || null,
        attendance_status,
        id
    ];

    update(sql, values, res);
});

//직원 정보 수정
router.put("/employees/:id", (req, res) => {
    const { id } = req.params;
    const {
        name, phone, email, address, department_id, position, employment_type, hire_date, employment_status
    } = req.body;

    db.beginTransaction((err) => {
        if (err) return res.status(500).send("직원 수정 실패");

        //계정 정보 수정
        const identitySql = `
        update identities
        set identity_name = ?, identity_email = ?
        where identity_id = ?`;

        db.query(identitySql, [name, email, id], (err) => {
            if (err) {
                return db.rollback(() => {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).send("이미 등록된 이메일입니다.");
                    }
                    res.status(500).send("계정 정보 수정 실패");
                });
            }

            //인사정보 수정
            const employeeSql = `
            update employees
            set phone = ?, address =?, department_id = ?,
            position = ?, employment_type = ?, hire_date = ?, employment_status = ?
            where employee_id = ?`;

            const values = [
                phone, address, department_id, position, employment_type, hire_date || null,
                employment_status, id
            ];

            db.query(employeeSql, values, (err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).send("직원 정보 수정 실패");
                    });
                }
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send("직원 수정 실패");
                        });
                    }
                    res.send("직원 수정 성공")
                })
            })
        })
    })

});

// 직원 퇴사 처리
router.put("/employees/:id/resign", (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE employees
        SET employment_status = '퇴사',
            resignation_date = CURDATE()
        WHERE employee_id = ?
    `;
    const values = [id];

    update(sql, values, res)
});

//연차 반려
router.put("/leave/:id/reject", (req, res) => {
    const { id } = req.params;

    const sql = `
        update h_leave_requests
        set request_status = '반려',
            processed_at = NOW()
        where request_id = ?
            and request_status = '대기'
    `;

    const values = [id]

    update(sql, values, res)
});

// 연차 승인
router.put("/leave/:id/approve", (req, res) => {
    const { id } = req.params;

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).send("승인 처리 실패");
        }

        // 1. 연차 신청 정보 조회
        const sql1 = `
            SELECT employee_id, leave_days,
                   YEAR(leave_start_date) AS leave_year
            FROM h_leave_requests
            WHERE request_id = ?
              AND request_status = '대기'
            FOR UPDATE
        `;

        db.query(sql1, [id], (err, leaveResult) => {
            if (err || leaveResult.length === 0) {
                return db.rollback(() => {
                    res.status(400).send("승인할 수 없는 신청입니다.");
                });
            }

            const leave = leaveResult[0];

            // 2. 잔여 연차 조회
            const sql2 = `
                SELECT total_days
                FROM h_leave_balances
                WHERE employee_id = ?
                  AND leave_year = ?
                FOR UPDATE
            `;

            db.query(sql2, [leave.employee_id, leave.leave_year], (err, balanceResult) => {
                if (err || balanceResult.length === 0) {
                    return db.rollback(() => {
                        res.status(400).send("연차 잔여 정보를 찾을 수 없습니다.");
                    });
                }

                if (Number(balanceResult[0].total_days) < Number(leave.leave_days)) {
                    return db.rollback(() => {
                        res.status(400).send("잔여 연차가 부족합니다.");
                    });
                }

                // 3. 잔여 연차 차감
                const sql3 = `
                    UPDATE h_leave_balances
                    SET total_days = total_days - ?
                    WHERE employee_id = ?
                      AND leave_year = ?
                `;

                db.query(sql3, [
                    leave.leave_days,
                    leave.employee_id,
                    leave.leave_year
                ], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send("연차 차감 실패");
                        });
                    }

                    // 4. 신청 상태 승인으로 변경
                    const sql4 = `
                        UPDATE h_leave_requests
                        SET request_status = '승인',
                            approved_by = 1,
                            processed_at = NOW()
                        WHERE request_id = ?
                          AND request_status = '대기'
                    `;

                    db.query(sql4, [id], (err, result) => {
                        if (err || result.affectedRows === 0) {
                            return db.rollback(() => {
                                res.status(500).send("승인 처리 실패");
                            });
                        }

                        // 5. 모든 작업 성공 시 저장
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).send("승인 처리 실패");
                                });
                            }

                            res.send("승인 처리 완료");
                        });
                    });
                });
            });
        });
    });
});
module.exports = router;
