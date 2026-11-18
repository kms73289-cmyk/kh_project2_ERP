import React, { useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "../dependence/ProjectCpnt";

import "./home.css";

const sameId = (a, b) => a != null && b != null && String(a) === String(b);
const dateText = value => value?.slice(0, 10) || "미정";
const percent = value => Math.min(100, Math.max(0, Number(value) || 0));

function MyHome({ empid, employee, projects = [], projectMember = [], tasks = [], inquiries = [], schedules = [], homeAction }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [inquiryFilter, setInquiryFilter] = useState("전체");
  const navigate = useNavigate();
  const myProjects = projects.filter(project =>
    sameId(project.project_manager, empid) || projectMember.some(member =>
      sameId(member.employee_id, empid) && sameId(member.project_id, project.project_id)));
  // some => 배열의 요소중 하나라도 주어진 판별 함수을 통과하는지 테스트해서 true 또는 false를 반환하는 함수
  // 프로젝트 메니저 인지 filter로 거르고(true라면 프로젝트 담당자니까 내 프로젝트 목록에 뜬다) ||
  // 그 프로젝트(project) 인스턴스에 projectMember인스턴스
  const activeProjects = myProjects.filter(project => project.project_status !== "완료");
  const myTasks = tasks.filter(task => sameId(task.task_manager, empid));
  const pendingTasks = myTasks.filter(task => Number(task.task_progress ?? 0) < 100);
  const myInquiries = inquiries.filter(inquiry => sameId(inquiry.employee_id, empid));
  const visibleInquiries = myInquiries.filter(inquiry => inquiryFilter === "전체" || inquiry.inquiry_status === inquiryFilter);
  const today = dayjs().format("YYYY-MM-DD");
  const upcomingSchedules = schedules.filter(schedule => sameId(schedule.employee_id, empid) && schedule.s_date?.slice(0, 10) >= today)
    .sort((a, b) => a.s_date.localeCompare(b.s_date));
  const todaySchedules = upcomingSchedules.filter(schedule => schedule.s_date.slice(0, 10) === today);
  const selectedProject = activeProjects.find(project => sameId(project.project_id, selectedProjectId)) ?? activeProjects[0] ?? null;
  const selectedTasks = selectedProject ? myTasks.filter(task => sameId(task.project_id, selectedProject.project_id)) : [];

  // 첫 ID는 접속 사원, 마지막 ID는 상담 ID. 기존 InquiryForm은 state.inquiry도 사용합니다.
  const openInquiry = inquiry => navigate(`/main/${empid}/customers/editInquiry/${inquiry.inquiry_id}`, {
    state: { inquiry, edit: true, empl: employee }
  });

  return (
    <div className="erp-home-layout">
      <div className="home-page">
        <div className="home-heading">
          <div><h1>내 업무 홈</h1><p>{employee?.name ? `${employee.name}님, ` : ""}오늘의 업무를 확인하세요.</p></div>
          <div className="home-heading-actions">
            {homeAction}
            <time dateTime={today}>{dayjs().format("YYYY.MM.DD")} {"일월화수목금토"[dayjs().day()]}요일</time>
          </div>
        </div>
        <div className="home-summary" aria-label="내 업무 요약">
          {[["참여 중 프로젝트", activeProjects.length, "folder"], ["담당 상담", myInquiries.length, "chat"],
          ["내 미완료 업무", pendingTasks.length, "check"], ["오늘 일정", todaySchedules.length, "calendar"]].map(([label, count, icon]) => (
            <div className="home-summary-card" key={icon}>
              <span className="home-summary-icon"><HomeIcon name={icon} /></span>
              <div><span>{label}</span><strong>{count}</strong></div>
            </div>
          ))}
        </div>
        <div className="home-grid">
          <HomeProjects projects={activeProjects} empid={empid} selectedProjectId={selectedProject?.project_id} onSelect={setSelectedProjectId} />
          <HomeProjectDetail project={selectedProject} tasks={selectedTasks} empid={empid} employee={employee} />
          <HomeInquiries inquiries={visibleInquiries} filter={inquiryFilter} onFilterChange={setInquiryFilter} onOpen={openInquiry} />
          <HomeSchedules schedules={upcomingSchedules} today={today} />
        </div>
      </div>
    </div>
  );
}

export default MyHome;

function HomeProjects({ projects, empid, selectedProjectId, onSelect }) {
  return (
    <section className="home-panel home-projects" aria-labelledby="home-projects-title">
      <h2 id="home-projects-title">내가 참여하는 프로젝트</h2>
      <div className="home-panel-content" tabIndex={0} role="region" aria-label="참여 프로젝트 목록">
        {projects.length === 0 && <p className="home-empty">참여 중인 프로젝트가 없습니다.</p>}
        {projects.map(project => (
          <button type="button" className="home-project-row" key={project.project_id}
            aria-pressed={sameId(selectedProjectId, project.project_id)} onClick={() => onSelect(project.project_id)}>
            <span className="home-project-text">
              <span className="home-project-title">{project.project_name} <span className="home-badge">{project.project_status}</span></span>
              <span className="home-muted">{sameId(project.project_manager, empid) ? "담당자" : "참여자"} · 마감 {dateText(project.project_end_date)}</span>
            </span>
            <span className="home-project-progress"><Progress progress={percent(project.project_progress)} /><strong>{percent(project.project_progress)}%</strong></span>
          </button>
        ))}
      </div>
    </section>
  );
}

function HomeProjectDetail({ project, tasks, empid, employee }) {
  return (
    <section className="home-panel home-project-detail" aria-labelledby="home-detail-title">
      <h2 id="home-detail-title">선택한 프로젝트</h2>
      <div className="home-panel-content" tabIndex={0} role="region" aria-label="선택한 프로젝트 정보">
        {project ? <>
          <h3 className="home-selected-title">{project.project_name}</h3>
          <dl className="home-project-facts">
            <div><dt>담당자</dt><dd>{project.manager_name || "미지정"}</dd></div>
            <div><dt>기간</dt><dd>{dateText(project.project_start_date)} ~ {dateText(project.project_end_date)}</dd></div>
            <div><dt>진행률</dt><dd>{percent(project.project_progress)}%</dd></div>
          </dl>
          <h3>내 담당 업무</h3>
          {tasks.length === 0 ? <p className="home-empty">배정된 업무가 없습니다.</p> :
            <ul className="home-task-list">{tasks.map(task => <li key={task.task_id}>
              <span>{task.task_name}</span><span className="home-muted">마감 {dateText(task.task_end)}</span>
            </li>)}</ul>}
        </> : <p className="home-empty">표시할 프로젝트가 없습니다.</p>}
      </div>
      {project && <Link className="home-detail-link" to={`/main/${empid}/projects/projectMain`}
        state={{ selectedProjectId: project.project_id, empl: employee }}>프로젝트 바로가기</Link>}
    </section>
  );
}

function HomeInquiries({ inquiries, filter, onFilterChange, onOpen }) {
  return (
    <section className="home-panel home-inquiries" aria-labelledby="home-inquiries-title">
      <div className="home-panel-heading"><h2 id="home-inquiries-title">내 담당 상담</h2><p>내가 담당자로 지정된 상담</p></div>
      <div className="home-inquiry-filters" role="group" aria-label="상담 상태 필터">
        {["전체", "대기", "완료"].map(status => <button type="button" key={status} aria-pressed={filter === status}
          onClick={() => onFilterChange(status)}>{status}</button>)}
      </div>
      <div className="home-panel-content" tabIndex={0} role="region" aria-label="담당 상담 목록">
        <table className="home-inquiry-table">
          <thead><tr><th scope="col">상담 제목</th><th scope="col">고객</th><th scope="col">상태</th><th scope="col">접수일</th></tr></thead>
          <tbody>{inquiries.length === 0 ? <tr><td colSpan="4" className="home-empty">{filter === "전체" ? "담당 상담이 없습니다." : "해당 상태의 상담이 없습니다."}</td></tr> :
            inquiries.map(inquiry => <tr key={inquiry.inquiry_id} onClick={() => onOpen(inquiry)}>
              <td><button className="home-inquiry-open" type="button" onClick={event => { event.stopPropagation(); onOpen(inquiry); }}>{inquiry.inquiry_title || "제목 없음"}</button></td>
              <td>{inquiry.customer_name || "-"}</td><td><span className="home-badge">{inquiry.inquiry_status || "-"}</span></td>
              <td>{dateText(inquiry.received_at)}</td>
            </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function HomeSchedules({ schedules, today }) {
  const tomorrow = dayjs(today).add(1, "day").format("YYYY-MM-DD");
  return (
    <section className="home-panel home-schedules" aria-labelledby="home-schedules-title">
      <h2 id="home-schedules-title">내 일정</h2>
      <div className="home-panel-content" tabIndex={0} role="region" aria-label="오늘 이후 내 등록 일정">
        {schedules.length === 0 ? <p className="home-empty">예정된 일정이 없습니다.</p> :
          <ul className="home-schedule-list">{schedules.map(schedule => {
            const date = schedule.s_date.slice(0, 10);
            const label = date === today ? "오늘 " : date === tomorrow ? "내일 " : "";
            return <li key={schedule.schedule_id}><time className={date === today ? "is-today" : ""} dateTime={date}>{label}{date.slice(5).replace("-", ".")}</time><span>{schedule.s_content || "내용 없음"}</span></li>;
          })}</ul>}
      </div>
    </section>
  );
}

function HomeIcon({ name }) {
  const paths = {
    folder: "M3 7h7l2 2h9v11H3z M3 7V4h6l2 3",
    chat: "M4 5h16v12H9l-5 4z M8 9h8 M8 13h5",
    check: "M8 3h8v4H8z M8 5H4v16h16V5h-4 M8 14l3 3 5-6",
    calendar: "M4 5h16v16H4z M8 3v5 M16 3v5 M4 11h16"
  };
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
// 폴더 말풍선 체크 달력 아이콘
