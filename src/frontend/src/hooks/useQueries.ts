import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ContactSubmission,
  Employee,
  LeaveRequest,
  SalaryBreakdown,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Employees ──────────────────────────────────────────────────────────────

export function useAllEmployees() {
  const { actor, isFetching } = useActor();
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEmployee(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getEmployee(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddEmployee() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (employee: Employee) => {
      if (!actor) throw new Error("No actor");
      return actor.addEmployee(employee);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      employee,
    }: { id: string; employee: Employee }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateEmployee(id, employee);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteEmployee(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// ─── Leaves ─────────────────────────────────────────────────────────────────

export function useAllLeaves() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaveRequest[]>({
    queryKey: ["leaves"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeaves();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingLeaves() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaveRequest[]>({
    queryKey: ["leaves", "pending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendingLeaves();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeavesByEmployee(employeeId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<LeaveRequest[]>({
    queryKey: ["leaves", "employee", employeeId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeavesByEmployee(employeeId);
    },
    enabled: !!actor && !isFetching && !!employeeId,
  });
}

export function useApproveLeave() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (leaveId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.approveLeaveRequest(leaveId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leaves"] });
      void qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useRejectLeave() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (leaveId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.rejectLeaveRequest(leaveId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
}

export function useSubmitLeave() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: LeaveRequest) => {
      if (!actor) throw new Error("No actor");
      return actor.submitLeaveRequest(request);
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ["leaves"] });
      void qc.invalidateQueries({
        queryKey: ["employee", variables.employeeId],
      });
    },
  });
}

export function useUpdateLeave() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: { id: string; request: LeaveRequest }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateLeaveRequest(id, request);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
}

export function useDeleteLeave() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteLeaveRequest(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
}

// ─── Salary ──────────────────────────────────────────────────────────────────

export function useSalaryBreakdown(employeeId: string, month: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SalaryBreakdown>({
    queryKey: ["salary", employeeId, month],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getSalaryBreakdown(employeeId, month);
    },
    enabled: !!actor && !isFetching && !!employeeId && !!month,
  });
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export function useContactSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactSubmission[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error("No actor");
      return actor.submitContactForm(submission);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
