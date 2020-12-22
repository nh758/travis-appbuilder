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
    //cy.location('href').should('be', Cypress.config().baseUrl)
    //cy.url().should('eq', Cypress.config().baseUrl) 
  }

  cy.adminLogin()

  inDashboard()

  // give ample time for the load process to complete
  // also, wait for things to become visible since all of the
  // loading is asynchronous
  cy.get('div.op-widget-horizontal-nav:visible', { timeout: 45000 })
  //  .then(($result) => {
  //  })
})

// ====================================================
// Helper commands - reduce redundancy inside the tests
// ====================================================
Cypress.Commands.add('appSelect', (appSelector) => {
  // Click on "Menu"
  cy.get('#op-menu-widget').should('not.be.visible')
  cy.get('div#op-masthead-menu').contains('Menu').click()
  // WORKAROUND:
  cy.get('#op-menu-widget').invoke('attr', 'style', 'transition: left 0.2s ease 0s; left:0px')
  // WORKAROUND
  cy.get('#op-menu-widget').should('be.visible')

  // Click on "AppBuilder"
  // cy.get('li[area="site-default-appbuilder"]') .click()
  cy.get(appSelector).click()
  // WORKAROUND: the following invoke() is to help with flaky behavior when running headless tests
  // for some reason the menu does not hide itself only when running in this mode
  cy.get('#op-menu-widget').invoke('attr', 'style', 'transition: left 0.2s ease 0s;')
  cy.get('body').invoke('attr', 'class', '')
  cy.get('body').invoke('attr', 'style', '')
  cy.get('#op-menu-widget').should('not.be.visible')
  // WORKAROUND
})

Cypress.Commands.add('addUser', (user) => {
  // start off by making sure the dialog box is not visible
  cy.get('div[aria-label="Add User"]:hidden')

  // click on + to add a user, and the dialog box should be visible
  // <button type="button" class="btn op-btn btn-primary rbac-user-addUser"> <span class="glyphicon glyphicon-plus-sign"></span> </button>
  cy.get('button.rbac-user-addUser').click()

  // <div class="webix_view webix_window" role="dialog" tabindex="0" aria-label="Add User" />
  // <input id="1590136292123" type="text" value="" style="width: 184px; text-align: left;">
  cy.get('div[aria-label="Add User"]:visible').within(() => {
    // type username
    cy.contains('label', 'Username').parent().find('input').focus().clear().type(user.name)
    // type password
    cy.contains('label', 'Password').parent().find('input').focus().clear().type(user.password)
    // check 'active'
    cy.get('button[role="checkbox"]').click()
    // hit submit
    cy.get('button.webix_button').first().click()

    // TODO: can we re-write this to remove the wait?
    cy.wait(500)
  })
})

Cypress.Commands.add('addRole', (role, description) => {
  cy.get('button.rbac-role-addRole').click()
  cy.get('input[placeholder="Role Name*"]').click().focused().clear().type(role)
  cy.get('textarea[placeholder="Role Description*"]').click().focused().clear().type(description)
})

Cypress.Commands.add('deleteRole', () => {
  // <div role="gridcell" aria-rowindex="1" aria-colindex="4" class="webix_cell">
  //   <span class="trash"><span class="webix_icon wxi-trash">
  cy.get('span.trash:visible').first().click()
  cy.get('div[aria-label="OK"]:visible').contains('OK').click()
  cy.get('div[aria-label="OK"]').should('not.exist')
    // WORKAROUND: without this slight delay, we get intermittent failures
    // as the DOM hasn't refreshed in time after the delay
    .wait(350)
})

Cypress.Commands.add('addObject', (objectName) => {
  cy.contains('button.webix_button', 'Add new object').click()

  cy.contains('div.webix_win_content', 'Add new object')
    .find('input[placeholder="Object name"]').click().focused().type(objectName)

  // confirmation button
  cy.contains('button.webix_button', '*Add Object').click()
  cy.contains('div.ab-object-list-item', objectName)
})

