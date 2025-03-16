export interface EmployeeSearchRequest {
    name?: string;
    birthDate?: string;
    houseNumber?: string,
    street?: string;
    city?: string,
    zipCode?: string,
    status?: string;
    deleted?: boolean;
    createdBy?: string;
    updatedBy?: string;
    roles?: string; 
    createdStart?: string;
    createdEnd?: string;
    updatedStart?: string;
    updatedEnd?: string;
}
