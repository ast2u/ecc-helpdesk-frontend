import { Base } from "../base";
import { Employees } from "../employee/employees";
import { Remarks } from "./remarks";

export interface Tickets extends Base{
    ticketNumber: string,
    title: string,
    body: string,
    status: string,
    assignee: Employees,
    remarks: Remarks[]
}
