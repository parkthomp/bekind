describe("Page load", () => {
  it("Checks that the index page loads", () => {
    cy.visit("http://localhost:3000");
    cy.contains("BK2YN");
  });
});
