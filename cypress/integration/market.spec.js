/// <reference types="cypress" />
Cypress.Cookies.defaults({ whitelist: ['sails.sid', 'io'] })

describe('AppBuilder Market simulation', function () {

  // ========================================================================
  // before() - perform a login ONCE prior to beginning the entire test suite
  // ========================================================================
  before(() => {
    cy.performLogin('admin', 'admin')
  })

   
  // ====================================================
  // Helper commands - reduce redundancy inside the tests
  // ====================================================
  Cypress.Commands.add('appSelect', (appSelector) => {

    // Click on "Menu"
    cy.get('#op-menu-widget') .should('not.be.visible')
    cy.get('div#op-masthead-menu') .contains('Menu') .click()
    cy.get('#op-menu-widget') .invoke('attr', 'style', 'transition: left 0.2s ease 0s; left:0px')
    cy.get('#op-menu-widget') .should('be.visible')

    // Click on "AppBuilder"
    //cy.get('li[area="site-default-appbuilder"]') .click()
    cy.get(appSelector) .click()
    //WORKAROUND: the following invoke() is to help with flaky behavior when running headless tests
    // for some reason the menu does not hide itself only when running in this mode 
    cy.get('#op-menu-widget') .invoke('attr', 'style', 'transition: left 0.2s ease 0s;')
    cy.get('body') .invoke('attr', 'class', '')
    cy.get('body') .invoke('attr', 'style', '')
    cy.get('#op-menu-widget') .should('not.be.visible')
    //WORKAROUND
  })

  Cypress.Commands.add('createUser', (user) => {
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

      cy.wait(500)
    })
  })

  Cypress.Commands.add('deleteRole', () => {
    cy.get('span.trash:visible').first().click()
    cy.get('div[aria-label="OK"]:visible').contains('OK').click()
    cy.get('div[aria-label="OK"]').should('not.exist')
  })

  Cypress.Commands.add('addObject', (objectName) => {
    cy.contains('button.webix_button', 'Add new object') .click()

    cy.contains('div.webix_win_content', 'Add new object')
      .find('input[placeholder="Object name"]') .click() .focused() .type(objectName)

    cy.contains('button.webix_button', '*Add Object') .click()
    cy.contains('div.ab-object-list-item', objectName)
  })

  Cypress.Commands.add('addObjectColumnString', (columnName) => {

    cy.contains('button.webix_button', 'Add new column') .click()
    //cy.contains('div[aria-label="*Field type"]', '*Single line text').click()
    cy.contains('div.webix_form', '*short string value').within(() => {
      cy.contains('div.webix_el_box', 'Label')
        .find('input') .click() .focused() .type(columnName)
      //cy.contains('div.webix_el_box', 'Field Name')
      //  .find('input') .click() .focused() .type('Name')
    })
    cy.contains('button.webix_button', 'Add Column') .scrollIntoView() .click()

  })

  Cypress.Commands.add('addObjectColumnNumber', (columnName) => {
    cy.contains('button.webix_button', 'Add new column') .click()
    cy.contains('div[aria-label="*Field type"]', '*Single line text').click()
    cy.contains('div.webix_list_item', '*Number').click()

    //make sure we're on the correct page of the webix multiview
    cy.contains('div.webix_form', '*A Float or Integer Value').within(() => {
   
      cy.contains('div.webix_el_box:visible', 'Label')
        .find('input') .click() .focused() .type(columnName)
      //cy.contains('div.webix_el_box', 'Field Name')
      //  .find('input') .click() .focused() .type(columnName)
    })

    cy.contains('button.webix_button', 'Add Column') .scrollIntoView() .click()
  })

  // ==========
  // Test suite
  // ==========

  it('(Market Roles) creates market Roles', function () {
    // switch to Roles tab
    cy.get('li[rbac-menu="Roles"]:visible')
      .click()

    // add Architect role
    cy.get('button.rbac-role-addRole').click()
    cy.get('input[placeholder="Role Name*"]').click().focused().clear().type('MKT_Architect')
    cy.get('textarea[placeholder="Role Description*"]').click().focused().clear().type('Able to build and edit the market app')

    // add various role actions

    // add Recorder role
    cy.get('button.rbac-role-addRole').click()
    cy.get('input[placeholder="Role Name*"]').click().focused().clear().type('MKT_Recorder')
    cy.get('textarea[placeholder="Role Description*"]').click().focused().clear().type('Able to access the Treasury page and Market app')

    // add various role actions

    // add Treasurer role
    cy.get('button.rbac-role-addRole').click()
    cy.get('input[placeholder="Role Name*"]').click().focused().clear().type('MKT_Treasurer')
    cy.get('textarea[placeholder="Role Description*"]').click().focused().clear().type('Able to access Treasury page and Market app')

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
    cy.createUser({ name: 'Matthew', password: 'QWERTYUI' })
    cy.createUser({ name: 'Luke', password: '12345678' })
    cy.createUser({ name: 'Judas', password: 'qwertyui' })
    cy.createUser({ name: 'Cyrus', password: '!@#$%^&*' })

    // cy.get('li[rbac-menu="Roles"]:visible').click()
    // cy.get('button.rbac-role-addRole').click()
    // cy.get('input[placeholder="Enter a Name*"]').clear().type('Market')
  })

  it('(Market App) creates Market app', function () {

    cy.appSelect('li[area="site-default-appbuilder"]')
    //// Click on "Menu"
    //cy.get('#op-menu-widget') .should('not.be.visible')
    //cy.get('div.op-masthead') .contains('Menu') .click()
    //cy.get('#op-menu-widget') .should('be.visible')

    //// Click on "AppBuilder"
    //cy.get('li[area="site-default-appbuilder"]') .click()
    ////WORKAROUND: the following invoke() is to help with flaky behavior when running headless tests
    //// for some reason the menu does not hide itself only when running in this mode 
    //cy.get('#op-menu-widget') .invoke('attr', 'style', 'transition: left 0.2s ease 0s;')
    //cy.get('#op-menu-widget') .should('not.be.visible')

    // Click on "Add new applicaton"
    cy.get('button') .contains('Add new application') .click()

    cy.get('div[role="form"]:visible').within(() => {

      // Fill in application name
      cy.contains('div', 'Name') .find('input') .click() .focused() .type('Market')

      // Fill in application description
      cy.contains('div', 'Description') .find('textarea') .click() .focused()
        .type('A Market simulation app used for testing AppBuilder functionality')

      // click Save
      cy.contains('button', 'Save') .click()
    })

  })

  it('(Market App) builds the Market app', function () {     

    //Login as user Cyrus
    //Create new AppBuilder app: Market

    // click on the newly created App to beging modifying it 
    cy.contains('div.ab-app-list-item', 'Market')
      .click()

    //Create market Objects (** be sure use all available data types at least once)
    //Vendor: multiple vendors
    //Goods: names of goods
    //Inventory: number of Goods, associated with Vendor, with prices
    //Transactions: each time a Vendor sells something from Inventory

    // make sure we're on the "Objects" tab
    cy.contains('div.webix_tree_item', 'Objects')
      .should('have.attr', 'aria-selected', 'true')

    //------------------------------------------
    // Add a new Vendor object
    //    Name         : short string value
    //    Address      : short string value
    //    NationalID   : short string value
    cy.addObject("Vendor")

    cy.addObjectColumnString('Name')
    cy.addObjectColumnString('Address')
    cy.addObjectColumnString('NationalID')

    //------------------------------------------
    // Add a new Goods object
    //    Name            : short string value
    //    WholesalePrice  : Number
    cy.addObject("Goods")

    cy.addObjectColumnString('Name')
    cy.addObjectColumnNumber('WholesalePrice')

    //------------------------------------------
    // Add a new Inventory object
    //    *Goods
    //    *Vendor
    //    QuantityInStock  : Number
    cy.addObject("Inventory")

    cy.addObjectColumnNumber('QuantityInStock')

    //------------------------------------------
    // Add a new Transaction object
    //    *Inventory
    //    Date
    //    Time
    //    QuantitySold
    //    PriceSold
    cy.addObject("Transaction")

    //Create Queries
    //VendorInventory Vendors with Inventory
    //VendorTranscationsYesterday Vendors with Transactions yesterday
    //OutOfInventory Goods that do not appear in any Inventory
    //All of the inventory for a single Vendor

    // build queries 
    cy.contains('div.webix_tree_item', '*Queries')
      .click()

    //Create Data Collection
    //?

    // create data collections 
    cy.contains('div.webix_tree_item', '*Data Collections')
      .click()

    //Create Interface 
    //Main page
    //Vendor listing / adding page
    //Goods listing / adding page
    //Inventory listing / adding page
    //Transactions listing / adding page 
    //Treasury page

    // build an interface
    cy.contains('div.webix_tree_item', 'Interface')
      .click()

    //Add AppBuilder Roles & Scopes
    //Add a Treasury scope to the Treasury page (or object?), assigned to the Treasurer role
    //Add a Market scope to the Main, Vendor, Goods, Inventory, and Transaction pages
    //Create a “Regional Treasurer” Role, and have the Scopes for Transactions include a condition Like “where transaction.buyer is in Query (Users in My City)”
    //Logout Cyrus

    // click out of the builder interface back to the list of applications
    cy.contains('button.webix_button', 'Back to Applications page')
      .click()

    cy.get('div.ab-app-select-list') 
      .contains('div.ab-app-list-item', 'Market')

 
  })

  it('(Market App) uses the Market app', function () {     
  //Login as Luke
  //
  //Populate test data via created pages
  //add 4 Vendors : Mary, Martha, Peter, Andrew
  //add 4 Goods : fish, bread, eggs, chicken, pork
  //add Inventory per Vendor
  //Mary:  5 bread @ 2 denarii , 2 fish @ 10 denarii   
  //Martha: 7 bread @ 4 denarii, 2 fish @ 8 denarii
  //Peter: 24 eggs @ 1 denarii
  //Andrew: 8 chicken @ 15 denarii
  //add some Transactions
  //…
  //... 
  //
  //run Queries and verify output
  //...
  //
  //Check out page access as Luke:
  //Successful access to the Market
  //Unsuccessful access to Treasury
  //
  //Use Swicheroo to Judas
  //Successful access another page in the Market
  //Successful access the Treasury page
  //Can only see transactions where transaction.buyer ==Judas and Vitruvius
  //
  //Use Switcheroo to Matthew
  //Unsuccessful access to the Market
  //Successful access the Treasury page
  //Can only see transactions where transaction.buyer == Matthew and Luke
  //
  //Logout Matthew
  })



  it('(Market App) deletes Market app', function () {

    // click on the gear, for Market
    cy.get('div.ab-app-select-list') 
      .contains('div.ab-app-list-item', 'Market') .find('div.ab-app-list-edit') .click()

    // click on "Delete"
    cy.get('div.webix_win_body')
      .contains('div.webix_list_item:visible', 'Delete') .click()

      // click on "Delete application -> Delete"
      cy.get('div[aria-label="Delete application"]:visible') .find('div[aria-label="Delete"]') .click()
  })

  it('(Market Roles) deletes market roles', function () {

    cy.appSelect('li[area="site-default-admin"]')

    // Click on "AppBuilder"
    //cy.get('ul#op-list-menu') .contains('li','Administration') .scrollIntoView() .click()
    //cy.get('ul#op-list-menu') .contains('li','Administration') .scrollIntoView() .click( {force:true} )

    // scroll to top of viewport, and switch to Roles tab
    cy.get('div.op-stage').scrollTo('top')
    cy.get('li[rbac-menu="Roles"]:visible').click()

    // In order to delete, first filter roles by our prefix "MKT_"
    // <input placeholder="search for roles" id="1590122082717" type="text" value="" style="width: 440.5px; text-align: left;">
    cy.get('input[placeholder="search for roles"]').clear().focused().type('MKT_')

    // Click on the first trashcan available, and click OK
    // <div role="gridcell" aria-rowindex="1" aria-colindex="4" class="webix_cell"><span class="trash"><span class="webix_icon wxi-trash"></span></span></div>
    // cy.get('div[aria-colindex="4"]:visible').first() .click()
    cy.deleteRole()
    //cy.get('span.trash:visible').first().click()
    //cy.get('div[aria-label="OK"]:visible').contains('OK').click()
    //cy.get('div[aria-label="OK"]').should('not.exist')
      .wait(350)

    cy.deleteRole()
    //cy.get('span.trash:visible').first().click()
    //cy.get('div[aria-label="OK"]:visible').contains('OK').click()
    //cy.get('div[aria-label="OK"]').should('not.exist')
      .wait(350)

    cy.deleteRole()
    //cy.get('span.trash:visible').first().click()
    //cy.get('div[aria-label="OK"]:visible').contains('OK').click()
    //cy.get('div[aria-label="OK"]').should('not.exist')
  })

})
