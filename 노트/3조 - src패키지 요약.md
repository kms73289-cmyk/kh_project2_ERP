#### 3조 - src패키지 요약

편집날짜 11.10

**1.패키지 구조**

src/ 구조

|패키지|담당 영역|주요 역할|
|-|-|-|
|login/|인증|로그인, 회원가입|
|main/|ERP 공통|메인 레이아웃, 사이드바, 라우팅, 공통 데이터 관리|



main/ 구조

|prjt/|프로젝트 관리|로젝트·업무 조회, 생성, 수정, 삭제, 개인 업무|
|-|-|-|
|sch/|프로젝트 관리|프로젝트·업무 일정, 차트, 개인 일정|
|crm/|고객관계 관리|고객 정보, 문의, 프로젝트 의뢰|
|ecm/|이커머스|상품·주문·문의·리뷰·쇼핑몰 레이아웃|
|cmnt/|커뮤니티|게시글·댓글 CRUD, 내 게시글|
|fm/|재무관리||
|qa/|품질관리||
|dependence/|공통 컴포넌트|프로젝트·CRM 등에서 사용하는 재사용 UI|



ecm/ 하위 구조

|/preview|쇼핑몰 화면|판매 메인화면, 상세 페이지|
|-|-|-|



**2.파일 내용**

프로젝트 관리

ProjectManagement.js	전체 프로젝트 조회, 상태·검색 필터, 프로젝트 상세 정보, 삭제

ProjectMy.js			내 프로젝트·업무 조회, 체크리스트 체크·저장, 업무 진행률 표시

ProjectNew.js		프로젝트 신규 등록 및 기존 프로젝트 수정, 관리자·참여자 지정

ProjectTask.js		프로젝트 업무 목록 조회, 업무 상세 정보, 삭제

TaskNew.js			업무 신규 등록 및 수정, 담당자·우선순위·기간 설정



일정 관리

ScheduleManagement.js  전체 일정 달력, 프로젝트·업무·요청·기타 일정 조회, 일간 일정 표시

ScheduleProject.js     연간 프로젝트 차트, 주간 업무 차트, 프로젝트 선택·기간 조회

ScheduleMy.js          내 일정 관리, 주간 업무 차트·월간 달력·일간 일정 조회

SchduleNew.js          개인 일정 등록 및 수정, 나만보기 설정

calendar.css           월간 달력, 일간 일정 및 일정 관리 페이지 레이아웃 스타일

chart.css              연간 프로젝트·주간 업무 차트 스타일



고객관계 관리

CustomerInfo.js		고객 목록, 고객별 상세 정보, 문의·의뢰 이력 조회

CustForm.js			신규 고객 정보 등록

Inquiry.js			고객 문의 목록, 문의 상세·이력 조회

InquiryForm.js		고객 문의 등록 및 수정, 고객·담당 직원 선택

ProjectRequest.js		프로젝트 의뢰 목록, 상세 조회, 삭제

ProjectRequestEdit.js	프로젝트 의뢰 등록 및 수정, 고객 선택



이커머스

EcommerceManagement.js  전체 상품·주문 현황, 카테고리별 상품 및 최근 주문 조회

Product.js              상품 목록, 카테고리별 필터, 상품 상세 조회·삭제

ProductNew.js           상품 등록 및 수정, 상품 이미지 업로드

Orders.js               주문 목록, 주문 검색·상태 필터, 주문 상세 조회·삭제

OrdersEdit.js           주문 상태 변경

Reviews.js              리뷰 목록, 리뷰 통계, 미응답 필터, 상품별 리뷰 조회

ReviewEdit.js           리뷰 관리자 답변 등록

Layout.js               홈페이지 레이아웃 관리, 이미지·문구 수정, 항목 표시 설정 및 미리보기

ecm.css                 이커머스 관리 페이지 레이아웃 및 스타일

/preview

Estore.js               쇼핑몰 메인 화면, 배너·카테고리·상품·리뷰·문의 영역 출력

EstoreDetail.js         상품 상세 페이지, 상품 정보·가격·이미지 출력

HeadFoot.js             쇼핑몰 공통 헤더·푸터, 로고·메뉴·하단 정보 출력

Estore.css              쇼핑몰 홈페이지 및 상품 상세 페이지 스타일



커뮤니티

PostList.js		전체 게시글 목록, 게시글 검색·필터

MyPosts.js		로그인 직원이 작성한 게시글 조회

PostDetail.js		게시글 상세 조회, 댓글 컴포넌트 연결

PostWrite.js		게시글 작성 및 수정

Comment.js		댓글 조회, 작성, 수정, 삭제



재무관리

FinancialManagement.js    	월별 재무 현황, 수입·지출·예산 통계, 예산 사용률 및 항목별 상세 조회

BudgetManagement.js       	월별 예산 목록, 예산 사용·잔액 조회, 예산 상세·삭제

BudgetForm.js             		예산 등록 및 수정, 예산 항목·금액·적용 월 설정

TransactionManagement.js  	월별 수입·지출 목록, 거래 검색, 거래 상세 조회·삭제

TransactionForm.js        		수입·지출 등록 및 수정, 프로젝트·예산 항목 연결



품질관리

QaTest.js			전체 품질 관리 현황 조회

QaResulte.js			테스트 결과 컴포넌트

QaDefect.js			결함 관리 컴포넌트

QaTestNew.js		테스트 생성 및 수정

QaResulteNew.js		테스트 결과 생성 및 수정

QaDefectNew.js		결함 관리 생성 및 수정



공통 컴포넌트

ProjectCpnt.js

crmCpnt.js

schCpnt.js

Cpnt.js



**3.아직 반영되지 않은 사항**

\-css, 인적 자원 관리



**4.보고서 링크**

3조 : https://drive.google.com/drive/folders/1Wt30oaykDY-1CL4TxHr-8GfXiBmabbQ9?usp=sharing

