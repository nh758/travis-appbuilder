/// <reference types="cypress" />
Cypress.Cookies.defaults({ whitelist: ['sails.sid', 'io'] })

describe('Market simulation', function () {
  // ========================================================================
  // before() - perform a login ONCE prior to beginning the entire test suite
  // ========================================================================
  before(() => {
    cy.performLogin('admin', 'admin')
  })

  // ==========
  // Test suite
  // ==========

  it('(Market Roles) creates market roles', function () {
    // switch to Roles tab
    cy.get('li[rbac-menu="Roles"]:visible')
      .click()

    // add Architect, Recorder, Treasurer roles
    cy.addRole('MKT_Architect', 'Able to build and edit the market app')
    // cy.addRole('MKT_Recorder', 'Able to access the Treasury page and Market app')
    // cy.addRole('MKT_Treasurer', 'Able to access Treasury page and Market app')

    // add various role actions
  })

  it.skip('(Market Users) Create users', function () {
    // scroll to top of viewport, and switch to Roles tab
    // cy.get('div.op-stage').scrollTo('top')
    cy.get('li[rbac-menu="Users"]').scrollIntoView().click()

    // Matthew (pw: QWERTYUI) as Tax Collector
    // Luke (pw: 12345678) as Recorder
    // Judas (pw: qwertyui) as Treasurer
    // Cyrus (pw: !@#$%^&* ) as Architect
    cy.addUser({ name: 'Matthew', password: 'QWERTYUI' })
    cy.addUser({ name: 'Luke', password: '12345678' })
    cy.addUser({ name: 'Judas', password: 'qwertyui' })
    cy.addUser({ name: 'Cyrus', password: '!@#$%^&*' })
  })

  it('(Market App) creates Market app', function () {
    /// / select leftmenu -> AppBuilder
    cy.appSelect('li[area="site-default-appbuilder"]')

    // Click on "Add new applicaton"
    cy.get('button').contains('Add new application').click()

    cy.get('div[role="form"]:visible').within(() => {
      // Fill in application name
      cy.contains('div', 'Name').find('input').click().focused().type('Market')

      // Fill in application description
      cy.contains('div', 'Description').find('textarea').click().focused()
        .type('A Market simulation app used for testing AppBuilder functionality')

      // click Save
      cy.contains('button', 'Save').click()
    })
  })

  it('(Market App) builds the Market app', function () {
    // Login as user Cyrus
    // Create new AppBuilder app: Market

    // click on the newly created App to beging modifying it
    cy.contains('div.ab-app-list-item', 'Market')
      .click()

    // Create market Objects (** be sure use all available data types at least once)
    // Vendor: multiple vendors
    // Goods: names of goods
    // Inventory: number of Goods, associated with Vendor, with prices
    // Transactions: each time a Vendor sells something from Inventory

    // make sure we're on the "Objects" tab
    cy.contains('div.webix_tree_item', 'Objects')
      .should('have.attr', 'aria-selected', 'true')

    // ------------------------------------------
    // Add a new Vendor object
    //    Name         : short string value
    //    Address      : short string value
    //    NationalID   : short string value
    cy.addObject('Vendor')
    cy.addObjectColumnString('Name')
    cy.addObjectColumnString('Address')
    cy.addObjectColumnString('NationalID')

    // ------------------------------------------
    // Add a new Goods object
    //    Name            : short string value
    //    WholesalePrice  : Number
    cy.addObject('Goods')
    cy.addObjectColumnString('Name')
    cy.addObjectColumnNumber('WholesalePrice')

    // ------------------------------------------
    // Add a new Inventory object
    //    *Goods
    //    *Vendor
    //    QuantityInStock  : Number
    cy.addObject('Inventory')
    cy.addObjectColumnNumber('QuantityInStock')
    cy.addObjectRelation('Goods') // one Inventory to one Goods
    cy.addObjectRelation('Vendor') // one Inventory to one Vendor

    // ------------------------------------------
    // Add a new Transaction object
    //    *Inventory ??
    //    Date
    //    Time
    //    QuantitySold
    //    PriceSold
    cy.addObject('Transaction')
    cy.addObjectColumnNumber('QuantitySold')
    cy.addObjectColumnNumber('PriceSold')

    // Create Queries
    // VendorInventory Vendors with Inventory
    // VendorTranscationsYesterday Vendors with Transactions yesterday
    // OutOfInventory Goods that do not appear in any Inventory
    // All of the inventory for a single Vendor

    // build queries
    cy.contains('div.webix_tree_item', '*Queries')
      .click()

    // Create Data Collection
    // ?

    // create data collections
    cy.contains('div.webix_tree_item', '*Data Collections')
      .click()

    // Create Interface
    // Main page
    // Vendor listing / adding page
    // Goods listing / adding page
    // Inventory listing / adding page
    // Transactions listing / adding page
    // Treasury page

    // build an interface
    cy.contains('div.webix_tree_item', 'Interface')
      .click()

    // Add AppBuilder Roles & Scopes
    // Add a Treasury scope to the Treasury page (or object?), assigned to the Treasurer role
    // Add a Market scope to the Main, Vendor, Goods, Inventory, and Transaction pages
    // Create a “Regional Treasurer” Role, and have the Scopes for Transactions include a condition Like “where transaction.buyer is in Query (Users in My City)”
    // Logout Cyrus

    // click out of the builder interface back to the list of applications
    cy.contains('button.webix_button', 'Back to Applications page')
      .click()

    cy.get('div.ab-app-select-list')
      .contains('div.ab-app-list-item', 'Market')
  })

  it('(Market App) uses the Market app', function () {
  // Login as Luke
  //
  // Populate test data via created pages
  // add 4 Vendors : Mary, Martha, Peter, Andrew
  // add 4 Goods : fish, bread, eggs, chicken, pork
  // add Inventory per Vendor
  // Mary:  5 bread @ 2 denarii , 2 fish @ 10 denarii
  // Martha: 7 bread @ 4 denarii, 2 fish @ 8 denarii
  // Peter: 24 eggs @ 1 denarii
  // Andrew: 8 chicken @ 15 denarii
  // add some Transactions
  // …
  // ...
  //
  // run Queries and verify output
  // ...
  //
  // Check out page access as Luke:
  // Successful access to the Market
  // Unsuccessful access to Treasury
  //
  // Use Swicheroo to Judas
  // Successful access another page in the Market
  // Successful access the Treasury page
  // Can only see transactions where transaction.buyer ==Judas and Vitruvius
  //
  // Use Switcheroo to Matthew
  // Unsuccessful access to the Market
  // Successful access the Treasury page
  // Can only see transactions where transaction.buyer == Matthew and Luke
  //
  // Logout Matthew
  })

  it('(Market App) deletes Market app', function () {
    // click on the gear, for Market
    cy.get('div.ab-app-select-list')
      .contains('div.ab-app-list-item', 'Market').find('div.ab-app-list-edit').click()

    // click on "Delete"
    cy.get('div.webix_win_body')
      .contains('div.webix_list_item:visible', 'Delete').click()

    // click on "Delete application -> Delete"
    cy.get('div[aria-label="Delete application"]:visible').find('div[aria-label="Delete"]').click()
  })

  it('(Market Roles) deletes market roles', function () {
    // select leftmenu -> AppBuilder
    cy.appSelect('li[area="site-default-admin"]')

    // scroll to top of viewport, and switch to Roles tab
    cy.get('div.op-stage').scrollTo('top')
    cy.get('li[rbac-menu="Roles"]:visible').click()

    // In order to delete, first filter roles by our prefix "MKT_"
    // <input placeholder="search for roles" id="1590122082717" type="text" value="">
    cy.get('input[placeholder="search for roles"]').clear().focused().type('MKT_')

    // Click on the first trashcan available, and click OK
    cy.deleteRole()
    // cy.deleteRole()
    // cy.deleteRole()
  })
})
