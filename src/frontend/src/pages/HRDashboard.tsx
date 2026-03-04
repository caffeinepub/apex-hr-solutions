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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddEmployee,
  useAllEmployees,
  useAllLeaves,
  useApproveLeave,
  useContactSubmissions,
  useDeleteEmployee,
  useDeleteLeave,
  useRejectLeave,
  useSalaryBreakdown,
  useUpdateEmployee,
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
  CalendarDays,
  CheckCircle,
  Clock,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Printer,
  Trash2,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Employee, LeaveRequest } from "../backend.d";
import { LeaveStatus } from "../backend.d";

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

// ─── Employee Form ────────────────────────────────────────────────────────────

const EMPTY_EMPLOYEE: Employee = {
  employeeId: "",
  name: "",
  email: "",
  department: "",
  designation: "",
  joiningDate: "",
  baseSalary: 0,
  pfPercentage: 12,
  bonus: 0,
  totalLeaveBalance: BigInt(24),
  leavesTaken: BigInt(0),
  linkedUserId: "",
};

interface EmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Employee;
  isEdit?: boolean;
}

function EmployeeDialog({
  open,
  onClose,
  initial,
  isEdit,
}: EmployeeDialogProps) {
  const [form, setForm] = useState<Employee>(initial ?? EMPTY_EMPLOYEE);
  const addEmployee = useAddEmployee();

  // Reset form when initial employee changes (triggered by open/close via parent key prop)
  useEffect(() => {
    setForm(initial ?? EMPTY_EMPLOYEE);
  }, [initial]);
  const updateEmployee = useUpdateEmployee();

  const set = (field: keyof Employee, value: string | number | bigint) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.department || !form.designation) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const employeeData: Employee = {
        ...form,
        employeeId: isEdit ? form.employeeId : generateId("EMP"),
      };
      if (isEdit) {
        await updateEmployee.mutateAsync({
          id: form.employeeId,
          employee: employeeData,
        });
        toast.success("Employee updated successfully.");
      } else {
        await addEmployee.mutateAsync(employeeData);
        toast.success("Employee added successfully.");
      }
      onClose();
    } catch {
      toast.error("Failed to save employee. Please try again.");
    }
  };

  const isPending = addEmployee.isPending || updateEmployee.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the employee's details below."
              : "Fill in the employee details to add them to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Amit Sharma"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="amit@company.in"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Department *</Label>
              <Input
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                placeholder="Engineering"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Designation *</Label>
              <Input
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                placeholder="Senior Engineer"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Joining Date</Label>
              <Input
                type="date"
                value={form.joiningDate}
                onChange={(e) => set("joiningDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Base Salary (₹)</Label>
              <Input
                type="number"
                value={form.baseSalary}
                onChange={(e) => set("baseSalary", Number(e.target.value))}
                placeholder="50000"
                min={0}
              />
            </div>
            <div className="space-y-1.5">
              <Label>PF Percentage (%)</Label>
              <Input
                type="number"
                value={form.pfPercentage}
                onChange={(e) => set("pfPercentage", Number(e.target.value))}
                placeholder="12"
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bonus (₹)</Label>
              <Input
                type="number"
                value={form.bonus}
                onChange={(e) => set("bonus", Number(e.target.value))}
                placeholder="5000"
                min={0}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Leave Balance (days)</Label>
              <Input
                type="number"
                value={Number(form.totalLeaveBalance)}
                onChange={(e) =>
                  set("totalLeaveBalance", BigInt(e.target.value))
                }
                placeholder="24"
                min={0}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Leaves Taken</Label>
              <Input
                type="number"
                value={Number(form.leavesTaken)}
                onChange={(e) => set("leavesTaken", BigInt(e.target.value))}
                placeholder="0"
                min={0}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Linked User ID (optional)</Label>
            <Input
              value={form.linkedUserId ?? ""}
              onChange={(e) => set("linkedUserId", e.target.value)}
              placeholder="Internet Identity principal"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
              )}
              {isEdit ? "Update Employee" : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ onAddEmployee }: { onAddEmployee?: () => void }) {
  const { data: employees = [], isLoading: loadingEmp } = useAllEmployees();
  const { data: leaves = [], isLoading: loadingLeaves } = useAllLeaves();

  const pendingLeaves = leaves.filter(
    (l) => l.status === LeaveStatus.pending,
  ).length;
  const totalPayroll = employees.reduce(
    (sum, e) => sum + e.baseSalary + e.bonus,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Employees",
            value: loadingEmp ? "—" : employees.length.toString(),
            icon: Users,
            color: "text-blue-600 bg-blue-50",
            sub: "Active employees",
          },
          {
            title: "Pending Leave Requests",
            value: loadingLeaves ? "—" : pendingLeaves.toString(),
            icon: Clock,
            color: "text-yellow-600 bg-yellow-50",
            sub: "Awaiting approval",
          },
          {
            title: "Monthly Payroll",
            value: loadingEmp ? "—" : formatINR(totalPayroll),
            icon: IndianRupee,
            color: "text-green-600 bg-green-50",
            sub: "Estimated this month",
          },
        ].map((stat) => (
          <Card key={stat.title} className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  {loadingEmp || loadingLeaves ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground mt-1 font-display">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.sub}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent employees */}
      <Card className="border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-lg">
                Recent Employees
              </CardTitle>
              <CardDescription>Last 5 added employees</CardDescription>
            </div>
            {onAddEmployee && (
              <Button
                data-ocid="hr.overview_add_employee_button"
                size="sm"
                onClick={onAddEmployee}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Employee
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadingEmp ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.slice(0, 5).map((emp) => (
                  <TableRow key={emp.employeeId}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell className="text-right">
                      {formatINR(emp.baseSalary)}
                    </TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No employees found. Add employees to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Employees Tab ────────────────────────────────────────────────────────────

interface EmployeesTabProps {
  externalDialogOpen?: boolean;
  externalEditEmployee?: Employee | null;
  onExternalDialogClose?: () => void;
}

function EmployeesTab({
  externalDialogOpen,
  externalEditEmployee,
  onExternalDialogClose,
}: EmployeesTabProps) {
  const { data: employees = [], isLoading } = useAllEmployees();
  const deleteEmployee = useDeleteEmployee();
  const [localDialogOpen, setLocalDialogOpen] = useState(false);
  const [localEditEmployee, setLocalEditEmployee] = useState<Employee | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Merge external and local dialog state:
  // External takes priority when it's explicitly true
  const dialogOpen = externalDialogOpen === true ? true : localDialogOpen;
  const editEmployee =
    externalDialogOpen === true
      ? (externalEditEmployee ?? null)
      : localEditEmployee;

  const handleDialogClose = () => {
    if (externalDialogOpen === true && onExternalDialogClose) {
      onExternalDialogClose();
    }
    setLocalDialogOpen(false);
    setLocalEditEmployee(null);
  };
  const [search, setSearch] = useState("");

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee.mutateAsync(id);
      toast.success("Employee deleted.");
    } catch {
      toast.error("Failed to delete employee.");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Search by name, department, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          data-ocid="hr.add_employee_button"
          onClick={() => {
            setLocalEditEmployee(null);
            setLocalDialogOpen(true);
          }}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card className="border border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="hr.employee_table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead>Leave Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((emp, idx) => (
                    <TableRow key={emp.employeeId}>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {emp.employeeId.length > 20
                          ? `${emp.employeeId.slice(0, 18)}…`
                          : emp.employeeId}
                      </TableCell>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.designation}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatINR(emp.baseSalary)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {Number(emp.totalLeaveBalance) -
                            Number(emp.leavesTaken)}{" "}
                          / {Number(emp.totalLeaveBalance)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            data-ocid={`hr.employee_edit_button.${idx + 1}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setLocalEditEmployee(emp);
                              setLocalDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`hr.employee_delete_button.${idx + 1}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(emp.employeeId)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-10"
                      >
                        {search
                          ? "No employees match your search."
                          : "No employees yet. Click 'Add Employee' to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <EmployeeDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          initial={editEmployee ?? undefined}
          isEdit={!!editEmployee}
        />
      )}

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteEmployee.isPending}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {deleteEmployee.isPending && (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Leave Management Tab ──────────────────────────────────────────────────────

function LeaveManagementTab() {
  const { data: leaves = [], isLoading } = useAllLeaves();
  const approveLeave = useApproveLeave();
  const rejectLeave = useRejectLeave();
  const deleteLeave = useDeleteLeave();
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filtered = leaves.filter((l) =>
    filter === "all" ? true : l.status === filter,
  );

  const handleApprove = async (id: string) => {
    try {
      await approveLeave.mutateAsync(id);
      toast.success("Leave approved.");
    } catch {
      toast.error("Failed to approve leave.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectLeave.mutateAsync(id);
      toast.success("Leave rejected.");
    } catch {
      toast.error("Failed to reject leave.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLeave.mutateAsync(id);
      toast.success("Leave request deleted.");
    } catch {
      toast.error("Failed to delete leave request.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
            <span
              className={`ml-2 rounded-full px-1.5 text-xs ${
                filter === f
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "all"
                ? leaves.length
                : leaves.filter((l) => l.status === f).length}
            </span>
          </Button>
        ))}
      </div>

      <Card className="border border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((leave, idx) => (
                    <TableRow key={leave.leaveId}>
                      <TableCell className="font-medium">
                        {leave.employeeName}
                      </TableCell>
                      <TableCell>{formatDate(leave.startDate)}</TableCell>
                      <TableCell>{formatDate(leave.endDate)}</TableCell>
                      <TableCell>{Number(leave.days)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {leave.reason}
                      </TableCell>
                      <TableCell>
                        <LeaveStatusBadge status={leave.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          {leave.status === LeaveStatus.pending && (
                            <>
                              <Button
                                data-ocid={`hr.leave_approve_button.${idx + 1}`}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(leave.leaveId)}
                                disabled={approveLeave.isPending}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                data-ocid={`hr.leave_reject_button.${idx + 1}`}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(leave.leaveId)}
                                disabled={rejectLeave.isPending}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(leave.leaveId)}
                            disabled={deleteLeave.isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-10"
                      >
                        No {filter === "all" ? "" : filter} leave requests
                        found.
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
  );
}

// ─── Salary Tab ────────────────────────────────────────────────────────────────

function SalaryTab() {
  const { data: employees = [], isLoading: loadingEmp } = useAllEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [month, setMonth] = useState(currentMonthStr());

  const {
    data: salary,
    isLoading: loadingSalary,
    isError,
  } = useSalaryBreakdown(selectedEmployeeId, month);

  const selectedEmployee = employees.find(
    (e) => e.employeeId === selectedEmployeeId,
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Select Employee</Label>
          {loadingEmp ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger data-ocid="hr.salary_employee_select">
                <SelectValue placeholder="Choose an employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.employeeId} value={e.employeeId}>
                    {e.name} — {e.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Month</Label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
      </div>

      {selectedEmployeeId && loadingSalary && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}
      {selectedEmployeeId && !loadingSalary && isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load salary breakdown. Please try again.
          </AlertDescription>
        </Alert>
      )}
      {selectedEmployeeId && !loadingSalary && !isError && salary && (
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">
                  Salary Breakdown
                </CardTitle>
                <CardDescription>
                  {selectedEmployee?.name} · {formatMonth(month)}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print Payslip
              </Button>
            </div>
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
              <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-4 -mx-4">
                <span className="font-bold text-foreground text-lg">
                  Net Payable
                </span>
                <span className="font-bold text-primary text-xl">
                  {formatINR(salary.netPayable)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedEmployeeId && !loadingEmp && (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
          <IndianRupee className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Select an employee to view their salary breakdown</p>
        </div>
      )}
    </div>
  );
}

// ─── Contact Submissions Tab ──────────────────────────────────────────────────

function ContactSubmissionsTab() {
  const { data: submissions = [], isLoading } = useContactSubmissions();

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="font-display text-lg">
          Contact Form Submissions
        </CardTitle>
        <CardDescription>
          {submissions.length} total submission
          {submissions.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.company || "—"}</TableCell>
                    <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground">
                      {s.message}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(s.submittedOn)}
                    </TableCell>
                  </TableRow>
                ))}
                {submissions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-10"
                    >
                      No contact submissions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function HRDashboard() {
  const { navigate } = useRouter();
  const { logout, userProfile, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lifted state for cross-tab "Add Employee" action from Overview
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddEmployeeFromOverview = () => {
    setActiveTab("employees");
    setEditingEmployee(null);
    setEmployeeDialogOpen(true);
  };

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "hr.overview_tab",
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      ocid: "hr.employees_tab",
    },
    {
      id: "leaves",
      label: "Leave Management",
      icon: CalendarDays,
      ocid: "hr.leaves_tab",
    },
    { id: "salary", label: "Salary", icon: IndianRupee, ocid: "hr.salary_tab" },
    {
      id: "contacts",
      label: "Contact Submissions",
      icon: MessageSquare,
      ocid: "hr.contacts_tab",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[oklch(var(--sidebar))] text-sidebar-foreground flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <img
            src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
            alt="Apex HR Solutions"
            className="h-10 w-auto object-contain brightness-0 invert"
          />
          <p className="text-sidebar-foreground/50 text-xs mt-1.5">
            HR Admin Portal
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
              {(userProfile?.name ?? "HR").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userProfile?.name ?? "HR Admin"}
              </p>
              <p className="text-xs text-sidebar-foreground/50">
                Administrator
              </p>
            </div>
          </div>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
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
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
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
                HR Administration Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              HR Admin
            </Badge>
            <Button
              data-ocid="hr.exit_button"
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              onClick={() => navigate("/")}
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Exit
            </Button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {activeTab === "overview" && (
            <OverviewTab onAddEmployee={handleAddEmployeeFromOverview} />
          )}
          {activeTab === "employees" && (
            <EmployeesTab
              externalDialogOpen={employeeDialogOpen}
              externalEditEmployee={editingEmployee}
              onExternalDialogClose={() => {
                setEmployeeDialogOpen(false);
                setEditingEmployee(null);
              }}
            />
          )}
          {activeTab === "leaves" && <LeaveManagementTab />}
          {activeTab === "salary" && <SalaryTab />}
          {activeTab === "contacts" && <ContactSubmissionsTab />}
        </main>
      </div>
    </div>
  );
}
