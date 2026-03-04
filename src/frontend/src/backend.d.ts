import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaveRequest {
    status: LeaveStatus;
    leaveId: string;
    employeeName: string;
    endDate: string;
    days: bigint;
    submittedOn: string;
    employeeId: string;
    startDate: string;
    reason: string;
}
export interface SalaryBreakdown {
    totalDeductions: number;
    netPayable: number;
    bonus: number;
    leaveDeduction: number;
    pfDeduction: number;
    baseSalary: number;
}
export interface ContactSubmission {
    id: string;
    name: string;
    submittedOn: string;
    email: string;
    company: string;
    message: string;
}
export interface Employee {
    name: string;
    designation: string;
    joiningDate: string;
    totalLeaveBalance: bigint;
    email: string;
    leavesTaken: bigint;
    employeeId: string;
    linkedUserId?: string;
    bonus: number;
    department: string;
    baseSalary: number;
    pfPercentage: number;
}
export interface UserProfile {
    name: string;
    employeeId?: string;
}
export enum LeaveStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEmployee(employee: Employee): Promise<void>;
    approveLeaveRequest(leaveId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEmployee(id: string): Promise<void>;
    deleteLeaveRequest(id: string): Promise<void>;
    getAllEmployees(): Promise<Array<Employee>>;
    getAllLeaves(): Promise<Array<LeaveRequest>>;
    getAllPendingLeaves(): Promise<Array<LeaveRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getEmployee(id: string): Promise<Employee>;
    getLeavesByEmployee(employeeId: string): Promise<Array<LeaveRequest>>;
    getSalaryBreakdown(employeeId: string, arg1: string): Promise<SalaryBreakdown>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rejectLeaveRequest(leaveId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(submission: ContactSubmission): Promise<void>;
    submitLeaveRequest(request: LeaveRequest): Promise<void>;
    updateEmployee(id: string, updatedEmployee: Employee): Promise<void>;
    updateLeaveRequest(id: string, updatedRequest: LeaveRequest): Promise<void>;
}
