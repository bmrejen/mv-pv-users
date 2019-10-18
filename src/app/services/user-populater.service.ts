import { Injectable } from "@angular/core";
import { User } from "./../models/user";

@Injectable()
export class UserPopulaterService {
    public populateUserProperties(user: User) {
        setUsername(user);
        setTourplan(user);
        setPassword(user);
        setGooglePrimaryEmail(user);
        setEmail(user);
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
    if (user.common.email == null && user.common.email === "") {
        user.common.email = `${user.common.userName}@${user.ggCurrentUser.sendAs}`;
    }
}
