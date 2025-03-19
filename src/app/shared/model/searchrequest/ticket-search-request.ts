import { BaseSearchRequest } from "./base-search-request";

export interface TicketSearchRequest extends BaseSearchRequest{
    ticketNumber?: string,
    desc?: string,
    status?: string,
    assignee?: string
}