Cypress.Commands.add('addObjectColumnString', (columnName) => {
  cy.contains('button.webix_button', 'Add new column').click()

  // change type to "Single line text"
  // cy.contains('div[aria-label="*Field type"]', '*Single line text').click()

  cy.contains('div.webix_form:visible', '*short string value')
    .find('input[placeholder="Label"]')
    .should('have.length', 1)
    .click()
    .type(columnName)

  cy.contains('button.webix_button', 'Add Column').scrollIntoView().click()
})

Cypress.Commands.add('addObjectColumnNumber', (columnName) => {
  cy.contains('button.webix_button', 'Add new column').click()

  // change type to "Number"
  cy.contains('div[aria-label="*Field type"]', '*Single line text').click()
  cy.contains('div.webix_list_item', '*Number').click()

  // make sure we're on the correct page of the webix multiview
  cy.contains('div.webix_form:visible', '*A Float or Integer Value')
    .find('input[placeholder="Label"]')
    .should('have.length', 1)
    .click()
    .type(columnName)

  cy.contains('button.webix_button', 'Add Column').scrollIntoView().click()
})

Cypress.Commands.add('addObjectColumnDate', (columnName) => {
  cy.contains('button.webix_button', 'Add new column').click()

  // change type to "Date"
  cy.contains('div[aria-label="*Field type"]', '*Single line text').click()
  cy.contains('div.webix_list_item', '*Date').click()

  // make sure we're on the correct page of the webix multiview
  cy.contains('div.webix_form:visible', '*Pick one from a calendar.')
    .find('input[placeholder="Label"]')
    .should('have.length', 1)
    .click()
    .type(columnName)

  cy.contains('button.webix_button', 'Add Column').scrollIntoView().click()
})

Cypress.Commands.add('addObjectColumnCheckbox', (columnName) => {
  cy.contains('button.webix_button', 'Add new column').click()

  // change type to "Number"
  cy.contains('div[aria-label="*Field type"]', '*Single line text').click()
  cy.contains('div.webix_list_item', '*Checkbox').click()

  // make sure we're on the correct page of the webix multiview
  cy.contains('div.webix_scroll_cont:visible', '*A single checkbox that can be checked or unchecked.')
    .find('input[placeholder="Label"]')
    .should('have.length', 1)
    .click()
    .type(columnName)

  cy.contains('button.webix_button', 'Add Column').scrollIntoView().click()
})

Cypress.Commands.add('addObjectRelation', (other) => {
  cy.contains('button.webix_button', 'Add new column').click()

  // change type to "Connect to another record"
  cy.contains('div[aria-label="*Field type"]', '*Single line text').click()
  cy.contains('div.webix_list_item', '*Connect to another record').click()

  // make sure we're on the correct page of the webix multiview
  cy.contains('div.webix_form:visible', '*Connect two data objects together')
    .find('input[placeholder="Label"]')
    .click()
    .type(other)

  // connect the other object
  cy.get('div.webix_win_body:visible div.webix_multiview')
    .contains('div.webix_inp_static:visible', '*Select object').click()

  cy.get('div.webix_view.webix_window.webix_popup:visible')
    .contains('div.webix_list_item:visible', other).click()

  cy.contains('button.webix_button', 'Add Column').scrollIntoView().click()
})

Cypress.Commands.add('addDataCollection', (dataCollection, object) => {
  // cy.contains('button.webix_button', 'Add new object') .click()

  // cy.contains('div.webix_win_content', 'Add new object')
  //  .find('input[placeholder="Object name"]') .click() .focused() .type(objectName)

  /// / confirmation button
  // cy.contains('button.webix_button', '*Add Object') .click()
  // cy.contains('div.ab-object-list-item', objectName)
})

Cypress.Commands.add('addInterface', (interfaceName, dataCollection) => {
  // cy.contains('button.webix_button', 'Add new object') .click()

  // cy.contains('div.webix_win_content', 'Add new object')
  //  .find('input[placeholder="Object name"]') .click() .focused() .type(objectName)

  /// / confirmation button
  // cy.contains('button.webix_button', '*Add Object') .click()
  // cy.contains('div.ab-object-list-item', objectName)
})
