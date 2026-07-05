**PROMPT 1 — PROJECT ANALYSIS \& ARCHITECTURE MIGRATION**





You are a Principal Software Architect.



Analyze my entire existing MicroLend project before making any changes.



Current Stack



Backend

\- Java 17

\- Spring Boot

\- Spring Security

\- MySQL

\- Maven



Frontend

\- React

\- Axios

\- React Router



Current architecture is Monolithic.



Your first task is ONLY analysis and planning.



Do NOT modify business logic yet.



Perform the following.



1\. Analyze complete project structure.



2\. Identify every module.



3\. Identify entities.



4\. Identify controllers.



5\. Identify services.



6\. Identify repositories.



7\. Identify DTOs.



8\. Identify Security Configuration.



9\. Identify JWT flow.



10\. Identify authentication flow.



11\. Identify database relationships.



12\. Identify frontend API calls.



13\. Create a migration strategy to Enterprise Microservices.



Microservices should be



Authentication Service



User Service



Borrower Service



Group Service



Loan Service



EMI Service



Notification Service



Report Service



Gateway



Eureka Server



Config Server



Explain every file that needs to move.



Explain every dependency.



Explain package restructuring.



Explain database impact.



Do not generate code yet.



Wait for my confirmation before modifying anything.









\--------------------------------------------------------------------





**PROMPT 2 — CONVERT MONOLITH TO MICROSERVICES**





Now convert my existing monolithic project into Enterprise Microservices.



Requirements



Use Java 17



Spring Boot 3



Spring Cloud



Spring Cloud Gateway



Netflix Eureka



Spring Config Server



Each service must be an independent Maven project.



Services



Gateway



Eureka



Config Server



Authentication



User



Borrower



Group



Loan



EMI



Notification



Report



Move all existing business logic into the correct services.



Do NOT duplicate code.



Move common DTOs into shared modules if required.



Configure



application.yml



service registration



service discovery



load balancing



inter-service communication



OpenFeign



Ensure every service successfully registers with Eureka.



Ensure Gateway routes every API correctly.



Keep existing functionality working.



Update frontend API URLs accordingly.



Do not skip any configuration.



After completion verify that all services start successfully.







\---------------------------------------------------------------







**PROMPT 3 — REDESIGN AUTHENTICATION (OTP LOGIN)**







Completely redesign authentication.



Current system generates JWT during registration.



Remove this completely.



New Flow



Registration



User enters details



Validate



Save user



Return Registration Successful



No JWT



No Login



No Token



Login Flow



Step 1



Username



Password



↓



Validate Credentials



↓



Generate OTP



↓



Store OTP in Redis



↓



Send OTP



↓



Verify OTP



↓



Generate JWT



↓



Return Access Token



OTP Requirements



6 digits



5 minute expiry



Single use



Maximum 5 attempts



Resend after 60 seconds



Store in Redis



Fallback to MySQL if Redis unavailable.



Use BCrypt password encoding.



Generate JWT only after OTP verification.



Add Refresh Token support.



Access Token expiry



30 minutes



Refresh Token



7 days



Update frontend.



React Login should become



Login Screen



↓



OTP Screen



↓



Dashboard



Implement proper error handling.



Update backend and frontend completely.











\-------------------------------------------------------------------------

You are a Principal Security Architect, Senior Spring Boot Engineer, and Enterprise Banking Authentication Specialist.

Redesign the complete authentication module of the existing MicroLend application.

The project is now a Spring Boot Enterprise Microservices application.

DO NOT MODIFY ANY BUSINESS LOGIC OUTSIDE AUTHENTICATION.

Implement a secure enterprise-grade authentication flow suitable for banking and financial applications.

====================================================
AUTHENTICATION OBJECTIVES
====================================================

The current implementation generates JWT during registration.

Remove this behavior completely.

JWT must NEVER be generated during registration.

JWT must ONLY be generated after successful Login + OTP Verification.

====================================================
REGISTRATION FLOW
====================================================

Registration should perform only the following.

• Validate request
• Validate unique username/email/mobile
• Encrypt password using BCrypt
• Save user
• Assign default role
• Return Registration Successful

Registration must NOT

Generate JWT

Create Session

Auto Login

Generate OTP

====================================================
LOGIN FLOW
====================================================

Implement the following authentication flow.

Username / Email / Mobile

↓

Password

↓

Validate credentials

↓

Generate Secure Random 6-digit OTP

↓

Hash OTP using BCrypt

↓

Store ONLY the hashed OTP in MySQL

↓

Send original OTP through Email and/or SMS

↓

User enters OTP

↓

Compare entered OTP with BCrypt hash

↓

If valid

Generate JWT Access Token

Generate Refresh Token

Record Login History

Return Login Success

====================================================
OTP STORAGE
====================================================

Do NOT use Redis.

Use MySQL.

Create an enterprise OTP table.

Suggested columns

id

user_id

purpose

otp_hash

created_at

expires_at

attempt_count

max_attempts

status

last_sent_at

verified_at

created_ip

device_information

browser_information

os_information

====================================================
OTP SECURITY
====================================================

Never store OTP in plain text.

Always hash using BCrypt.

OTP Length

6 digits

Expiry

5 minutes

Maximum verification attempts

5

Maximum resend frequency

1 request every 60 seconds

Only one active OTP per user.

Generating a new OTP automatically invalidates previous OTPs.

OTP becomes invalid after successful verification.

Instead of deleting immediately

Update status to VERIFIED.

Expired and verified OTPs should later be removed by scheduler.

====================================================
OTP VERIFICATION
====================================================

If

OTP expired

Return proper error.

If

OTP attempts exceed 5

Mark OTP as BLOCKED.

Require new OTP generation.

If

OTP already verified

Reject verification.

If

OTP hash comparison succeeds

Generate JWT

Generate Refresh Token

Update Login History

Update Last Login

Update OTP status

Return authentication response.

====================================================
OTP CLEANUP
====================================================

Create a scheduled task.

Run every hour.

Automatically delete

Expired OTPs

Verified OTPs older than configurable retention period

Blocked OTPs older than configurable retention period

Log cleanup summary.

====================================================
RATE LIMITING
====================================================

Prevent OTP abuse.

Rules

Maximum one OTP every 60 seconds.

Maximum configurable OTP requests per hour.

Maximum configurable OTP requests per day.

Lock temporarily if limits exceeded.

Return meaningful error messages.

====================================================
LOGIN HISTORY
====================================================

Record

Login Time

Logout Time

IP Address

Browser

Operating System

Device

Location (if available)

Authentication Method

OTP Verification Status

====================================================
JWT
====================================================

Generate JWT ONLY after successful OTP verification.

Access Token

30 minutes

Refresh Token

7 days

Implement Refresh Token rotation.

Support Logout.

Blacklist invalid tokens if logout strategy requires it.

====================================================
SECURITY
====================================================

Use BCrypt

Role Based Security

Spring Security

JWT Authentication Filter

Global Exception Handling

Audit Logging

Password Encryption

Secure Random OTP Generation

Mask sensitive information in logs.

Never log

Passwords

OTP

JWT

Refresh Tokens

====================================================
FRONTEND
====================================================

Update React frontend.

Registration Page

