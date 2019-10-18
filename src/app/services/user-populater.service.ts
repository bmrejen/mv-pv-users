import { Injectable } from "@angular/core";
import { User } from "./../models/user";

@Injectable()
export class UserPopulaterService {
    public populateUserProperties(user: User) {
        capitalize(user);
        setUsername(user);
        setTourplan(user);
        setPassword(user);
        setGooglePrimaryEmail(user);
        setEmail(user);
        setSignature(user);
    }
}

function setUsername(user: User) {
    if (user.common.userName == null || user.common.userName === "") {
        const initials = user.common.firstName.split(" ")
            .map((part) => part[0])
            .join()
            .replace(/,/g, "")
            .toLowerCase();
        const lastName = user.common.lastName.replace(/ /g, "")
            .toLowerCase();

        user.common.userName = `${initials}${lastName}`;
    }
}

function setTourplan(user: User) {
    if (user.sugarCurrentUser.tourplanID == null || user.sugarCurrentUser.tourplanID === "") {
        user.sugarCurrentUser.tourplanID = user.common.userName.substr(0, 6)
            .toUpperCase();
    }
}

function setPassword(user: User) {
    if (user.sugarCurrentUser.id != null && user.sugarCurrentUser.id !== "") { return null; } else {
        if (user.common.password == null || user.common.password === "") {
            const randomString = Math.random()
                .toString()
                .substring(2, 7);

            const initials =
                `${user.common.firstName[0].toLowerCase()}${user.common.lastName[0].toLowerCase()}`;

            user.common.password = `${initials}${randomString}!`;
        }
    }
}

function setGooglePrimaryEmail(user: User) {
    if (user.ggCurrentUser.primaryEmail === "") {
        user.ggCurrentUser.primaryEmail = `${user.common.userName}@planetveo.com`;
    }
}

function setEmail(user: User) {
    if (user.common.email == null || user.common.email === "") {
        user.common.email = `${user.common.userName}@${user.ggCurrentUser.sendAs}`;
    }
}

function setSignature(user: User) {
    if (user.ggCurrentUser.signature == null || user.ggCurrentUser.signature === "") {
        // tslint:disable-next-line:max-line-length
        user.ggCurrentUser.signature = `<div dir="ltr"><p style="font-size:1em;color:rgb(164,135,67);font-family:Lato,Calibri,Arial,Helvetica,sans-serif">--------------------------------</p><p style="color:rgb(0,0,0);font-size:1em;font-family:Lato,Calibri,Arial,Helvetica,sans-serif"><span style="font-weight:bold">${user.common.firstName} ${user.common.lastName}</span><br>${user.sugarCurrentUser.title}</p><p style="color:rgb(0,0,0);font-size:1em;font-family:Lato,Calibri,Arial,Helvetica,sans-serif">${user.sugarCurrentUser.phoneWork} (${user.sugarCurrentUser.phoneAsterisk})<span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif"><br><a href="http://www.${user.ggCurrentUser.sendAs}/" target="_blank"><b><span lang="DE" style="color:#a48743">www.${user.ggCurrentUser.sendAs}</span></b></a></span><span style="font-family:&quot;Times New Roman&quot;;font-size:medium">&nbsp;</span></p></div>`;
    }
}

function capitalize(user: User) {
    user.sugarCurrentUser.salutation = capitalizeProperties(user.sugarCurrentUser.salutation);
    user.common.firstName = capitalizeProperties(user.common.firstName);
    user.common.lastName = capitalizeProperties(user.common.lastName);
    user.sugarCurrentUser.title = capitalizeProperties(user.sugarCurrentUser.title);
    user.sugarCurrentUser.department = capitalizeProperties(user.sugarCurrentUser.department);
}

function capitalizeProperties(word: string): string {
    return word.charAt(0)
        .toUpperCase() + word.slice(1);
}
