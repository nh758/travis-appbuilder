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

  it('(Market Roles) creates market Roles', function () {
    // switch to Roles tab
    cy.get('li[rbac-menu="Roles"]:visible')
      .click()

    // add Architect role
    cy.get('button.rbac-role-addRole') .click()
    cy.get('input[placeholder="Role Name*"]') .click().focused().clear().type('MKT_Architect')
    cy.get('textarea[placeholder="Role Description*"]') .click().focused().clear().type('Able to build and edit the market app')

    // add various role actions

    // add Recorder role
    cy.get('button.rbac-role-addRole') .click()
    cy.get('input[placeholder="Role Name*"]') .click().focused().clear().type('MKT_Recorder')
    cy.get('textarea[placeholder="Role Description*"]') .click().focused().clear().type('Able to access the Treasury page and Market app')

    // add various role actions

    // add Treasurer role
    cy.get('button.rbac-role-addRole') .click()
    cy.get('input[placeholder="Role Name*"]') .click().focused().clear().type('MKT_Treasurer')
    cy.get('textarea[placeholder="Role Description*"]') .click().focused().clear().type('Able to access Treasury page and Market app')

    // add various role actions
  })



  Cypress.Commands.add('createUser', (user) => {

    //start off by making sure the dialog box is not visible
    cy.get('div[aria-label="Add User"]:hidden')

    // click on + to add a user, and the dialog box should be visible
    // <button type="button" class="btn op-btn btn-primary rbac-user-addUser"> <span class="glyphicon glyphicon-plus-sign"></span> </button>    
    cy.get('button.rbac-user-addUser').click()

    //<div class="webix_view webix_window" role="dialog" tabindex="0" aria-label="Add User" />
    //<input id="1590136292123" type="text" value="" style="width: 184px; text-align: left;">
    cy.get('div[aria-label="Add User"]:visible').within(() => {

      // type username
      cy.contains('label', 'Username').parent().find('input').focus().clear().type(user.name)
      // type password
      cy.contains('label', 'Password').parent().find('input').focus().clear().type(user.password)
      // check 'active'
      cy.get('button[role="checkbox"]').click()
      // hit submit 
      cy.get('button.webix_button').first().click()

      cy.wait(500)
    })

  })


  it.skip('(Market Users) Create users', function () {

    // Matthew (pw: QWERTYUI) as Tax Collector
    // Luke (pw: 12345678) as Recorder
    // Judas (pw: qwertyui) as Treasurer
    // Cyrus (pw: !@#$%^&* ) as Architect

    // scroll to top of viewport, and switch to Roles tab
    //cy.get('div.op-stage').scrollTo('top')
    cy.get('li[rbac-menu="Users"]').scrollIntoView().click()

    cy.createUser({ name: 'Matthew', password: 'QWERTYUI' })
    cy.createUser({ name: 'Luke',    password: '12345678' })
    cy.createUser({ name: 'Judas',   password: 'qwertyui' })
    cy.createUser({ name: 'Cyrus',   password: '!@#$%^&*' })


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

  it('(Market roles) deletes market roles', function () {
    // scroll to top of viewport, and switch to Roles tab
    cy.get('div.op-stage').scrollTo('top')
    cy.get('li[rbac-menu="Roles"]:visible').click()

    // In order to delete, first filter roles by our prefix "MKT_"
    //<input placeholder="search for roles" id="1590122082717" type="text" value="" style="width: 440.5px; text-align: left;">
    cy.get('input[placeholder="search for roles"]') .clear() .focused() .type("MKT_")

    // Click on the first trashcan available, and click OK
    //<div role="gridcell" aria-rowindex="1" aria-colindex="4" class="webix_cell"><span class="trash"><span class="webix_icon wxi-trash"></span></span></div>
    //cy.get('div[aria-colindex="4"]:visible').first() .click()
    cy.get('span.trash:visible').first() .click()
    cy.get('div[aria-label="OK"]:visible') .contains('OK') .click()
    cy.get('div[aria-label="OK"]').should('not.exist') 
      .wait(350)

    cy.get('span.trash:visible').first() .click()
    cy.get('div[aria-label="OK"]:visible') .contains('OK') .click()
    cy.get('div[aria-label="OK"]').should('not.exist') 
      .wait(350)

    cy.get('span.trash:visible').first() .click()
    cy.get('div[aria-label="OK"]:visible') .contains('OK') .click()
    cy.get('div[aria-label="OK"]').should('not.exist') 
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