No auto-login

Redirect to Login

Login Page

Username

Password

↓

OTP Verification Page

↓

Dashboard

Implement

OTP Countdown

Resend Timer (60 seconds)

Attempt Counter

Proper Validation

Loading Indicators

Toast Notifications

Secure Token Storage

Axios Interceptors

Refresh Token Handling

====================================================
DATABASE
====================================================

Create OTP entity

Repository

Service

DTOs

Validation

Migration

Indexes

Foreign Keys

Startup Validation

====================================================
TESTING
====================================================

Create

Unit Tests

Integration Tests

Security Tests

OTP Expiry Tests

Attempt Limit Tests

Rate Limit Tests

Scheduler Tests

====================================================
VALIDATION
====================================================

Verify

Registration does not generate JWT.

Login requires password.

OTP is generated.

Only hashed OTP is stored.

OTP expires after 5 minutes.

Maximum 5 attempts enforced.

60-second resend enforced.

Only one active OTP per user.

JWT generated only after OTP verification.

Frontend works correctly.

All APIs compile successfully.

No business logic outside authentication is modified.



-------------------------------------------------------------------------









**PROMPT 4 — REMOVE REGISTRATION TOKEN**









Modify registration flow.



Current behavior



Register



↓



Generate JWT



↓



Login



This is incorrect.



New behavior



Register



↓



Save User



↓



Return



Registration Successful



No Token



No Login



No Session



Only Login endpoint can generate JWT.



Remove every occurrence of token generation from registration.



Update frontend.



After registration redirect user to Login page.



Verify no existing code still generates JWT during registration.











\-----------------------------------------------------------------------









**PROMPT 5 — GROUP \& BORROWER RELATIONSHIP**







Analyze the current Borrower and Group modules.



Verify database relationships.



Every Borrower must belong to exactly one Group.



No Borrower should exist without a Group.



Prevent deletion of Groups if Borrowers exist.



Loan Applications should automatically fetch Group information.



Validate foreign keys.



Update entities.



Update repositories.



Update DTOs.



Update APIs.



Update frontend forms.



Borrower creation screen should allow selecting Group.



Borrower details should display Group.



Loan page should automatically show Group.



Fix every incorrect mapping.



Maintain referential integrity.







\-------------------------------------------------------------------------------











**PROMPT 6 — ENTERPRISE LOAN FORM**







**Redesign Loan Application.**



**Create Enterprise Loan Form.**



**Sections**



**Borrower**



**Group**



**Loan Product**



**Loan Amount**



**Interest Rate**



**Tenure**



**Purpose**



**Employment**



**Income**



**Collateral**



**Guarantor**



**Attachments**



**Eligibility**



**Repayment**



**Approval Workflow**



**Auto Calculate**



**Monthly EMI**



**Interest**



**Outstanding**



**Validation**



**Every field must have proper validation.**



**Update backend DTOs.**



**Update entities.**



**Update frontend.**



**Responsive design.**



**Material UI.**



**Professional banking interface.**



**No placeholder code.**











\--------------------------------------------------------------------------------













**PROMPT 7 — AUTOMATIC NOTIFICATION ENGINE**











Remove manual notification creation completely.



Create Notification Microservice.



Notifications should be event driven.



Automatic notifications



Registration Success



Loan Approval



Loan Rejection



Loan Disbursement



EMI Due Tomorrow



EMI Due Today



EMI Overdue



Penalty Added



Payment Success



Loan Closed



OTP Generated



Password Changed



New Login



Monthly Statement



Yearly Statement



Use Spring Scheduler.



No manual notification API.



Notifications should automatically trigger.



Support



Email



SMS



In App Notifications



Create Notification History.



Unread Count.



Notification Bell.



Frontend Notification Center.



Everything automatic.





















\------------------------------------------------------------------------













**PROMPT 8 — EMI MANAGEMENT**







Create Enterprise EMI Module.



Features



EMI Schedule



EMI Collection



Payment History



Penalty Calculation



Overdue Tracking



Auto Reminder



Outstanding Amount



Interest Calculation



Loan Closure



Reports



Generate EMI schedule automatically after loan approval.



Create backend APIs.



Update frontend dashboard.



Professional banking interface.



Responsive UI.



Proper validations.



Update database.



Generate reports.











\-------------------------------------------------------------------------











**PROMPT 9 — FRONTEND REFACTOR**









Update React frontend completely.



Reflect every backend change.



Authentication



OTP Screen



JWT Storage



Refresh Token



Protected Routes



Axios Interceptor



Notification Bell



Unread Notifications



Borrower Module



Group Module



Loan Module



EMI Module



Reports



Dashboard



Responsive Layout



Loading Screen



Error Boundary



Validation



Material UI



Modern banking UI.



Remove every broken API call.



Ensure frontend works with Gateway.



No hardcoded URLs.











\--------------------------------------------------------







**PROMPT 10 — REPORTS \& DASHBOARD**









Create Enterprise Dashboard.



Admin Dashboard



Branch Manager Dashboard



Field Officer Dashboard



Borrower Dashboard



Charts



Loan Status



Collection Rate



Overdue Loans



EMI Collection



Defaulters



Reports



Excel Export



PDF Export



Monthly Reports



Annual Reports



Use modern dashboard design.



Update backend APIs.



Update frontend.



Role based dashboards.









\-------------------------------------------------------------------











**PROMPT 11 — SECURITY HARDENING**









Upgrade security.



Implement



JWT Filter



Refresh Token



Role Based Access



Audit Logs



Login History



Failed Login Counter



Account Lock



Device Tracking



Session Expiry



Logout



Blacklist JWT



Global Exception Handler



Validation



Swagger



OpenAPI



Secure every endpoint.



Remove security vulnerabilities.



Follow enterprise banking standards.



\--------------------------------------------------------------------------









**PROMPT 12 — PRODUCTION READY**







Make the project production ready.



Create



Dockerfile



Docker Compose



Run



Gateway



Eureka



Config Server



Authentication



User



Borrower



Group



Loan



EMI



Notification



Report



MySQL



Redis



Configure logging.



Health Checks



Spring Boot Actuator



Prometheus



Grafana



Swagger



JUnit



Mockito



Integration Tests



Ensure project builds successfully.



Ensure frontend builds successfully.



Verify every API.



Verify Gateway.



Verify Eureka.



Verify authentication.



Verify notifications.



Verify reports.



Remove unused code.



Optimize performance.



Refactor code wherever necessary.



Final deliverable should be a production-ready Enterprise Microfinance Loan Management System suitable for demonstration in a Cognizant technical interview, following clean architecture, SOLID principles, enterprise coding standards, and industry best practices.





\------------------------------------------------------------------------------------------









**PROMPT 13 — ENTERPRISE DOCUMENTATION GENERATOR (.md FILES)**









You are a Principal Software Architect, Enterprise Solution Architect, and Technical Documentation Engineer.



The entire MicroLend project has now been successfully migrated from a Monolithic architecture into an Enterprise Spring Boot Microservices Architecture.



DO NOT MODIFY ANY BUSINESS LOGIC.



DO NOT REFACTOR ANY CODE.



DO NOT CHANGE ANY FILE.



DO NOT CREATE NEW FEATURES.



