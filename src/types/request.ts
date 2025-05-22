
export interface Request {
  id: string;
  employeeName: string;
  employeeEmail: string;
  software: string;
  accessLevel: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  managerComment?: string;
}
