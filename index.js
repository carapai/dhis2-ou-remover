import axios from "axios";
import { Command } from "commander";
import inquirer from "inquirer";
const prompts = [
    {
        name: "uid",
        message: "Provide organisation uid",
        validate: function (name) {
            if (!name) {
                return "Organisation uid is required";
            }
            return true;
        },
    },
    {
        name: "url",
        message: "Provide dhis2 url",
        validate: function (name) {
            if (!name) {
                return "dhis2 url is required";
            }
            return true;
        },
    },
    {
        name: "username",
        message: "Provide dhis2 username",
        validate: function (name) {
            if (!name) {
                return "dhis2 username is required";
            }
            return true;
        },
    },
    {
        name: "password",
        message: "Provide dhis2 password",
        validate: function (name) {
            if (!name) {
                return "dhis2 password is required";
            }
            return true;
        },
    },
];

const program = new Command();
program
    .name("dhis2-ou-deleter")
    .version("1.0.0")
    .command("delete")
    .description("Order a burger")
    .action(async () => {
        const answers = await inquirer.prompt(prompts);
        const api = axios.create({
            baseURL: answers.url,
            auth: {
                username: answers.username,
                password: answers.password,
            },
        });
        const {
            data: { organisationUnits },
        } = await api.get(`organisationUnits/${answers.uid}`, {
            params: {
                includeDescendants: true,
                fields: "id,level",
                paging: false,
            },
        });

        organisationUnits.sort(function (a, b) {
            return parseFloat(b.level) - parseFloat(a.level);
        });

        for (const { id } of organisationUnits) {
            try {
                await api.delete(`organisationUnits/${id}`);
                console.log(`Organisation with id ${id} successfully deleted`);
            } catch (error) {
                console.log(error);
            }
        }
    });

program.parse();