Your ONLY responsibility is generating enterprise-level documentation in Markdown (.md) format.



The documentation must be detailed enough that a new software engineer can understand, run, maintain, extend, and deploy the complete application without additional explanation.



==========================================================

GLOBAL REQUIREMENTS

==========================================================



Generate documentation for EVERY microservice separately.



Each microservice must contain its own README.md file inside its root folder.



Additionally generate one master documentation file inside the project root.



Project Root



README.md



Every Service



README.md



No documentation should be duplicated unnecessarily.



The root README should act as the main documentation.



Each service README should contain only service-specific documentation.



==========================================================

ROOT DOCUMENTATION

==========================================================



Create



README.md



inside the project root.



This document should contain all enterprise documentation.



Include the following sections.



\# Project Overview



Explain



Business Problem



Solution



Architecture



Technology Stack



Microservices



Deployment



Security



Authentication



Loan Workflow



Borrower Workflow



EMI Workflow



Notification Workflow



Reporting Workflow



\# Project Architecture



Include a detailed architecture explanation.



Explain



Gateway



Eureka



Config Server



Authentication



Loan



Borrower



Group



EMI



Notification



Reports



User



How every service communicates.



Explain OpenFeign usage.



Explain Gateway routing.



Explain Eureka registration.



Explain service discovery.



\# Folder Structure



Display the complete project folder structure.



Explain every folder.



Explain every package.



Controllers



Services



Repositories



Entities



DTOs



Configurations



Exceptions



Security



Utilities



Schedulers



Feign Clients



Configurations



Resources



Tests



\# Database Design



Explain every table.



Explain every relationship.



Explain foreign keys.



Explain indexes.



Explain normalization.



Explain constraints.



Explain cascade rules.



\# Authentication Flow



Explain



Registration



Login



OTP



JWT



Refresh Token



Logout



Session



Security Filters



Authorization



Role Based Access



Complete sequence diagram explanation in markdown.



\# Loan Lifecycle



Explain



Create Loan



Approval



Disbursement



EMI Creation



Payment



Closure



Reports



Notifications



Complete workflow.



\# Borrower Lifecycle



Explain



Registration



Group Assignment



Loan Application



Repayment



History



Reports



\# Notification Engine



Explain



Automatic Scheduler



Daily Jobs



Monthly Jobs



Event Driven Notifications



Email



SMS



In App



Notification History



Retry Mechanism



\# API Documentation



List every REST API.



Include



Method



Endpoint



Purpose



Request



Response



Authentication Required



Role Required



Status Codes



\# Frontend Documentation



Explain



Pages



Components



Hooks



Context



Routing



Axios



Protected Routes



Authentication



State Management



Folder Structure



\# Configuration



Explain every



application.yml



environment variable



JWT



Redis



MySQL



Gateway



Eureka



Feign



Mail



SMS



\# Security



Explain



Spring Security



JWT



OTP



BCrypt



Role Based Access



CORS



CSRF



Rate Limiting



Refresh Tokens



\# Logging



Explain



Logging



Audit Logs



Error Handling



Global Exception Handling



Correlation IDs



\# Deployment



Explain



Docker



Docker Compose



Run Commands



Build Commands



Service Startup Order



Health Checks



\# Testing



Explain



JUnit



Mockito



Integration Tests



Manual Testing



Postman



\# Future Enhancements



Explain enterprise improvements.



==========================================================

SERVICE DOCUMENTATION

==========================================================



Generate one README.md file inside EVERY service.



Authentication Service



README.md



User Service



README.md



Borrower Service



README.md



Group Service



README.md



Loan Service



README.md



EMI Service



README.md



Notification Service



README.md



Report Service



README.md



Gateway



README.md



Eureka Server



README.md



Config Server



README.md



==========================================================

SERVICE README CONTENT

==========================================================



Each service README must contain



\# Service Overview



Business Purpose



Responsibilities



Dependencies



Technologies Used



Folder Structure



Controllers



Services



Repositories



Entities



DTOs



Configurations



Security



Database Tables Used



Feign Clients



API Endpoints



Validation Rules



Business Logic



Workflow



Error Handling



Logging



Testing



Deployment



Configuration



Environment Variables



Known Limitations



Future Improvements



==========================================================

API DOCUMENTATION

==========================================================



Generate a markdown table for every endpoint.



Columns



Method



Endpoint



Authentication



Role



Description



Input



Output



Status Codes



==========================================================

DATABASE DOCUMENTATION

==========================================================



Generate ERD explanation.



Explain



Relationships



Primary Keys



Foreign Keys



Constraints



Indexes



Entity Relationships



==========================================================

SEQUENCE DIAGRAMS

==========================================================



Generate Mermaid sequence diagrams for



Registration



Login with OTP



Loan Approval



Loan Disbursement



EMI Payment



Notification Flow



Borrower Creation



Group Creation



==========================================================

FLOWCHARTS

==========================================================



Generate Mermaid flowcharts for



Authentication



Loan Lifecycle



Borrower Lifecycle



Notification Scheduler



Microservice Communication



==========================================================

DEPENDENCY DOCUMENTATION

==========================================================



Document



Spring Boot



Spring Cloud



Gateway



Eureka



OpenFeign



JWT



Redis



MySQL



React



Axios



Docker



==========================================================

CODE QUALITY

==========================================================



Document



SOLID Principles



Clean Architecture



Layered Architecture



Naming Conventions



Coding Standards



Exception Strategy



Validation Strategy



==========================================================

PROJECT SETUP GUIDE

==========================================================



Explain



Prerequisites



Java Installation



MySQL



Redis



Node



Maven



Environment Variables



Database Creation



Running Backend



Running Frontend



Running Docker



Production Deployment



==========================================================

FINAL REQUIREMENTS

==========================================================



Generate only markdown (.md) files.



Place every README.md in the correct service folder.



Place the master README.md in the project root.



Do not overwrite source code.



Do not change Java code.



Do not change React code.



Do not modify configuration files.



Generate documentation based entirely on the final project implementation.



Documentation must be enterprise-grade, professional, and suitable for onboarding new developers, technical interviews, project handovers, and production maintenance.









**------------------------------------------------------------------------------------------**













**PROMPT 14 — GENERATE COMPLETE SETUP \& RUN GUIDE (RUNNING\_GUIDE.md)**











You are a Senior DevOps Engineer, Enterprise Software Architect, and Technical Documentation Engineer.



DO NOT MODIFY ANY SOURCE CODE.



DO NOT MODIFY ANY CONFIGURATION FILES.



DO NOT REFACTOR ANYTHING.



Your ONLY responsibility is to generate a comprehensive markdown documentation file named



RUNNING\_GUIDE.md



inside the project root.



This document should enable a completely new developer to clone the project and successfully run both the backend and frontend without any additional guidance.



The documentation should be detailed, beginner-friendly, and enterprise-grade.



===========================================================

DOCUMENT TITLE

===========================================================



\# MicroLend Enterprise Application

\## Complete Installation, Configuration \& Execution Guide



===========================================================

SECTION 1 - PROJECT OVERVIEW

===========================================================



Explain



• What the project is



• Business purpose



• Technology stack



• Backend technologies



• Frontend technologies



