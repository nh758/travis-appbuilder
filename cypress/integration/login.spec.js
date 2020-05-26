/// <reference types="cypress" />
Cypress.Cookies.defaults({ whitelist: ['sails.sid', 'io'] })

describe('AppBuilder login scenarios', function () {
  const username = 'admin'
  const password = 'admin'

  Cypress.Commands.add('loginByCSRF', (csrfToken) => {
    cy.request({
      method: 'POST',
      url: '/site/login',
      failOnStatusCode: false, // dont fail so we can make assertions
      form: true, // we are submitting a regular form body
      body: {
        username,
        password,
        _csrf: csrfToken // insert this as part of form body
      }
    })
  })

  // A utility function to check that we are seeing the dashboard page
  const inDashboard = () => {
    cy.location('href').should('be', Cypress.config().baseUrl)
  }

  it('loads to Sails', () => {
    cy.visit('')
    cy.title().should('include', 'Sails')
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('redirects to /site/login', () => {
    cy.clearCookie('sails.sid')
    cy.clearCookie('io')
    cy.visit('/')
    cy.location('href').should('match', /site\/login$/)
  })

  it('returns 403 status without a valid CSRF token', function () {
    // first show that by not providing a valid CSRF token
    // that we will get a 403 status code
    cy.loginByCSRF('invalid-token')
      .its('status')
      .should('eq', 403)
  })

  it('can parse token from HTML', function () {
    // if we cannot change our server code to make it easier
    // to parse out the CSRF token, we can simply use cy.request
    // to fetch the login page, and then parse the HTML contents
    // to find the CSRF token embedded in the page
    cy.request('/site/login')
      .its('body')
      .then((body) => {
      // we can use Cypress.$ to parse the string body
      // thus enabling us to query into it easily
        const $html = Cypress.$(body)
        const csrf = $html.find('input[name=_csrf]').val()

        cy.loginByCSRF(csrf)
          .then((resp) => {
            expect(resp.status).to.eq(200)
            // expect(resp.body).to.include('div.rbac-user-display')
          })
      })

    // successful "cy.request" sets all returned cookies, thus we should
    // be able to visit the protected page - we are logged in!
    cy.visit('/')

    inDashboard()
  })

  it('loads to the OpsPortal', function () {
    cy.adminLogin()

    inDashboard()

    // give ample time for the load process to complete
    // also, wait for things to become visible since all of the
    // loading is asynchronous
    cy.get('div.op-widget-horizontal-nav:visible', { timeout: 30000 })
  })
})
