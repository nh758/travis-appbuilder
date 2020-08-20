/// <reference types="cypress" />
Cypress.Cookies.defaults({ preserve: ['sails.sid', 'io'] })

describe('OpsPortal tests', function () {
  before(() => {
    cy.performLogin('admin', 'admin')
  })

  it('loads to the Users tab', function () {
    cy.get('li[rbac-menu="Users"]:visible')
      .should('have.class', 'selected')
    // give ample time for the load process to complete
    // also, wait for things to become visible since all of the
    // loading is asynchronous
    // cy.get('div.op-widget-horizontal-nav :visible', { timeout: 30000 })
    //  .then(($result) => {
    //    cy.get('li[rbac-menu="Users"]:visible')
    //      .should('have.class', 'selected')
    //  })
  })

  it('can select the Roles tab', function () {
    cy.get('li[rbac-menu="Roles"]:visible')
      .should('not.have.class', 'selected')
      .click()
      .should('have.class', 'selected')
  })

  it('can select the Scopes tab', function () {
    cy.get('li[rbac-menu="Scopes"]:visible')
      .should('not.have.class', 'selected')
      .click()
      .should('have.class', 'selected')
  })
})