• Database



• Microservices



• Authentication



• Notification Engine



===========================================================

SECTION 2 - SYSTEM REQUIREMENTS

===========================================================



List all required software.



Include



Java JDK



Recommended Version



Download Link



Installation Steps



Environment Variable Configuration



Verify Installation Command



Example



java -version



\-----------------------------------------------------------



Maven



Version



Installation



Environment Variables



Verify Command



mvn -version



\-----------------------------------------------------------



Node.js



Recommended Version



Installation



Environment Variables



Verify



node -v



npm -v



\-----------------------------------------------------------



Git



Installation



Verify



git --version



\-----------------------------------------------------------



MySQL



Version



Installation



Workbench



Create Database



Verify



\-----------------------------------------------------------



Redis



Installation



Start Redis



Verify Redis



redis-cli ping



\-----------------------------------------------------------



Docker Desktop



Installation



Verify



docker --version



docker compose version



\-----------------------------------------------------------



IntelliJ IDEA



Installation



Required Plugins



Java



Spring



Maven



Lombok



\-----------------------------------------------------------



VS Code



Extensions



React



ESLint



Prettier



JavaScript



===========================================================

SECTION 3 - PROJECT CLONING

===========================================================



Explain



Clone Repository



Git Commands



Folder Structure



===========================================================

SECTION 4 - DATABASE SETUP

===========================================================



Explain



Install MySQL



Create Database



Create User



Grant Permissions



Import Schema (if required)



Auto Create Tables



Hibernate Configuration



Example SQL Commands



SHOW DATABASES;



CREATE DATABASE microlend;



USE microlend;



SHOW TABLES;



===========================================================

SECTION 5 - REDIS SETUP

===========================================================



Explain



Install Redis



Start Redis



Verify Redis



Configure Redis Port



Redis Configuration



===========================================================

SECTION 6 - CONFIG SERVER

===========================================================



Explain



Configuration Repository



application.yml



Environment Variables



Config Server Startup



Verification



===========================================================

SECTION 7 - STARTING MICROSERVICES

===========================================================



Explain startup order.



VERY IMPORTANT



Use this order.



1



Config Server



2



Eureka Server



3



API Gateway



4



Authentication Service



5



User Service



6



Borrower Service



7



Group Service



8



Loan Service



9



EMI Service



10



Notification Service



11



Report Service



For every service explain



Folder



Command



Expected Output



Common Errors



How to Verify



Health Endpoint



===========================================================

SECTION 8 - FRONTEND SETUP

===========================================================



Explain



Navigate to frontend



Install dependencies



npm install



Run



npm run dev



Production



npm run build



Folder Structure



Environment Variables



Axios Configuration



API Base URL



===========================================================

SECTION 9 - ENVIRONMENT VARIABLES

===========================================================



Explain every environment variable.



Backend



DATABASE\_URL



DATABASE\_USERNAME



DATABASE\_PASSWORD



JWT\_SECRET



JWT\_EXPIRY



REDIS\_HOST



REDIS\_PORT



MAIL\_USERNAME



MAIL\_PASSWORD



TWILIO\_ACCOUNT\_SID



TWILIO\_AUTH\_TOKEN



TWILIO\_PHONE\_NUMBER



SERVER\_PORT



EUREKA\_URL



CONFIG\_SERVER\_URL



GATEWAY\_URL



Frontend



VITE\_API\_BASE\_URL



VITE\_GATEWAY\_URL



VITE\_APP\_NAME



===========================================================

SECTION 10 - RUNNING WITHOUT DOCKER

===========================================================



Explain



How to run manually



Exact commands



Verification



===========================================================

SECTION 11 - RUNNING USING DOCKER

===========================================================



Explain



Docker Build



Docker Compose



Starting Containers



Stopping Containers



Restart Containers



Logs



Useful Docker Commands



===========================================================

SECTION 12 - VERIFY APPLICATION

===========================================================



Explain



Verify Eureka



Verify Gateway



Verify Authentication



Verify Frontend



Verify Database



Verify Redis



Verify Notifications



Verify APIs



===========================================================

SECTION 13 - DEFAULT USERS

===========================================================



If the project contains seed data,



document



Admin



Manager



Field Officer



Borrower



Credentials



If not,



explain how to create them.



===========================================================

SECTION 14 - PROJECT DIRECTORY

===========================================================



Generate a complete directory tree.



Explain every folder.



===========================================================

SECTION 15 - API TESTING

===========================================================



Explain



Swagger URL



Health URLs



Login API



OTP API



Borrower APIs



Loan APIs



Group APIs



EMI APIs



Notification APIs



===========================================================

SECTION 16 - COMMON COMMANDS

===========================================================



Create a quick reference table.



Examples



mvn clean install



mvn spring-boot:run



npm install



npm run dev



docker compose up



docker compose down



redis-cli



mysql



git pull



git status



===========================================================

SECTION 17 - COMMON ERRORS

===========================================================



Create a troubleshooting section.



Examples



Java Not Found



Maven Not Found



Redis Connection Failed



Database Connection Failed



Port Already In Use



Gateway Not Starting



Eureka Registration Failed



JWT Errors



OTP Errors



Node Modules Missing



CORS Issues



React Not Loading



Blank Screen



Docker Errors



Provide



Cause



Solution



===========================================================

SECTION 18 - FAQ

===========================================================



Include at least 30 frequently asked questions.



Examples



How do I change the database?



How do I reset passwords?



How do I regenerate JWT secret?



How do I change Redis port?



How do I create a new service?



How do I change frontend API URL?



===========================================================

SECTION 19 - PRODUCTION DEPLOYMENT

===========================================================



Explain



Server Requirements



Reverse Proxy



Nginx



SSL



Docker



Database Backup



Logging



Monitoring



===========================================================

SECTION 20 - APPENDIX

===========================================================



Include



Useful URLs



Official Documentation



Java



Spring Boot



Spring Cloud



React



Docker



Redis



MySQL



Maven



Node.js



===========================================================

FINAL REQUIREMENTS

===========================================================



Generate only one markdown file



RUNNING\_GUIDE.md



Place it in the project root.



Do not modify source code.



Do not modify Java files.



Do not modify React files.



Do not modify Docker files.



The guide should be detailed enough that even a developer with no prior knowledge of the project can successfully install all prerequisites, configure the environment, start every microservice in the correct order, run the frontend, verify the application, troubleshoot common issues, and deploy the application.



**--------------------------------------------------------------------------------------**







**PROMPT 15 — ENTERPRISE DOCUMENTATION SUITE GENERATOR (IDEMPOTENT)**







**You are a Principal Software Architect, Enterprise Documentation Engineer, Technical Writer, DevOps Engineer, and Solution Architect.**



**The MicroLend project has already been completed.**



**DO NOT MODIFY ANY SOURCE CODE.**



**DO NOT MODIFY ANY JAVA FILES.**



**DO NOT MODIFY ANY REACT FILES.**



**DO NOT MODIFY ANY CONFIGURATION FILES.**



**DO NOT MODIFY ANY BUSINESS LOGIC.**



**Your ONLY responsibility is generating and maintaining enterprise-level Markdown documentation.**



**============================================================**

