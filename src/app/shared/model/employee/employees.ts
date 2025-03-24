import { Base } from "../base";
import { Roles } from "../roles";
import { Address } from "./address";
import { Fullname } from "./fullname";

export interface Employees extends Base{
    fullName: Fullname,
    username: string,
    birthDate: string,
    age: number,
    address: Address,
    contactNumber: string,
    employmentStatus: string,
    employeeRoles: Roles[]

}
