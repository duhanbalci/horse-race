// https://on.cypress.io/api

describe('Generate And Start Race', () => {
  it('should generate and start the race', () => {
    cy.viewport(1920, 1080)
    cy.visit('/')
    cy.contains('button', 'Generate Race')

    // generate race
    cy.get('button').contains('Generate Race').click()
    cy.wait(100)

    // start race
    cy.get('button').contains('Start Race').click()
    cy.wait(100)

    // should show live standings
    cy.contains('Live Standings')

    // click 150x to speed up
    cy.get('button').contains('150X').click()

    // wait until button is enabled
    cy.wait(1000 * 20)
      .get('button')
      .contains('Generate Race')
      .should('be.enabled')
  })
})
