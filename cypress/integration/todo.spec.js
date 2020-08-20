/// <reference types="cypress" />
Cypress.Cookies.defaults({ preserve: ['sails.sid', 'io'] })

describe('Todo List simulation', function () {
  // ========================================================================
  // before() - perform a login ONCE prior to beginning the entire test suite
  // ========================================================================
  before(() => {
    cy.performLogin('admin', 'admin')
  })

  // ==========
  // Test suite
  // ==========

  it.skip('(Todo App) creates Todo app', function () {
    /// / select leftmenu -> AppBuilder
    cy.appSelect('li[area="site-default-appbuilder"]')

    // Click on "Add new applicaton"
    cy.get('button').contains('Add new application').click()

    cy.get('div[role="form"]:visible').within(() => {
      // Fill in application name
      cy.contains('div', 'Name').find('input').click().focused().type('Todo')

      // Fill in application description
      cy.contains('div', 'Description').find('textarea').click().focused()
        .type('A generic Todo list')

      // check off the user
      cy.get('div.ab-app-form-permission')
        .contains('div.webix_list_item', 'System Admin')
        .click()

      // click Save
      cy.contains('button', 'Save').click()
    })
  })

  it.skip('(Todo App) builds the Todo app', function () {
    // Create new AppBuilder app: Todo

    // click on the newly created App
    cy.contains('div.ab-app-list-item', 'Todo')
      .click()

    // make sure we're on the "Objects" tab
    cy.contains('div.webix_tree_item', 'Objects')
      .should('have.attr', 'aria-selected', 'true')

    // ------------------------------------------
    cy.addObject('tasks')
    cy.addObjectColumnString('description')
    cy.addObjectColumnCheckbox('done')
    //cy.addObjectColumnDate('duedate')

    // ------------------------------------------
    cy.contains('div.webix_tree_item', '*Data Collections')
      .click()

    cy.addDataCollection('tasks', 'tasks')

    cy.contains('button.webix_button', '*Add new data view').click()

    cy.contains('div.webix_win_content', '*Add new data view')
      .find('input[placeholder="*Data view name"]').click().focused().type('tasks')

    cy.contains('span.webix_placeholder', '*Select an object').click()

    cy.contains('div.webix_list_item:visible', 'tasks').click()

    cy.contains('button.webix_button', '*Add data view')
      .click()

    // ------------------------------------------
    cy.contains('div.webix_tree_item', 'Interface')
      .click()

    cy.addInterface('tasks')

    cy.contains('button.webix_button', '*Add a new page').click()

    cy.contains('div.webix_item_tab', 'Quick Page').click()

    cy.contains('select', '*[Select data collection]')
      .select('tasks')

    cy.contains('div.webix_checkbox_0:visible', 'into a Tab')
      .find('button[role="checkbox"]').click()

    cy.contains('div.webix_checkbox_0:visible', 'in a Grid')
      .find('button[role="checkbox"]').click()

    cy.contains('div.webix_checkbox_0:visible', 'A Menu button linked to a page to Add a new')
      .find('button[role="checkbox"]').click()

    cy.contains('div.webix_checkbox_0:visible', 'Edit selected')
      .scrollIntoView()
      .find('button[role="checkbox"]').click()

    cy.contains('div.webix_checkbox_0:visible', 'View details of')
      .find('button[role="checkbox"]').click()

    cy.get('div.webix_layout_line[view_id="$layout151"]')
      .contains('button.webix_button:visible', 'Add').click()

    // click out of the builder interface back to the list of applications
    cy.contains('button.webix_button', 'Back to Applications page')
      .click()

    cy.get('div.ab-app-select-list')
      .contains('div.ab-app-list-item', 'Todo')
  })

  it.skip('(Todo App) uses the Todo app', function () {
    /// / select leftmenu -> AppBuilder
    cy.appSelect('li[area="ab-todo"]')
  })

  it.skip('(Todo App) deletes Todo app', function () {
    /// / select leftmenu -> AppBuilder
    cy.appSelect('li[area="site-default-appbuilder"]')

    // click on the gear, for Market
    cy.get('div.ab-app-select-list')
      .contains('div.ab-app-list-item', 'Todo').find('div.ab-app-list-edit').click()

    // click on "Delete"
    cy.get('div.webix_win_body')
      .contains('div.webix_list_item:visible', 'Delete').click()

    // click on "Delete application -> Delete"
    cy.get('div[aria-label="Delete application"]:visible').find('div[aria-label="Delete"]').click()
  })
})
