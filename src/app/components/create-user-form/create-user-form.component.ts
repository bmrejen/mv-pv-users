import { Component, OnInit } from "@angular/core";

@Component({
  selector: "mv-app-create-user-form",
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {

  public fields = {
    accounts: [{
      label: "gapps",
      name: "Google Apps",
    },
    {
      label: "sugar",
      name: "Sugar",
    },
    {
      label: "switchvox",
      name: "SwitchVox",
    },
    ],
    bureaux: [
    {
      label: "*Néant*",
      value: "",
    },
    {
      label: "Bureau - Backoffice",
      value: "1006",
    },
    {
      label: "Bureau - Black Pearl 1",
      value: "1012",
    },
    {
      label: "Bureau - Black Pearl 2",
      value: "1943",
    },
    {
      label: "Bureau - Comptabilite",
      value: "1377",
    },
    {
      label: "Bureau - Golden Dragons 1",
      value: "1014",
    },
    {
      label: "Bureau - Golden Dragons 2",
      value: "1376",
    },
    {
      label: "Bureau - Guaranis 1",
      value: "1010",
    },
    {
      label: "Bureau - Guaranis 2",
      value: "1011",
    },
    {
      label: "Bureau - Iroquois 1",
      value: "1009",
    },
    {
      label: "Bureau - Iroquois 2",
      value: "1963",
    },
    {
      label: "Bureau - Marines",
      value: "1007",
    },
    {
      label: "Bureau - Marines 2",
      value: "1964",
    },
    {
      label: "Bureau - Masai",
      value: "1008",
    },
    {
      label: "Bureau - Papagayos 1",
      value: "1930",
    },
    {
      label: "Bureau - Papagayos 2",
      value: "1944",
    },
    {
      label: "Bureau - Prestige",
      value: "1015",
    },
    {
      label: "Bureau - Production",
      value: "1017",
    },
    {
      label: "Bureau - SG",
      value: "1690",
    },
    {
      label: "Bureau - Shaolin",
      value: "1013",
    },
    {
      label: "Bureau - Sharks",
      value: "1005",
    },
    ],
    orgas: [
    {
      label: "",
      value: "/",
    },
    {
      label: "BackOffice",
      value: "/BackOffice",
    },
    {
      label: "Compta",
      value: "/Compta",
    },
    {
      label: "EQ Black Pearls",
      value: "/EQ Black Pearls",
    },
    {
      label: "EQ Cajuns",
      value: "/EQ Cajuns",
    },
    {
      label: "EQ Golden Dragons",
      value: "/EQ Golden Dragons",
    },
    {
      label: "EQ Guaranis",
      value: "/EQ Guaranis",
    },
    {
      label: "EQ Iroquois",
      value: "/EQ Iroquois",
    },
    {
      label: "EQ Marines",
      value: "/EQ Marines",
    },
    {
      label: "EQ Masais",
      value: "/EQ Masais",
    },
    {
      label: "EQ Papagayos",
      value: "/EQ Papagayos",
    },
    {
      label: "EQ Shaolins",
      value: "/EQ Shaolins",
    },
    {
      label: "EQ Sharks",
      value: "/EQ Sharks",
    },
    {
      label: "IT",
      value: "/IT",
    },
    {
      label: "Marketing Paris",
      value: "/Marketing Paris",
    },
    {
      label: "Prod / Achats",
      value: "/Prod / Achats",
    },
    {
      label: "SG & Direction",
      value: "/SG & Direction",
    },
    {
      label: "Shanghai",
      value: "/Shanghai",
    },
    {
      label: "Web Tools",
      value: "/Web Tools",
    },
    {
      label: "X - Congé maternité",
      value: "/X - Congé maternité",
    },
    {
      label: "X 1 - Pending Legal Do not delete",
      value: "/X 1 - Pending Legal Do not delete",
    },
    {
      label: "X Partis",
      value: "/X Partis",
    },
    {
      label: "X X A EFFACER",
      value: "/X X A EFFACER",
    },

    ],
    roles: [
    {
      label: "Admin",
      name: "dfd8b251-db66-3a60-ca21-4e23e7976bfb",
    },
    {
      label: "Bo",
      name: "723b4e69-b694-50da-4326-4aaf093df7ca",
    },
    {
      label: "Sales Manager",
      name: "b97df828-2842-24ed-0bcf-4a7026b4ec1b",
    },
    {
      label: "Sales",
      name: "6f89b1d4-9c9e-3436-ec67-4a702644eb29",
    },
    {
      label: "SAV",
      name: "8674a9aa-567d-b961-0b07-4d2ae7dfbc7f",
    },
    {
      label: "Superviseur",
      name: "e6e83aa3-35ce-5390-99ff-4f9b531ea254",
    },
    {
      label: "Team Manager",
      name: "128e2eae-322a-8a0d-e9f0-4cf35b5bfe5b",
    },
    {
      label: "HR",
      name: "bd4b4c2a-0d47-a6ef-fb3e-53169635c764",
    },
    {
      label: "Read-only",
      name: "da7b7380-1839-83c1-4863-4d53bb7481c3",
    },
    {
      label: "Accountant",
      name: "8bd8a755-d4e0-78e0-4dda-4bfcf0aed3e3",
    },
    ],
    services: [
    {
      label: "Departement (facultatif)",
      name: "Departement (facultatif)",
    },
    {
      label: "Backoffice",
      name: "Backoffice",
    },
    {
      label: "Backoffice Billet",
      name: "Backoffice Billet",
    },
    {
      label: "Backoffice Carnet",
      name: "Backoffice Carnet",
    },
    {
      label: "Backoffice Resa",
      name: "Backoffice Resa",
    },
    {
      label: "Comptabilité",
      name: "Comptabilité",
    },
    {
      label: "Production",
      name: "Production",
    },
    {
      label: "SAV",
      name: "SAV",
    },
    {
      label: "Service Qualité",
      name: "Service Qualité",
    },
    {
      label: "Ventes",
      name: "Ventes",
    },
    ],
    userFields: [{
      label: "Prenom",
      name: "firstname",
    },
    {
      label: "Nom",
      name: "lastname",
    },
    {
      label: "Username",
      name: "username",
    },
    {
      label: "E-mail",
      name: "email",
    },
    {
      label: "Mot de passe",
      name: "password",
    }],
  };

  constructor() {
    // constructor
  }

  public ngOnInit(): void {
  }

  public sugarRole(num) {
    return `sugar_role[${num}]`;
  }

  public sugarDepartment(ser) {
    return `sugar_department[${ser}]`;
  }

  public handleClick(e) {
    e.preventDefault();
    console.log("e.target.value");
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
