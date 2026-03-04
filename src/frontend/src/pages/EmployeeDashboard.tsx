import { useRouter } from "@/App";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useEmployee,
  useLeavesByEmployee,
  useSalaryBreakdown,
  useSubmitLeave,
} from "@/hooks/useQueries";
import {
  calculateDays,
  currentMonthStr,
  formatDate,
  formatINR,
  formatMonth,
  generateId,
} from "@/utils/format";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  Clock,
  FileText,
  IndianRupee,
  LogOut,
  Mail,
  Menu,
  Printer,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LeaveStatus } from "../backend.d";
import type { LeaveRequest } from "../backend.d";

// ─── Leave Status Badge ───────────────────────────────────────────────────────

function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  if (status === LeaveStatus.approved)
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
        Approved
      </Badge>
    );
  if (status === LeaveStatus.rejected)
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
      Pending
    </Badge>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ employeeId }: { employeeId: string }) {
  const { data: employee, isLoading, isError } = useEmployee(employeeId);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load employee profile. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  const leaveRemaining =
    Number(employee.totalLeaveBalance) - Number(employee.leavesTaken);
  const leavePercent = Math.round(
    (Number(employee.leavesTaken) /
      Math.max(Number(employee.totalLeaveBalance), 1)) *
      100,
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile header */}
      <Card className="border border-border overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl font-bold text-white font-display">
                {employee.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                {employee.name}
              </h2>
              <p className="text-primary font-medium text-sm">
                {employee.designation}
              </p>
              <p className="text-muted-foreground text-sm">
                {employee.department}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: User,
            label: "Employee ID",
            value: `${employee.employeeId.slice(0, 16)}...`,
          },
          { icon: Mail, label: "Email", value: employee.email },
          { icon: Building2, label: "Department", value: employee.department },
          {
            icon: Briefcase,
            label: "Designation",
            value: employee.designation,
          },
          {
            icon: Clock,
            label: "Joining Date",
            value: formatDate(employee.joiningDate),
          },
          {
            icon: IndianRupee,
            label: "Base Salary",
            value: formatINR(employee.baseSalary),
          },
        ].map((item) => (
          <Card key={item.label} className="border border-border">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave balance */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">
            Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Used</span>
            <span className="font-semibold">
              {Number(employee.leavesTaken)} /{" "}
              {Number(employee.totalLeaveBalance)} days
            </span>
          </div>
          <Progress value={leavePercent} className="h-2 mb-3" />
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xl font-bold text-blue-700 font-display">
                {Number(employee.totalLeaveBalance)}
              </p>
              <p className="text-xs text-blue-600">Total</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xl font-bold text-red-700 font-display">
                {Number(employee.leavesTaken)}
              </p>
              <p className="text-xs text-red-600">Taken</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xl font-bold text-green-700 font-display">
                {leaveRemaining}
              </p>
              <p className="text-xs text-green-600">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Salary Tab ────────────────────────────────────────────────────────────────

function SalaryTab({ employeeId }: { employeeId: string }) {
  const [month, setMonth] = useState(currentMonthStr());
  const {
    data: salary,
    isLoading,
    isError,
  } = useSalaryBreakdown(employeeId, month);
  const { data: employee } = useEmployee(employeeId);

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-1.5">
        <Label>Select Month</Label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load salary breakdown. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {salary && !isLoading && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Salary Breakdown
            </CardTitle>
            <CardDescription>
              {employee?.name} · {formatMonth(month)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm font-medium text-foreground">
                  Base Salary
                </span>
                <span className="font-semibold">
                  {formatINR(salary.baseSalary)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  PF Deduction
                </span>
                <span className="text-red-600 font-medium">
                  – {formatINR(salary.pfDeduction)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Leave Deduction
                </span>
                <span className="text-red-600 font-medium">
                  – {formatINR(salary.leaveDeduction)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-green-600 font-medium">
                  Bonus
                </span>
                <span className="text-green-600 font-medium">
                  + {formatINR(salary.bonus)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Total Deductions
                </span>
                <span className="text-red-600 font-semibold">
                  – {formatINR(salary.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between py-4 bg-primary/5 rounded-xl px-5 -mx-5 mt-2">
                <span className="font-bold text-foreground text-lg">
                  Net Payable
                </span>
                <span className="font-bold text-primary text-2xl">
                  {formatINR(salary.netPayable)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Leave Tab ────────────────────────────────────────────────────────────────

function LeaveTab({
  employeeId,
  employeeName,
}: { employeeId: string; employeeName: string }) {
  const { data: leaves = [], isLoading } = useLeavesByEmployee(employeeId);
  const { data: employee } = useEmployee(employeeId);
  const submitLeave = useSubmitLeave();

  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const days = calculateDays(form.startDate, form.endDate);

  const remaining = employee
    ? Number(employee.totalLeaveBalance) - Number(employee.leavesTaken)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (days > remaining) {
      toast.error(
        `Insufficient leave balance. You have ${remaining} days remaining.`,
      );
      return;
    }
    try {
      const request: LeaveRequest = {
        leaveId: generateId("LVE"),
        employeeId,
        employeeName,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        days: BigInt(days),
        status: LeaveStatus.pending,
        submittedOn: new Date().toISOString(),
      };
      await submitLeave.mutateAsync(request);
      toast.success("Leave request submitted successfully.");
      setForm({ startDate: "", endDate: "", reason: "" });
    } catch {
      toast.error("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance summary */}
      {employee && (
        <div className="grid grid-cols-3 gap-4 max-w-xl">
          <Card className="border border-border text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-700 font-display">
                {Number(employee.totalLeaveBalance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </CardContent>
          </Card>
          <Card className="border border-border text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-700 font-display">
                {Number(employee.leavesTaken)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Taken</p>
            </CardContent>
          </Card>
          <Card className="border border-border text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-700 font-display">
                {remaining}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Remaining</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit form */}
      <Card className="border border-border max-w-xl">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Submit Leave Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date *</Label>
                <Input
                  data-ocid="emp.leave_start_input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date *</Label>
                <Input
                  data-ocid="emp.leave_end_input"
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            {form.startDate && form.endDate && (
              <p className="text-sm text-primary font-medium">
                Duration: {days} day{days !== 1 ? "s" : ""}
                {days > remaining && (
                  <span className="text-red-600 ml-2">
                    (Exceeds balance of {remaining} days)
                  </span>
                )}
              </p>
            )}
            <div className="space-y-1.5">
              <Label>Reason *</Label>
              <Textarea
                data-ocid="emp.leave_reason_textarea"
                placeholder="Please describe the reason for your leave..."
                rows={3}
                value={form.reason}
                onChange={(e) =>
                  setForm((p) => ({ ...p, reason: e.target.value }))
                }
                required
              />
            </div>
            <Button
              data-ocid="emp.leave_submit_button"
              type="submit"
              disabled={submitLeave.isPending || (days > remaining && days > 0)}
              className="w-full"
            >
              {submitLeave.isPending ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Leave Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Leave history */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-3">
          Leave History
        </h3>
        <Card className="border border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="emp.leave_table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.map((leave) => (
                      <TableRow key={leave.leaveId}>
                        <TableCell>{formatDate(leave.startDate)}</TableCell>
                        <TableCell>{formatDate(leave.endDate)}</TableCell>
                        <TableCell>{Number(leave.days)}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {leave.reason}
                        </TableCell>
                        <TableCell>
                          <LeaveStatusBadge status={leave.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {leaves.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div
                            data-ocid="emp.leave_empty_state"
                            className="text-center text-muted-foreground py-10"
                          >
                            <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p>No leave requests found.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Payslip Tab ──────────────────────────────────────────────────────────────

function PayslipTab({ employeeId }: { employeeId: string }) {
  const [month, setMonth] = useState(currentMonthStr());
  const {
    data: salary,
    isLoading,
    isError,
  } = useSalaryBreakdown(employeeId, month);
  const { data: employee } = useEmployee(employeeId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="space-y-1.5">
          <Label>Select Month</Label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-48"
          />
        </div>
        {salary && (
          <Button
            data-ocid="emp.payslip_print_button"
            variant="outline"
            onClick={handlePrint}
            className="no-print"
          >
            <Printer className="w-4 h-4 mr-2" />
            Download / Print Payslip
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load payslip. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {salary && employee && !isLoading && (
        <Card className="border border-border" id="payslip-content">
          {/* Letterhead */}
          <div className="bg-[oklch(var(--navy))] px-6 py-5 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <img
                  src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
                  alt="Apex HR Solutions"
                  className="h-10 w-auto brightness-0 invert mb-2"
                />
                <p className="text-white/60 text-xs">
                  HR Consulting & Management
                </p>
                <p className="text-white/60 text-xs">
                  Mumbai, Maharashtra, India
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold font-display text-lg">
                  PAYSLIP
                </p>
                <p className="text-white/70 text-sm">{formatMonth(month)}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Employee info */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
              <div>
                <h3 className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                  Employee Details
                </h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{employee.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Designation</span>
                    <span className="font-medium">{employee.designation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Joining Date</span>
                    <span className="font-medium">
                      {formatDate(employee.joiningDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                  Pay Period
                </h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Month</span>
                    <span className="font-medium">{formatMonth(month)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PF Rate</span>
                    <span className="font-medium">
                      {employee.pfPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Leave Taken</span>
                    <span className="font-medium">
                      {Number(employee.leavesTaken)} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm font-medium">Base Salary</span>
                <span className="font-semibold">
                  {formatINR(salary.baseSalary)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  PF Deduction ({employee.pfPercentage}%)
                </span>
                <span className="text-red-600">
                  – {formatINR(salary.pfDeduction)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Leave Deduction
                </span>
                <span className="text-red-600">
                  – {formatINR(salary.leaveDeduction)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-green-600">Bonus</span>
                <span className="text-green-600">
                  + {formatINR(salary.bonus)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border text-muted-foreground">
                <span className="text-sm">Total Deductions</span>
                <span className="text-red-600 font-medium">
                  – {formatINR(salary.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between py-4 bg-primary/5 rounded-xl px-5 -mx-5 mt-2">
                <span className="font-bold text-foreground text-lg">
                  Net Payable
                </span>
                <span className="font-bold text-primary text-2xl">
                  {formatINR(salary.netPayable)}
                </span>
              </div>
            </div>

            <Separator className="my-5" />

            <p className="text-xs text-muted-foreground text-center">
              This is a computer-generated payslip. No signature required.
              <br />
              Apex HR Solutions · Mumbai, Maharashtra, India ·
              info@apexhrsolutions.in
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── No Employee Linked ───────────────────────────────────────────────────────

function NoEmployeeLinked() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full border border-border">
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-yellow-600" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground mb-2">
            No Employee Profile Linked
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your account is not yet linked to an employee profile. Please
            contact your HR administrator to set up your employee account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
  const { navigate } = useRouter();
  const { logout, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const employeeId = userProfile?.employeeId ?? "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { id: "profile", label: "My Profile", icon: User, ocid: "emp.profile_tab" },
    {
      id: "salary",
      label: "Salary",
      icon: IndianRupee,
      ocid: "emp.salary_tab",
    },
    { id: "leave", label: "Leave", icon: CalendarDays, ocid: "emp.leave_tab" },
    {
      id: "payslip",
      label: "Payslip",
      icon: FileText,
      ocid: "emp.payslip_tab",
    },
  ];

  // If no employee ID linked, show fallback
  if (!employeeId) {
    return (
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <img
            src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
            alt="Apex HR Solutions"
            className="h-9 w-auto"
          />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </header>
        <NoEmployeeLinked />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[oklch(var(--sidebar))] text-sidebar-foreground flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <img
            src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
            alt="Apex HR Solutions"
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <p className="text-sidebar-foreground/50 text-xs mt-1.5">
            Employee Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-ocid={item.ocid}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white text-xs font-bold">
              {(userProfile?.name ?? "E").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userProfile?.name ?? "Employee"}
              </p>
              <p className="text-xs text-sidebar-foreground/50">Employee</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden w-full h-full border-0 p-0 cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 no-print">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-none">
                {navItems.find((n) => n.id === activeTab)?.label ?? "Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Employee Self-Service
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Employee
          </Badge>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {activeTab === "profile" && <ProfileTab employeeId={employeeId} />}
          {activeTab === "salary" && <SalaryTab employeeId={employeeId} />}
          {activeTab === "leave" && (
            <LeaveTab
              employeeId={employeeId}
              employeeName={userProfile?.name ?? "Employee"}
            />
          )}
          {activeTab === "payslip" && <PayslipTab employeeId={employeeId} />}
        </main>
      </div>
    </div>
  );
}
