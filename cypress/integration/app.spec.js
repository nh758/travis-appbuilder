/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
  })

  it('it loads', () => {
    cy.visit('')
    cy.title().should('include', 'Sails')
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })
})
