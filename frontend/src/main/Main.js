import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./css/containTop.css";
import "./css/container.css";
import "./css/inputform.css";
import "./css/button.css";

import Home from "./home/Home";
import Aside from "./Aside";
import Header from "./Header";

import ProjectManagement from "./prjt/ProjectManagement";
import ProjectTask from "./prjt/ProjectTask";
import ProjectMy from "./prjt/ProjectMy";
import ProjectNew from "./prjt/ProjectNew";
import TaskNew from "./prjt/TaskNew";

import ScheduleManagement from "./sch/ScheduleManagement";
import ScheduleMy from "./sch/ScheduleMy";

import CustomerInfo from "./crm/CustomerInfo";
import CustForm from "./crm/CustForm";
import Inquiry from "./crm/Inquiry";
import InquiryForm from "./crm/InquiryForm";
import ProjectRequest from "./crm/ProjectRequest";
import ProjectRequestEdit from "./crm/ProjectRequestEdit";

import PostList from "./cmnt/PostList";
import MyPosts from "./cmnt/MyPosts";
import PostDetail from "./cmnt/PostDetail";
import PostWrite from "./cmnt/PostWrite";
import ScheduleProject from "./sch/SchduleProject";
import ScheduleNew from "./sch/SchduleNew";

import EcommerceManagement from "./ecm/EcommerceManagement";
import OrdersEdit from "./ecm/OrdersEdit";
import Orders from "./ecm/Orders";
import ProductNew from "./ecm/ProductNew";
import Reviews from "./ecm/Reviews";
import Layout from "./ecm/Layout";
import Product from "./ecm/Product";
import ReviewEdit from "./ecm/ReviewEdit";

import QaTest from "./qa/QaTest";
import QaTestNew from "./qa/QaTestNew";
import QaDefectNew from "./qa/QaDefectNew";
import QaResulteNew from "./qa/QaResulteNew";

import FinancialManagement from "./fm/FinancialManagement"
import BudgetManagement from "./fm/BudgetManagement"
import BudgetForm from "./fm/BudgetForm"
import TransactionManagement from "./fm/TransactionManagement"
import TransactionForm from "./fm/TransactionForm"

import EmployeeList from './hrm/employee/EmployeeList';
import EmployeeForm from './hrm/employee/EmployeeForm';
import Attendance from './hrm/attendance/Attendance';
import EmployeeDetail from './hrm/employee/EmployeeDetail';
import HRMDashboard from './hrm/HRMDashboard';
import LeaveList from './hrm/leave/LeaveList';
import LeaveForm from './hrm/leave/LeaveForm';

