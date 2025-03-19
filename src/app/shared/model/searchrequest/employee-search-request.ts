import { BaseSearchRequest } from "./base-search-request";

export interface EmployeeSearchRequest extends BaseSearchRequest {
    name?: string;
    birthDate?: string;
    houseNumber?: string,
    street?: string;
    city?: string,
    zipCode?: string,
    status?: string;
    deleted?: boolean;
    roles?: string; 
}
