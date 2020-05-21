/// <reference types="cypress" />

Cypress.Cookies.defaults({
  whitelist: ['sails.sid', 'io']
})

describe('AppBuilder Market simulation', function () {

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

  // A utility function to check that we are seeing the dashboard page
  const inDashboard = () => {
    cy.location('href').should('be', Cypress.config().baseUrl)
  }

  it('(Login) redirects to /site/login', () => {
    cy.clearCookie('sails.sid')
    cy.clearCookie('io')
    cy.visit('/')
    cy.location('href').should('match', /site\/login$/)
  })

  it('(Login) 403 status without a valid CSRF token', function () {
    // first show that by not providing a valid CSRF token
    // that we will get a 403 status code
    cy.loginByCSRF('invalid-token')
      .its('status')
      .should('eq', 403)
  })

  it('(Login) can parse token from HTML', function () {
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

  it('(Login) loads to the OpsPortal', function () {
    cy.adminLogin()

    inDashboard()

    // give ample time for the load process to complete
    // also, wait for things to become visible since all of the
    // loading is asynchronous
    cy.get('div.op-widget-horizontal-nav:visible', { timeout: 30000 })
    //  .then(($result) => {
    //  })
  })

  it('(OpsPortal) loads to the Users tab', function () {

    cy.get('li[rbac-menu="Users"]:visible')
      .should('have.class', 'selected')
    // give ample time for the load process to complete
    // also, wait for things to become visible since all of the
    // loading is asynchronous
    //cy.get('div.op-widget-horizontal-nav :visible', { timeout: 30000 })
    //  .then(($result) => {
    //    cy.get('li[rbac-menu="Users"]:visible')
    //      .should('have.class', 'selected')
    //  })
  })


  it('(OpsPortal) selects the Roles tab', function () {
    cy.get('li[rbac-menu="Roles"]:visible')
      .should('not.have.class', 'selected')
      .click()
      .should('have.class', 'selected')
  })

  it('(OpsPortal) selects the Scopes tab', function () {
    cy.get('li[rbac-menu="Scopes"]:visible')
      .should('not.have.class', 'selected')
      .click()
      .should('have.class', 'selected')
  })

  it('(Market scenario) creates market Roles', function () {
    // switch to Roles tab
    cy.get('li[rbac-menu="Roles"]:visible')
      .click()

    // add Architect role
    cy.get('button.rbac-role-addRole')
      .click()
    cy.get('input[placeholder="Role Name*"]')
      .click().focused().clear().type('Architect')
    cy.get('textarea[placeholder="Role Description*"]')
      .click().focused().clear().type('Able to build and edit the market app')

    // add various role actions

    // add Recorder role
    cy.get('button.rbac-role-addRole')
      .click()
    cy.get('input[placeholder="Role Name*"]')
      .click().focused().clear().type('Recorder')
    cy.get('textarea[placeholder="Role Description*"]')
      .click().focused().clear().type('Able to access the Treasury page and Market app')

    // add various role actions

    // add Treasurer role
    cy.get('button.rbac-role-addRole')
      .click()
    cy.get('input[placeholder="Role Name*"]')
      .click().focused().clear().type('Treasurer')
    cy.get('textarea[placeholder="Role Description*"]')
      .click().focused().clear().type('Able to access Treasury page and Market app')

    // add various role actions
  })

  Cypress.Commands.add('deleteRole', (roleToDelete) => {
    cy.contains('div[aria-colindex="1"]', roleToDelete)
      .then(($element) => {
        const selector = 'div[aria-colIndex="4"][aria-rowIndex="' + $element.attr('aria-rowindex') + '"]:visible'

        cy.get(selector)
          .click()

        cy.get('div[aria-label="OK"]')
          .contains('OK')
          .click()
      })
  })

  //const listOfIds = ['#first_id', '#second_id']
  //listOfIds.forEach(id => cy.get(id).click())

  function getIds() {
     let items = []
     return new Cypress.Promise(resolve => {
        cy.get('div[aria-colindex="1"]')
           .each($element =>
              cy.wrap($element)
                  .log($element)
//                .invoke('click')
                .then(id => items.push(id))
           )
           .then(() => resolve(items))
     })
  }


  it('(Market scenario) deletes market roles: Architect', function () {
    // scroll to top of viewport, and switch to Roles tab
    cy.get('div.op-stage').scrollTo('top')
    cy.get('li[rbac-menu="Roles"]:visible').click()

    getIds();
    //cy.deleteRole('Architect')

    cy.get('div[aria-colindex="1"]').contains('Architect')
    .then(($element) => {
            const selector = 'div[aria-colIndex="4"][aria-rowIndex="' + $element.attr('aria-rowindex') + '"]:visible';
            cy.get( selector )
              .click()
    })
    cy.get('div[aria-label="OK"]') .contains('OK') .click()
  })

  it('(Market scenario) deletes market Roles 2', function () {
    // scroll to top of viewport, and switch to Roles tab
    // cy.get('div.op-stage') .scrollTo('top')
    // cy.get('li[rbac-menu="Roles"]:visible') .click()

    //cy.deleteRole('Recorder')

    cy.wait(500)
    cy.get('div[aria-colindex="1"]').contains('Recorder')
    .then(($element) => {
            const selector = 'div[aria-colIndex="4"][aria-rowIndex="' + $element.attr('aria-rowindex') + '"]:visible';
            cy.get( selector )
              .click()
    })
    cy.get('div[aria-label="OK"]') .contains('OK') .click()

  })

  it('(Market scenario) deletes market Roles 3', function () {
    // scroll to top of viewport, and switch to Roles tab
    // cy.get('div.op-stage') .scrollTo('top')
    // cy.get('li[rbac-menu="Roles"]:visible') .click()

    //cy.deleteRole('Treasurer')

    cy.wait(500)
    cy.get('div[aria-colindex="1"]').contains('Treasurer')
    .then(($element) => {
            const selector = 'div[aria-colIndex="4"][aria-rowIndex="' + $element.attr('aria-rowindex') + '"]:visible';
            cy.get( selector )
              .click()
    })
    cy.get('div[aria-label="OK"]') .contains('OK') .click()
  })

  // cy.deleteRole('Architect')
  // cy.deleteRole('Recorder')
  // cy.deleteRole('Treasurer')

  //    //switch to Roles tab
  //    cy.get('div.op-stage')
  //        .scrollTo('top')
  //
  //    cy.contains('div[aria-colindex="1"]', 'Architect')
  //    .then(($element) => {
  //
  //            const index = $element.attr('aria-rowindex');
  //            const selector = 'div[aria-colIndex="4"][aria-rowIndex="' + index + '"]:visible';
  //            const $object = Cypress.$(selector);
  //            cy.get($object).click()
  //
  //    })
  //
  //  })

  it('(Market scenario) create roles', function () {
    //    cy.get('li[rbac-menu="Roles"]:visible')
    //        .click()
    //
    //    cy.get('button.rbac-role-addRole')
    //        .click()
    //
    //    cy.get('input[placeholder="Enter a Name*"]')
    //  .clear()
    //  .type('Market')
  })

  it('(Market scenario) creates City scope', function () {
    //    cy.get('button.rbac-scope-addScope')
    //        .click()
    //
    //    cy.get('input[placeholder="Enter a Name*"]')
    //  .type('Market')
    //
    //
    //    cy.get('textarea[placeholder="Scope Description*"]')
    //  .type('Scope for use with the Market app')
    //
    //    cy.get('button:contains("Save")')
    //  .click()
  })

  // it('strategy #2: parse token from response headers', function () {
  //  // if we embed our csrf-token in response headers
  //  // it makes it much easier for us to pluck it out
  //  // without having to dig into the resulting HTML
  //  cy.request('/site/login')
  //  .its('headers')
  //  .then((headers) => {
  //    const csrf = headers['x-csrf-token']

  //    cy.loginByCSRF(csrf)
  //    .then((resp) => {
  //      expect(resp.status).to.eq(200)
  //      //expect(resp.body).to.include('<h2>dashboard.html</h2>')
  //    })
  //  })

  //  visitDashboard()
  // })

  // it('strategy #3: expose CSRF via a route when not in production', function () {
  //  // since we are not running in production we have exposed
  //  // a simple /csrf route which returns us the token directly
  //  // as json
  //  cy.request('/csrf')
  //  .its('body.csrfToken')
  //  .then((csrf) => {
  //    cy.loginByCSRF(csrf)
  //    .then((resp) => {
  //      expect(resp.status).to.eq(200)
  //      expect(resp.body).to.include('<h2>dashboard.html</h2>')
  //    })
  //  })

  //  visitDashboard()
  // })

  // it('strategy #4: slow login via UI', () => {
  //  // Not recommended: log into the application like a user
  //  // by typing into the form and clicking Submit
  //  // While this works, it is slow and exercises the login form
  //  // and NOT the feature you are trying to test.
  //  cy.visit('/login')
  //  cy.get('input[name=username]').type(username)
  //  cy.get('input[name=password]').type(password)
  //  cy.get('form').submit()
  //  inDashboard()
  // })
})