**IMPORTANT EXECUTION RULE**

**============================================================**



**Before creating any documentation file:**



**1. Check whether the file already exists.**



**2. If the file already exists:**

&#x20;  **- DO NOT delete it.**

&#x20;  **- DO NOT overwrite custom content.**

&#x20;  **- Validate whether the documentation is complete.**

&#x20;  **- If important sections are missing, append or improve them while preserving existing content.**

&#x20;  **- If the file is already comprehensive, skip it completely and continue to the next file.**



**3. If the file does not exist:**

&#x20;  **- Create it.**

&#x20;  **- Populate it with complete enterprise-level documentation.**



**Never stop because one file already exists.**



**Always continue until every documentation file has been checked.**



**At the end generate a summary like:**



**✓ Existing files skipped**



**✓ Existing files enhanced**



**✓ Newly created files**



**============================================================**

**ROOT DOCUMENTATION**

**============================================================**



**Check/Create**



**README.md**



**RUNNING\_GUIDE.md**



**LICENSE.md (if applicable)**



**CHANGELOG.md**



**CONTRIBUTING.md**



**CODE\_OF\_CONDUCT.md**



**SECURITY.md**



**VERSIONING.md**



**ROADMAP.md**



**PROJECT\_STRUCTURE.md**



**============================================================**

**DOCS DIRECTORY**

**============================================================**



**If docs/ does not exist**



**Create it.**



