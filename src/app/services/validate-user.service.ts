import { Injectable } from "@angular/core";
import { Office } from "../models/office";
import { User } from "../models/user";
import { FieldsService } from "./fields.service";

@Injectable()
export class ValidateUserService {
    constructor(private fields: FieldsService) {
        //
    }

    public handleUser(user: User) {
        if (this.isUserValid(user)) {
            lowerCasify(user);

            return Promise.resolve(user);
        }
    }

    public isUserValid(user: User) {
        let isValid: boolean = true;
        if ([
            user.common.firstName,
            user.common.lastName,
            user.common.email,
            user.common.userName,
        ].includes("")) {
            alert("First and last name can't be empty");
            isValid = false;
        }

        if (!this.isOfficeValid(user)) {
            alert(`${user.common.firstName} ${user.common.lastName} - Office not valid`);
            isValid = false;
        }

        return isValid;
    }

    private isOfficeValid(user: User) {
        const offices: Office[] = [];
        this.fields.myObj.offices.forEach((office) => offices.push(new Office(office)));
        const myOffice = offices.find((office) => office.id === user.sugarCurrentUser.officeId);

        return myOffice != null;
    }
}

function lowerCasify(user: User) {
    user.common.email = user.sugarCurrentUser.common.email.toLowerCase();
    user.common.email = user.common.email.toLowerCase()
        .replace(/"'"/g, "");
    user.common.userName = user.common.userName.toLowerCase();
    user.ggCurrentUser.primaryEmail = user.ggCurrentUser.primaryEmail.toLowerCase();
}