function Main() {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const is_admin = empl?.is_admin == 1;

    const [projects, setProjects] = useState([]);
    const [projectMember, setProjectMember] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [schedules, setSchedule] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/member")
            .then(res => res.json())
            .then(data => setProjectMember(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/taskList")
            .then(res => res.json())
            .then(data => setTaskList(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/schedule")
            .then(res => res.json())
            .then(data => setSchedule(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/customerlist")
            .then(res => res.json())
            .then(data => setCustomerList(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/inquiries")
            .then(res => res.json())
            .then(data => setInquiries(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/project-requests")
            .then(res => res.json())
            .then(data => setRequests(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/orders")
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.log(err));
    }, [empid]);

    return (
        <div>
            <Header />
            <div className="body-layout">
                <Aside />
                <section>
                    <Routes>
                        {is_admin && (
                            <>
                                <Route path="projects/projectNew" element={<ProjectNew bool={true} requests={requests} />} />
                                <Route path="projects/projectNew/:projectId" element={<ProjectNew bool={false} requests={requests} />} />
                                <Route path="projects/TaskNew" element={<TaskNew bool={true} projects={projects} />} />
                                <Route path="projects/TaskNew/:taskId" element={<TaskNew bool={false} projects={projects} />} />

                                <Route path="customers/editrequest" element={<ProjectRequestEdit bool={true} />} />
                                <Route path="customers/editrequest/:reqid" element={<ProjectRequestEdit bool={false} />} />

                                <Route path="ecommerce/ordersEdit/:id" element={<OrdersEdit />} />
                                <Route path="ecommerce/layout/*" element={<Layout />} />

                                <Route path="qa/testNew" element={<QaTestNew bool={true} />} />
                                <Route path="qa/resultNew" element={<QaResulteNew bool={true} />} />
                                <Route path="qa/defectNew" element={<QaDefectNew bool={true} />} />
                                <Route path="qa/editTest/:id" element={<QaTestNew bool={false} />} />
                                <Route path="qa/editResult/:id" element={<QaResulteNew bool={false} />} />
                                <Route path="qa/editDefect/:id" element={<QaDefectNew bool={false} />} />

                                <Route path="finance/budgetNew" element={<BudgetForm key="new" />} />
                                <Route path="finance/budgets/:budget_id/edit" element={<BudgetForm key="edit" />} />
                                <Route path="finance/transactions/new/:type" element={<TransactionForm key="new" />} />
                                <Route path="finance/transactions/:transaction_id/edit" element={<TransactionForm key="edit" />} />
                            
                                <Route path="hrm/leave" element={<LeaveList />} />
                                <Route path="hrm/attendance" element={<Attendance />} />
                            </>
                        )}
                        <Route index element={<Home isAdmin={is_admin} empid={empid} projects={projects} projectMember={projectMember} tasks={tasks} inquiries={inquiries} schedules={schedules} />} />

                        <Route path="projects/projectMain" element={<ProjectManagement projects={projects} projectMember={projectMember} />} />
                        <Route path="projects/projectTask" element={<ProjectTask projects={projects} projectMember={projectMember} tasks={tasks} />} />
                        <Route path="projects/projectMy" element={<ProjectMy
                            myProject={projects.filter(p => projectMember.some(m => m.employee_id == empid && m.project_id === p.project_id))}
                            myTask={tasks.filter(t => t.task_manager == empid)}
                            tasks={tasks} taskList={taskList} />} />

                        <Route path="schedules/scheduleMain" element={<ScheduleManagement projects={projects} tasks={tasks} schedules={schedules} requests={requests} />} />
                        <Route path="schedules/scheduleNew" element={<ScheduleNew empid={empid} bool={true} />} />
                        <Route path="schedules/scheduleNew/:schid" element={<ScheduleNew empid={empid} bool={false} />} />
                        <Route path="schedules/scheduleProject" element={<ScheduleProject projects={projects} tasks={tasks} />} />
                        <Route path="schedules/scheduleMy" element={<ScheduleMy
                            projects={projects.filter(p => projectMember.some(m => m.employee_id == empid && m.project_id === p.project_id))}
                            tasks={tasks.filter(t => t.task_manager == empid)}
                            schedules={schedules.filter(s => s.employee_id == empid)} />} />

                        <Route path="customers/customerInfo" element={<CustomerInfo customerList={customerList} inquiries={inquiries} requests={requests} />} />
                        <Route path="customers/customerNew" element={<CustForm />} />
                        <Route path="customers/Inquiry" element={<Inquiry inquiries={inquiries} is_admin={is_admin} />} />
                        <Route path="customers/editInquiry" element={<InquiryForm bool={true} />} />
                        <Route path="customers/editInquiry/:inquiry_id" element={<InquiryForm bool={false} />} />
                        <Route path="customers/request" element={<ProjectRequest requests={requests} is_admin={is_admin} />} />

                        <Route path="ecommerce/ecommerce" element={<EcommerceManagement orders={orders} products={products} />} />
                        <Route path="ecommerce/product" element={<Product products={products} />} />
                        <Route path="ecommerce/productNew" element={<ProductNew bool={true} />} />
                        <Route path="ecommerce/productNew/:prodid" element={<ProductNew bool={false} />} />
                        <Route path="ecommerce/orders" element={<Orders orders={orders} />} />
                        <Route path="ecommerce/reviews" element={<Reviews products={products}/>} />
                        <Route path="ecommerce/reviewsEdit" element={<ReviewEdit/>} />

                        <Route path="community/postList" element={<PostList />} />
                        <Route path="community/myPosts" element={<MyPosts empid={empid} />} />
                        <Route path="community/postDetail/:id" element={<PostDetail />} />
                        <Route path="community/postWrite" element={<PostWrite bool={true} />} />
                        <Route path="community/edit/:id" element={<PostWrite bool={false} />} />

                        <Route path="qa/test" element={<QaTest />} />

                        <Route path="finance/financialManagement" element={<FinancialManagement />} />
                        <Route path="finance/BudgetManagement" element={<BudgetManagement is_admin={is_admin} />} />
                        <Route path="finance/TransactionManagement" element={<TransactionManagement is_admin={is_admin} />} />

                        <Route path="hrm/hrmdashboard" element={<HRMDashboard />} />
                        <Route path="hrm/employees" element={<EmployeeList />} />
                        <Route path="hrm/employeesform/:id" element={<EmployeeForm />} />
                        <Route path="hrm/employeesdetail/:id" element={<EmployeeDetail />} />
                        <Route path="hrm/leaveform" element={<LeaveForm />} />
                    </Routes>
                </section>
            </div>
        </div>
    );
}

export default Main;