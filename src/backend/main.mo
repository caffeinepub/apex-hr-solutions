import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Employee = {
    employeeId : Text;
    name : Text;
    email : Text;
    department : Text;
    designation : Text;
    joiningDate : Text;
    baseSalary : Float;
    pfPercentage : Float;
    bonus : Float;
    totalLeaveBalance : Nat;
    leavesTaken : Nat;
    linkedUserId : ?Text;
  };

  type LeaveStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type LeaveRequest = {
    leaveId : Text;
    employeeId : Text;
    employeeName : Text;
    startDate : Text;
    endDate : Text;
    reason : Text;
    days : Nat;
    status : LeaveStatus;
    submittedOn : Text;
  };

  type ContactSubmission = {
    id : Text;
    name : Text;
    email : Text;
    company : Text;
    message : Text;
    submittedOn : Text;
  };

  type SalaryBreakdown = {
    baseSalary : Float;
    pfDeduction : Float;
    leaveDeduction : Float;
    bonus : Float;
    totalDeductions : Float;
    netPayable : Float;
  };

  public type UserProfile = {
    name : Text;
    employeeId : ?Text;
  };

  module Employee {
    public func compareByName(a : Employee, b : Employee) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module LeaveRequest {
    public func compareByStartDate(a : LeaveRequest, b : LeaveRequest) : Order.Order {
      Text.compare(a.startDate, b.startDate);
    };
  };

  module ContactSubmission {
    public func compareBySubmittedOn(a : ContactSubmission, b : ContactSubmission) : Order.Order {
      Text.compare(a.submittedOn, b.submittedOn);
    };
  };

  let employees = Map.empty<Text, Employee>();
  let leaveRequests = Map.empty<Text, LeaveRequest>();
  let contactSubmissions = Map.empty<Text, ContactSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  private func getEmployeeIdForCaller(caller : Principal) : ?Text {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile.employeeId };
    };
  };

  public shared ({ caller }) func addEmployee(employee : Employee) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add employees");
    };
    employees.add(employee.employeeId, employee);
  };

  public shared ({ caller }) func updateEmployee(id : Text, updatedEmployee : Employee) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_) { employees.add(id, updatedEmployee) };
    };
  };

  public shared ({ caller }) func deleteEmployee(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_) { employees.remove(id) };
    };
  };

  public query ({ caller }) func getEmployee(id : Text) : async Employee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view employees");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) {
      switch (getEmployeeIdForCaller(caller)) {
        case (null) { Runtime.trap("Unauthorized: No employee linked to your account") };
        case (?empId) {
          if (empId != id) {
            Runtime.trap("Unauthorized: Can only view your own employee record");
          };
        };
      };
    };

    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?emp) { emp };
    };
  };

  public query ({ caller }) func getAllEmployees() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all employees");
    };
    employees.values().toArray().sort(Employee.compareByName);
  };

  public shared ({ caller }) func submitLeaveRequest(request : LeaveRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit leave requests");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) {
      switch (getEmployeeIdForCaller(caller)) {
        case (null) { Runtime.trap("Unauthorized: No employee linked to your account") };
        case (?empId) {
          if (empId != request.employeeId) {
            Runtime.trap("Unauthorized: Can only submit leave requests for your own employee record");
          };
        };
      };
    };

    leaveRequests.add(request.leaveId, request);
  };

  public shared ({ caller }) func approveLeaveRequest(leaveId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve leaves");
    };
    let leave = switch (leaveRequests.get(leaveId)) {
      case (null) { Runtime.trap("Leave request not found") };
      case (?req) { req };
    };
    let updatedLeave = { leave with status = #approved };
    leaveRequests.add(leaveId, updatedLeave);

    let emp = switch (employees.get(leave.employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?e) { e };
    };
    let updatedEmp = {
      emp with
      leavesTaken = emp.leavesTaken + leave.days;
    };
    employees.add(emp.employeeId, updatedEmp);
  };

  public shared ({ caller }) func rejectLeaveRequest(leaveId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject leaves");
    };
    switch (leaveRequests.get(leaveId)) {
      case (null) { Runtime.trap("Leave request not found") };
      case (?leave) {
        let updatedLeave = { leave with status = #rejected };
        leaveRequests.add(leaveId, updatedLeave);
      };
    };
  };

  public query ({ caller }) func getLeavesByEmployee(employeeId : Text) : async [LeaveRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view leave requests");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) {
      switch (getEmployeeIdForCaller(caller)) {
        case (null) { Runtime.trap("Unauthorized: No employee linked to your account") };
        case (?empId) {
          if (empId != employeeId) {
            Runtime.trap("Unauthorized: Can only view your own leave requests");
          };
        };
      };
    };

    leaveRequests.values().toArray().filter(func(l) { l.employeeId == employeeId });
  };

  public query ({ caller }) func getAllLeaves() : async [LeaveRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all leaves");
    };
    leaveRequests.values().toArray().sort(LeaveRequest.compareByStartDate);
  };

  public query ({ caller }) func getAllPendingLeaves() : async [LeaveRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending leaves");
    };
    leaveRequests.values().toArray().filter(func(leave) { leave.status == #pending });
  };

  public shared ({ caller }) func updateLeaveRequest(id : Text, updatedRequest : LeaveRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update leave requests");
    };
    switch (leaveRequests.get(id)) {
      case (null) { Runtime.trap("Leave request not found") };
      case (?_) { leaveRequests.add(id, updatedRequest) };
    };
  };

  public shared ({ caller }) func deleteLeaveRequest(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete leave requests");
    };
    switch (leaveRequests.get(id)) {
      case (null) { Runtime.trap("Leave request not found") };
      case (?_) { leaveRequests.remove(id) };
    };
  };

  public query ({ caller }) func getSalaryBreakdown(employeeId : Text, _ : Text) : async SalaryBreakdown {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view salary information");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) {
      switch (getEmployeeIdForCaller(caller)) {
        case (null) { Runtime.trap("Unauthorized: No employee linked to your account") };
        case (?empId) {
          if (empId != employeeId) {
            Runtime.trap("Unauthorized: Can only view your own salary information");
          };
        };
      };
    };

    let employee = switch (employees.get(employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?emp) { emp };
    };

    let baseSalary = employee.baseSalary;
    let pfDeduction = baseSalary * employee.pfPercentage / 100.0;
    let leaveDeduction = (baseSalary / 26.0) * employee.leavesTaken.toFloat();
    let totalDeductions = pfDeduction + leaveDeduction;
    let netPayable = baseSalary + employee.bonus - totalDeductions;

    {
      baseSalary;
      pfDeduction;
      leaveDeduction;
      bonus = employee.bonus;
      totalDeductions;
      netPayable;
    };
  };

  public shared func submitContactForm(submission : ContactSubmission) : async () {
    contactSubmissions.add(submission.id, submission);
  };

  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactSubmissions.values().toArray().sort(ContactSubmission.compareBySubmittedOn);
  };
};