**Inside docs/**



**Check/Create**



**INSTALLATION.md**



**LOCAL\_SETUP.md**



**WINDOWS\_SETUP.md**



**LINUX\_SETUP.md**



**MAC\_SETUP.md**



**DOCKER\_SETUP.md**



**DEPLOYMENT.md**



**PRODUCTION\_DEPLOYMENT.md**



**ARCHITECTURE.md**



**MICROSERVICES.md**



**API\_REFERENCE.md**



**DATABASE\_SCHEMA.md**



**ENTITY\_RELATIONSHIPS.md**



**AUTHENTICATION\_FLOW.md**



**OTP\_LOGIN\_FLOW.md**



**JWT\_AUTHENTICATION.md**



**ROLE\_BASED\_ACCESS.md**



**LOAN\_WORKFLOW.md**



**BORROWER\_WORKFLOW.md**



**GROUP\_WORKFLOW.md**



**EMI\_WORKFLOW.md**



**NOTIFICATION\_ENGINE.md**



**SCHEDULER.md**



**EMAIL\_CONFIGURATION.md**



**SMS\_CONFIGURATION.md**



**REDIS\_CONFIGURATION.md**



**GATEWAY\_CONFIGURATION.md**



**CONFIG\_SERVER.md**



**EUREKA\_SERVER.md**



**FRONTEND\_ARCHITECTURE.md**



**BACKEND\_ARCHITECTURE.md**



**FOLDER\_STRUCTURE.md**



**PROJECT\_FLOW.md**



**SEQUENCE\_DIAGRAMS.md**



**FLOWCHARTS.md**



**SYSTEM\_DESIGN.md**



**ERROR\_HANDLING.md**



**GLOBAL\_EXCEPTION\_HANDLER.md**



**LOGGING.md**



**AUDIT\_LOGS.md**



**MONITORING.md**



**HEALTH\_CHECKS.md**



**SWAGGER.md**



**POSTMAN\_TESTING.md**



**TESTING\_GUIDE.md**



**UNIT\_TESTING.md**



**INTEGRATION\_TESTING.md**



**PERFORMANCE.md**



**OPTIMIZATION.md**



**TROUBLESHOOTING.md**



**FAQ.md**



**BEST\_PRACTICES.md**



**CODING\_STANDARDS.md**



**DEPENDENCIES.md**



**ENVIRONMENT\_VARIABLES.md**



**COMMON\_COMMANDS.md**



**BACKUP\_AND\_RESTORE.md**



**DISASTER\_RECOVERY.md**



**RELEASE\_PROCESS.md**



**============================================================**

**MICROSERVICE DOCUMENTATION**

**============================================================**



**For every service**



**Check whether README.md exists.**



**If it exists**



**Validate it.**



**Enhance if required.**



**Otherwise create it.**



**Authentication Service**



**README.md**



**User Service**



**README.md**



**Borrower Service**



**README.md**



**Group Service**



**README.md**



**Loan Service**



**README.md**



**EMI Service**



**README.md**



**Notification Service**



**README.md**



**Report Service**



**README.md**



**Gateway**



**README.md**



**Config Server**



**README.md**



**Eureka Server**



**README.md**



**============================================================**

**SERVICE README CONTENT**

**============================================================**



**Every README must contain**



**Project Overview**



**Business Purpose**



**Responsibilities**



**Folder Structure**



**Package Structure**



**Dependencies**



**Controllers**



**Services**



**Repositories**



**Entities**



**DTOs**



**Configurations**



**Security**



**Feign Clients**



**Database Tables**



**API Endpoints**



**Validation Rules**



**Business Rules**



**Workflow**



**Error Handling**



**Logging**



**Testing**



**Configuration**



**Environment Variables**



**Deployment**



**Future Improvements**



**============================================================**

**MERMAID DIAGRAMS**

**============================================================**



**Generate Mermaid diagrams wherever missing.**



**Architecture Diagram**



**Service Communication**



**Authentication Flow**



**OTP Login Flow**



**JWT Flow**



**Borrower Flow**



**Loan Lifecycle**



**EMI Lifecycle**



**Notification Flow**



**Scheduler Flow**



**Database Relationships**



**Deployment Architecture**



**============================================================**

**API DOCUMENTATION**

**============================================================**



**Generate markdown tables.**



**Every endpoint should contain**



**Method**



**URL**



**Description**



**Authentication**



**Authorization**



**Headers**



**Request**



**Response**



**Error Codes**



**Sample JSON**



**============================================================**

**DATABASE DOCUMENTATION**

**============================================================**



**Generate documentation for**



**Every Table**



**Every Entity**



**Primary Keys**



**Foreign Keys**



**Relationships**



**Indexes**



**Constraints**



**Cascade Rules**



**Normalization**



**============================================================**

**RUNNING GUIDE VALIDATION**

**============================================================**



**If RUNNING\_GUIDE.md already exists**



**Verify it contains**



**Software Installation**



**Java**



**Node**



**Maven**



**Git**



**Redis**



**Docker**



**MySQL**



**VS Code**



**IntelliJ**



**Environment Variables**



**Backend Startup**



**Frontend Startup**



**Docker Startup**



**Common Errors**



**Troubleshooting**



**If anything is missing**



**Append it.**



**Otherwise**



**Skip.**



**============================================================**

**QUALITY REQUIREMENTS**

**============================================================**



**Documentation must**



**Use proper Markdown**



**Contain tables**



**Contain code blocks**



**Contain Mermaid diagrams**



**Contain command examples**



**Contain configuration examples**



**Contain JSON examples**



**Contain SQL examples**



**Contain folder trees**



**Contain screenshots placeholders where appropriate**



**Use enterprise documentation style.**



**============================================================**

**FINAL SUMMARY**

**============================================================**



**After completion provide a report.**



**Example**



**==================================**



**Documentation Generation Summary**



**==================================**



**Files Checked : XX**



**Files Created : XX**



**Files Updated : XX**



**Files Skipped : XX**



**Missing Directories Created : XX**



**Warnings : XX**



**Errors : XX**



**Documentation Coverage : XX%**



**==================================**



**Continue until every requested documentation file has been processed.**



**Never stop early because a file already exists.**



**Never overwrite complete documentation unnecessarily.**



**Only generate or enhance documentation.**



**Do not modify application source code under any circumstance.**





**-------------------------------------------------------------------------------------------**







**PROMPT 16 — ENTERPRISE ENVIRONMENT CONFIGURATION (.env \& application.yml)**









**You are a Principal DevOps Engineer, Enterprise Cloud Architect, and Senior Spring Boot Solution Architect.**



**The MicroLend project has already been converted into an Enterprise Microservices Architecture.**



**Your responsibility is to audit, create, update, and standardize every environment configuration file across both backend and frontend.**



**DO NOT MODIFY BUSINESS LOGIC.**



**DO NOT CHANGE APPLICATION FUNCTIONALITY.**



**ONLY create or improve environment configuration files and configuration loading.**



**====================================================**

**IMPORTANT EXECUTION RULE**

**====================================================**



**Before creating any configuration file**



**1. Check whether it already exists.**



**2. If it exists**



**- Validate it.**

**- Keep existing values.**

**- Add missing variables.**

**- Remove duplicate variables.**

**- Organize variables properly.**

**- Add comments where supported.**

**- Never remove custom user values.**



**3. If it does not exist**



**Create it with enterprise-level configuration.**



**Never overwrite existing configuration unnecessarily.**



**Continue until every service has been validated.**



**====================================================**

**BACKEND CONFIGURATION**

**====================================================**



**Verify every microservice.**



**Authentication Service**



**User Service**



**Borrower Service**



**Group Service**



**Loan Service**



**EMI Service**



**Notification Service**



**Report Service**



**Gateway**



**Config Server**



**Eureka Server**



**For every service verify**



**application.yml**



**application-dev.yml**



**application-test.yml**



**application-prod.yml**



**bootstrap.yml (if required)**



**.env (if project supports dotenv)**



**If missing**



**Create them.**



**====================================================**

**COMMON ENVIRONMENT VARIABLES**

**====================================================**



**Standardize every service.**



**Examples**



**APP\_NAME**



**SERVER\_PORT**



**SPRING\_PROFILES\_ACTIVE**



**DATABASE\_HOST**



**DATABASE\_PORT**



**DATABASE\_NAME**



**DATABASE\_USERNAME**



**DATABASE\_PASSWORD**



**JPA\_SHOW\_SQL**



**HIBERNATE\_DDL\_AUTO**



**HIBERNATE\_DIALECT**



**JWT\_SECRET**



**JWT\_EXPIRATION**



**JWT\_REFRESH\_EXPIRATION**



**OTP\_EXPIRATION**



**OTP\_MAX\_ATTEMPTS**



**REDIS\_HOST**



**REDIS\_PORT**



**REDIS\_PASSWORD**



**MAIL\_HOST**



**MAIL\_PORT**



**MAIL\_USERNAME**



**MAIL\_PASSWORD**



**MAIL\_PROTOCOL**



**TWILIO\_ACCOUNT\_SID**



**TWILIO\_AUTH\_TOKEN**



**TWILIO\_PHONE\_NUMBER**



**EUREKA\_SERVER\_URL**



**CONFIG\_SERVER\_URL**



**GATEWAY\_URL**



**LOG\_LEVEL**



**LOG\_PATH**



**CORS\_ALLOWED\_ORIGINS**



**ACTUATOR\_ENDPOINTS**



**SWAGGER\_ENABLED**



**FILE\_UPLOAD\_PATH**



**MAX\_UPLOAD\_SIZE**



**TIMEZONE**



**DATE\_FORMAT**



**RABBITMQ\_HOST (if used)**



**KAFKA\_BOOTSTRAP\_SERVERS (if used)**



**====================================================**

**AUTHENTICATION SERVICE**

**====================================================**



**Verify configuration for**



**JWT**



**Refresh Token**



**OTP**



**Redis**



**Email**



**SMS**



**Password Encoding**



**Security**



**CORS**



**Rate Limiting**



**====================================================**

**NOTIFICATION SERVICE**

**====================================================**



**Verify**



**SMTP**



**SMS**



**Scheduler**



**Retry Configuration**



**Notification Queue**



**====================================================**

**API GATEWAY**

**====================================================**



**Verify**



**Gateway Routes**



**JWT Validation**



**Rate Limiter**



**Circuit Breaker**



**Timeout**



**Load Balancer**



**CORS**



**====================================================**

**CONFIG SERVER**

**====================================================**



**Verify**



**Git Repository**



**Native Configuration**



**Refresh Scope**



**Encryption**



**====================================================**

**EUREKA SERVER**

**====================================================**



**Verify**



**Service Registration**



**Lease Renewal**



**Health Check**



**====================================================**

**FRONTEND CONFIGURATION**

**====================================================**



**Verify frontend**



**Create or update**



**.env**



**.env.development**



**.env.production**



**.env.local**



**.env.example**



**====================================================**

**FRONTEND VARIABLES**

**====================================================**



**Ensure variables include**



**VITE\_APP\_NAME**



**VITE\_API\_GATEWAY**



**VITE\_AUTH\_SERVICE**



**VITE\_USER\_SERVICE**



**VITE\_BORROWER\_SERVICE**



**VITE\_GROUP\_SERVICE**



**VITE\_LOAN\_SERVICE**



**VITE\_EMI\_SERVICE**



**VITE\_NOTIFICATION\_SERVICE**



**VITE\_REPORT\_SERVICE**



**VITE\_ENVIRONMENT**



**VITE\_ENABLE\_SWAGGER**



**VITE\_ENABLE\_DEBUG**



**VITE\_ENABLE\_LOGGING**



**VITE\_DEFAULT\_LANGUAGE**



**VITE\_DEFAULT\_THEME**



**VITE\_DATE\_FORMAT**



**VITE\_TIMEZONE**



**VITE\_SESSION\_TIMEOUT**



**VITE\_SUPPORT\_EMAIL**



**VITE\_COMPANY\_NAME**



**====================================================**

**CREATE .env.example**

**====================================================**



**Generate**



**.env.example**



**for every service.**



**Never include secrets.**



**Replace secrets with placeholders.**



**Example**



**DATABASE\_PASSWORD=your\_password\_here**



**JWT\_SECRET=your\_secret\_here**



**MAIL\_PASSWORD=your\_mail\_password**



**TWILIO\_AUTH\_TOKEN=your\_twilio\_token**



**====================================================**

**SECURITY**

**====================================================**



**Never hardcode**



**Passwords**



**JWT Secret**



**API Keys**



**SMTP Password**



**Twilio Keys**



**Database Passwords**



**Redis Passwords**



**Move everything to environment configuration.**



**====================================================**

**VALIDATION**

**====================================================**



**Verify every Java class loads configuration correctly.**



**Use**



**@Value**



**@ConfigurationProperties**



**Environment**



**where appropriate.**



**Update configuration binding if necessary.**



**====================================================**

**DOCUMENTATION**

**====================================================**



**Generate or update**



**ENVIRONMENT\_VARIABLES.md**



**Include**



**Every variable**



**Description**



**Default Value**



**Required**



**Optional**



**Used By**



**Example**



**====================================================**

**OUTPUT**

**====================================================**



**At completion provide a report.**



**Example**



**Configuration Audit Summary**



**Backend Services Checked : XX**



**Frontend Configuration Checked : XX**



**Files Created : XX**



**Files Updated : XX**



**Files Skipped : XX**



**Missing Variables Added : XX**



**Duplicate Variables Removed : XX**



**Hardcoded Secrets Removed : XX**



**Documentation Updated : YES**



**Configuration Status : PASS**



**Do not modify business logic.**



**Only create or improve enterprise-level configuration files and environment management.**



**-------------------------------------------------------------------------------------------------------------------**







**PROMPT 17 — ENTERPRISE LOGGING, MONITORING, OBSERVABILITY \& DEVOPS**







**You are a Principal DevOps Engineer, Principal Cloud Architect, Enterprise Solution Architect, and Senior Spring Boot Engineer.**



**The MicroLend project has already been migrated to an Enterprise Spring Boot Microservices Architecture.**



**Your responsibility is to upgrade the project to enterprise production standards.**



**DO NOT CHANGE BUSINESS LOGIC.**



**DO NOT CHANGE EXISTING FEATURES.**



**ONLY implement production-grade infrastructure, monitoring, logging, resiliency, observability, CI/CD, and code quality.**



**=========================================================**

**IMPORTANT EXECUTION RULE**

**=========================================================**



**Before modifying anything**



**1. Check whether the feature already exists.**



**2. If it already exists**



**- Validate implementation.**

**- Improve if required.**

**- Skip if already enterprise-ready.**



**3. If missing**



**Implement completely.**



**Never create duplicate implementations.**



**Continue until every feature has been verified.**



**=========================================================**

**PART 1**

**ENTERPRISE LOGGING**

**=========================================================**



**Verify every microservice.**



**Authentication Service**



**User Service**



**Borrower Service**



**Group Service**



**Loan Service**



**EMI Service**



**Notification Service**



**Report Service**



**Gateway**



**Config Server**



**Eureka**



**If logback-spring.xml is missing**



**Create it.**



**Implement**



**Console Logging**



**Rolling File Logging**



**Daily Rotation**



**Maximum File Size**



**Maximum History**



**Compressed Archives**



**Different Log Levels**



**INFO**



**WARN**



**ERROR**



**DEBUG**



**TRACE**



**Separate log file for every microservice.**



**Example**



**logs/**



**auth-service.log**



**loan-service.log**



**borrower-service.log**



**gateway.log**



**notification.log**



**report.log**



**Implement logging pattern.**



**Include**



**Timestamp**



**Thread**



**Correlation ID**



**Trace ID**



**Service Name**



**Log Level**



**Class Name**



**Method**



**Message**



**=========================================================**

**PART 2**

**REQUEST RESPONSE LOGGING**

**=========================================================**



**Create logging filters.**



**Log**



**Incoming Request**



**Headers**



**Method**



**URL**



**Query Parameters**



**Execution Time**



**Status Code**



**Response Size**



**Errors**



**Mask sensitive data**



**Passwords**



**OTP**



**JWT**



**Authorization Header**



**Secrets**



**=========================================================**

**PART 3**

**CORRELATION ID**

**=========================================================**



**Implement Correlation ID.**



**Every request should generate**



**X-Correlation-ID**



**If already present**



**Reuse.**



**Pass Correlation ID across all microservices using OpenFeign.**



**Every log should contain**



**Correlation ID**



**=========================================================**

**PART 4**

**GLOBAL EXCEPTION LOGGING**

**=========================================================**



**Verify Global Exception Handler.**



**Log**



**Validation Errors**



**Business Exceptions**



**Database Errors**



**Feign Errors**



**Authentication Errors**



**Authorization Errors**



**Unexpected Errors**



**=========================================================**

**PART 5**

**SPRING BOOT ACTUATOR**

**=========================================================**



**Implement**



**Health**



**Info**



**Metrics**



**Beans**



**Env**



**Loggers**



**Mappings**



**Prometheus Endpoint**



**Readiness Probe**



**Liveness Probe**



**=========================================================**

**PART 6**

**PROMETHEUS**

**=========================================================**



**Configure Prometheus.**



**Collect**



**JVM Metrics**



**Memory**



**CPU**



**Garbage Collection**



**Threads**



**Database Connections**



**HTTP Requests**



**Response Times**



**Microservice Metrics**



**=========================================================**

**PART 7**

**GRAFANA**

**=========================================================**



**Create Grafana Dashboard configuration.**



**Include**



**CPU Usage**



**Memory Usage**



**Request Count**



**Error Rate**



**Response Time**



**Database Connections**



**JVM Heap**



**Active Threads**



**Loan Requests**



**Authentication Requests**



**=========================================================**

**PART 8**

**DISTRIBUTED TRACING**

**=========================================================**



**Implement**



**Micrometer Tracing**



**or**



**OpenTelemetry**



**or**



**Zipkin**



**Trace every request across all microservices.**



**Include**



**Gateway**



**Authentication**



**Loan**



**Borrower**



**Notification**



**Report**



**Feign Calls**



**=========================================================**

**PART 9**

**RESILIENCE4J**

**=========================================================**



**Implement**



**Circuit Breaker**



**Retry**



**Rate Limiter**



**Bulkhead**



**Time Limiter**



**Fallback Methods**



**Apply to all external service calls.**



**=========================================================**

**PART 10**

**HEALTH CHECKS**

**=========================================================**



**Every microservice should expose**



**/actuator/health**



