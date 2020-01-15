// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-wait-until';

Cypress.Commands.add('getWizardStep', (number) => cy.get(".Wizard-step")
.eq(number))

Cypress.Commands.add('login', (username, password) => {
    cy.request(
        "POST",
        `https://api.sendsay.ru/general/api/v100/json/${username}/`,
        {
            action: "login",
            login: username,
            passwd: password,
        }
    )
})