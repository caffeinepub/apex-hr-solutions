# Apex HR Solutions

## Current State
Frontend scaffold exists with shadcn/ui components. No backend code. No app pages. No routing.

## Requested Changes (Diff)

### Add
- Full public marketing website (5 sections: Home, About, Services, Recruitment/Careers, Contact)
- Secure role-based login system (HR Admin role and Employee role)
- HR Admin Dashboard with:
  - Employee Management (add, edit, delete employees with full data fields)
  - Leave Management (approve/reject leave requests, edit leave records, auto-calculate balances)
  - Salary Calculation view (auto-calculated from base salary, leave deductions, PF, bonus)
- Employee Self-Service Dashboard with:
  - Personal profile view
  - Salary breakdown (current month)
  - Leave balance and leave request submission
  - Leave request status tracking
  - Payslip download (printable view)
  - PF and bonus details view
- Company logo displayed in header/navbar: /assets/uploads/Apex-HR-Solutions-logo-design-1.png

### Modify
- Nothing (greenfield build)

### Remove
- Nothing

## Implementation Plan

### Backend (Motoko)
1. User/Auth model: users with roles (admin/employee), username, hashed password
2. Employee model: employeeId, name, joiningDate, department, baseSalary (INR), pfPercentage, bonus, leaveBalance, leavesTaken
3. Leave model: leaveId, employeeId, startDate, endDate, reason, status (pending/approved/rejected), days
4. Salary calculation: derived from baseSalary - leaveDeductions - pfDeduction + bonus = netPayable
5. CRUD operations for employees (HR only)
6. Leave request submission (employee), approval/rejection (HR)
7. Role-based access guards on all sensitive operations

### Frontend Pages
1. **Public site** - Single page with sections: Home, About, Services, Recruitment, Contact
   - Navbar with logo + navigation links
   - Hero section with "Book Consultation" and "Explore Services" CTAs
   - Services grid (HR Consulting, Payroll, Compliance, Recruitment)
   - About section with mission/vision and Vishwesh Shivankar leadership profile
   - Recruitment section with job cards and LinkedIn Apply buttons
   - Contact form + business contact details
   - Footer

2. **Login page** - Role-aware login, redirects to HR or Employee dashboard

3. **HR Admin Dashboard** (/dashboard/hr)
   - Overview stats (total employees, pending leaves, this month's payroll)
   - Employee table with add/edit/delete
   - Leave management table with approve/reject actions
   - Salary view per employee

4. **Employee Dashboard** (/dashboard/employee)
   - Profile card
   - Salary summary card (current month breakdown)
   - Leave balance card
   - Leave request form
   - Leave history table
   - Payslip printable view

### Data
- Default HR Admin credentials seeded in backend
- Sample employees and leave data seeded for demo purposes