**/actuator/info**



**Gateway should verify downstream services.**



**=========================================================**

**PART 11**

**DOCKER HEALTH CHECK**

**=========================================================**



**Update Docker configuration.**



**Health Checks**



**Restart Policy**



**Dependencies**



**Wait Strategy**



**=========================================================**

**PART 12**

**SECURITY IMPROVEMENTS**

**=========================================================**



**Verify**



**CORS**



**CSRF**



**Rate Limiting**



**JWT Validation**



**Secret Management**



**No hardcoded secrets.**



**=========================================================**

**PART 13**

**CODE QUALITY**

**=========================================================**



**Configure**



**Checkstyle**



**SpotBugs**



**PMD**



**SonarQube**



**Suppress unnecessary warnings.**



**Fix code smells.**



**=========================================================**

**PART 14**

**CI/CD**

**=========================================================**



**Generate**



**GitHub Actions workflow**



**or**



**Jenkins Pipeline**



**Pipeline stages**



**Checkout**



**Build**



**Test**



**Static Analysis**



**Package**



**Docker Build**



**Docker Push**



**Deploy**



**Health Check**



**=========================================================**

**PART 15**

**PERFORMANCE**

**=========================================================**



**Optimize**



**Connection Pools**



**Thread Pools**



**Database Indexes**



**Hibernate Batch Size**



**Caching**



**Redis**



**Feign Timeouts**



**=========================================================**

**PART 16**

**OBSERVABILITY**

