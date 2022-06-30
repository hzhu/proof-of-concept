describe("smoke tests", () => {
  it("should visit home", () => {
    cy.visit("http://localhost:3000");
  });
  it("should visit swap", () => {
    cy.visit("/swap");
  });
});
