# Apex HR Solutions

## Current State
- Public marketing site is open to everyone
- `/dashboard/employee` route is wrapped in `ProtectedRoute` -- requires Internet Identity login
- `/dashboard/hr` route is wrapped in `ProtectedRoute` with `requireAdmin=true`
- Login page only offers Internet Identity login; no guest access
- `EmployeeDashboard` pulls `employeeId` from `userProfile` (auth-linked); if empty, shows "No Employee Profile Linked" message

## Requested Changes (Diff)

### Add
- Employee ID lookup form on the Employee Dashboard for unauthenticated/guest users: input a known Employee ID to view that employee's profile, salary, leave history, and payslip without logging in
- "Login for full access" call-to-action on the guest employee view (login links employee account for leave submission)

### Modify
- Remove `ProtectedRoute` wrapper from `/dashboard/employee` route in `App.tsx` -- the employee portal is now publicly accessible
- `EmployeeDashboard`: when user is not authenticated OR has no linked employeeId, show an Employee ID lookup form (instead of the current "No Employee Profile Linked" error card) so anyone can look up an employee record by ID
- Guest users (not logged in) can view Profile, Salary, Payslip tabs but the Leave submission form shows a "Login required to submit leave requests" notice
- HR Admin dashboard (`/dashboard/hr`) remains fully protected -- no change

### Remove
- The hard redirect to `/login` when navigating to `/dashboard/employee` without authentication

## Implementation Plan
1. In `App.tsx`: Change the `/dashboard/employee` route to render `<EmployeeDashboard />` directly without `ProtectedRoute`
2. In `EmployeeDashboard.tsx`:
   - Add local state `guestEmployeeId` and a lookup form shown when `employeeId` (from auth) is empty
   - The lookup form accepts an Employee ID text input + "View Dashboard" button that sets a local `resolvedEmployeeId`
   - Pass `resolvedEmployeeId` (either from auth profile or guest input) to all tabs
   - In the Leave tab: if user is not authenticated (`!isAuthenticated`), disable the leave request form and show an inline notice to login for full access
   - Sidebar/header: if not authenticated, show "Guest" label and a "Login" button instead of "Logout"
3. `LoginPage.tsx`: Add a "Continue as Guest" / "Access Employee Portal" secondary button that navigates directly to `/dashboard/employee`