**=========================================================**



**Implement**



**Structured Logging**



**Application Metrics**



**Tracing**



**Health Monitoring**



**Error Monitoring**



**Request Monitoring**



**=========================================================**

**PART 17**

**DOCUMENTATION**

**=========================================================**



**Generate or update**



**LOGGING.md**



**MONITORING.md**



**OBSERVABILITY.md**



**CI\_CD.md**



**SONARQUBE.md**



**PROMETHEUS.md**



**GRAFANA.md**



**HEALTH\_CHECKS.md**



**RESILIENCE4J.md**



**Update only if missing.**



**=========================================================**

**PART 18**

**VALIDATION**

**=========================================================**



**Verify**



**Every service builds.**



**Every service registers with Eureka.**



**Gateway routes correctly.**



**Logs generated correctly.**



**Metrics visible.**



**Health endpoints accessible.**



**Tracing works.**



**CI/CD builds successfully.**



**No compilation errors.**



**=========================================================**

**FINAL REPORT**

**=========================================================**



**Generate**



**Infrastructure Audit Summary**



**Logging**



**PASS/FAIL**



**Monitoring**



**PASS/FAIL**



**Actuator**



**PASS/FAIL**



**Prometheus**



**PASS/FAIL**



**Grafana**



**PASS/FAIL**



**Tracing**



**PASS/FAIL**



**Resilience4j**



**PASS/FAIL**



**CI/CD**



**PASS/FAIL**



**Code Quality**



**PASS/FAIL**



**Docker**



**PASS/FAIL**



**Overall Production Readiness**



**Percentage**



**Only implement production-grade enterprise infrastructure.**



**Never modify business logic.**













**---------------------------------------------------------------------------------------------------------------------**













**PROMPT 20 — ENTERPRISE DATABASE INITIALIZATION \& MANAGEMENT**







**You are a Principal Database Architect, Senior Spring Boot Engineer, and Enterprise Solution Architect.**



**The MicroLend project has already been migrated into Enterprise Spring Boot Microservices.**



**Your responsibility is to audit, standardize, and automate database creation and management across the entire application.**



**DO NOT MODIFY BUSINESS LOGIC.**



**ONLY improve database initialization, schema management, relationships, migrations, and startup behavior.**



**=========================================================**

**IMPORTANT EXECUTION RULE**

**=========================================================**



**Before making any changes**



**1. Check existing database configuration.**



**2. If already implemented**



**- Validate it.**

**- Improve if necessary.**

**- Skip if already enterprise-ready.**



**3. If missing**



**Implement it completely.**



**Never create duplicate configurations.**



**=========================================================**

**DATABASE AUDIT**

**=========================================================**



**Analyze every microservice.**



**Authentication Service**



**User Service**



**Borrower Service**



**Group Service**



**Loan Service**



**EMI Service**



**Notification Service**



**Report Service**



**Identify**



**Database Used**



**Connection Configuration**



**Entity Classes**



**Repositories**



**Relationships**



**Foreign Keys**



**Indexes**



**Constraints**



**=========================================================**

**DATABASE STRATEGY**

**=========================================================**



**Determine whether**



**Single Shared Database**



**or**



**Database Per Service**



**is currently used.**



**Generate a report explaining**



**Current Strategy**



**Advantages**



**Disadvantages**



**Recommended Enterprise Strategy**



**If database-per-service is chosen,**



**configure every service correctly.**



**=========================================================**

**DATABASE CREATION**

**=========================================================**



**Verify whether database creation is automatic.**



**If database does not exist**



**Create it automatically where supported.**



**Verify**



**MySQL Connection**



**Database Name**



**Character Set**



**UTF8MB4**



**Collation**



**Timezone**



**=========================================================**

**SCHEMA MANAGEMENT**

**=========================================================**



**Verify**



**Hibernate**



**Flyway**



**Liquibase**



**If Flyway or Liquibase is missing**



**Implement Flyway as the preferred migration tool.**



**Generate migration scripts for all existing entities.**



**Never rely only on Hibernate in production.**



**=========================================================**

**JPA CONFIGURATION**

**=========================================================**



**Development Profile**



**Automatically create/update schema.**



**Use**



**spring.jpa.hibernate.ddl-auto=update**



**or the appropriate safe development setting.**



**Production Profile**



**Disable automatic schema generation.**



**Use Flyway migrations only.**



**Never use**



**create**



**create-drop**



**update**



**in production.**



**=========================================================**

**TABLE CREATION**

**=========================================================**



**Verify every entity creates its table correctly.**



**Authentication**



**Users**



**Roles**



**Refresh Tokens**



**OTP**



**Login History**



**Borrowers**



**Groups**



**Loans**



**Loan Products**



**EMI Schedule**



**EMI Payments**



**Notifications**



**Audit Logs**



**Reports**



**Configurations**



**Create missing tables automatically.**



**=========================================================**

**RELATIONSHIPS**

**=========================================================**



**Verify**



**@OneToOne**



**@OneToMany**



**@ManyToOne**



**@ManyToMany**



**Cascade Rules**



**Fetch Types**



**Indexes**



**Foreign Keys**



**Unique Constraints**



**Composite Keys**



**Fix incorrect mappings if found.**



**=========================================================**

**SEED DATA**

**=========================================================**



**Automatically create initial data if missing.**



**Default Roles**



**ADMIN**



**BRANCH\_MANAGER**



**FIELD\_OFFICER**



**BORROWER**



**Default Admin User**



**Default Loan Products**



**Default Interest Rates**



**Default Notification Templates**



**Do not duplicate existing records.**



**=========================================================**

**DATABASE VERSIONING**

**=========================================================**



**Implement Flyway.**



**Generate migration scripts.**



**Version every schema change.**



**Document migration history.**



**=========================================================**

**STARTUP VALIDATION**

**=========================================================**



**On application startup**



**Verify database connection.**



**Verify schema version.**



**Verify pending migrations.**



**Run migrations automatically.**



**Verify seed data.**



**Log startup summary.**



**=========================================================**

**ERROR HANDLING**

**=========================================================**



**Handle**



**Database Not Found**



**Connection Failure**



**Migration Failure**



**Constraint Violation**



**Rollback Failure**



**Generate meaningful logs.**



**=========================================================**

**DOCUMENTATION**

**=========================================================**



**Generate or update**



**DATABASE\_INITIALIZATION.md**



**DATABASE\_MIGRATIONS.md**



**FLYWAY\_GUIDE.md**



**DATABASE\_SETUP.md**



**Only create them if missing.**



**=========================================================**

**FINAL REPORT**

**=========================================================**



**Generate a report.**



**Database Strategy**



**PASS/FAIL**



**Automatic Database Creation**



**PASS/FAIL**



**Automatic Table Creation**



**PASS/FAIL**



**Migration Tool**



**Flyway/Liquibase/None**



**Entities Verified**



**Relationships Verified**



**Tables Created**



**Seed Data Created**



**Indexes Created**



**Constraints Verified**



**Database Ready**



**YES/NO**



**Overall Database Health**



**Percentage**



**Do not modify business logic.**



**Only improve enterprise-level database initialization and management.**







**-------------------------------------------------------------------------------------------------------------**







