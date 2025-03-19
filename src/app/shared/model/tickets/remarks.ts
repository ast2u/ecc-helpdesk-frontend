import { Employees } from "../employee/employees";

export interface Remarks {
    id: number,
    ticketId: number,
    employeeId: Employees,
    comment: string,
    createdDate: string
}
