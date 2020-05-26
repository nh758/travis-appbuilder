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

Cypress.Commands.add('userLogin', (user) => {
  cy.visit('/site/login/')

  cy.get('input#user-name')
    .type(user.name)

  cy.get('input#user-pw')
    .type(user.password)

  cy.contains('Log In').click()
})

Cypress.Commands.add('adminLogin', () => {
  cy.userLogin({ name: 'admin', password: 'admin' })
})

Cypress.Commands.add('performLogin', (user) => {
  // A utility function to check that we are seeing the dashboard page
  const inDashboard = () => {
    cy.location('href').should('be', Cypress.config().baseUrl)
  }

  cy.adminLogin()

  inDashboard()

  // give ample time for the load process to complete
  // also, wait for things to become visible since all of the
  // loading is asynchronous
  cy.get('div.op-widget-horizontal-nav:visible', { timeout: 30000 })
  //  .then(($result) => {
  //  })
})
