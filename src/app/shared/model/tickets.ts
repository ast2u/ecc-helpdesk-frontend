import { Base } from "./base";
import { Employees } from "./employee/employees";

export interface Tickets extends Base{
    ticketNumber: string,
    title: string,
    body: string,
    status: string,
    assignee: Employees
}
