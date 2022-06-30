
describe("swap", () => {
  it("syncs the url params to the sell and buy token selects", () => {
    cy.visit("/swap");

    cy.findByLabelText("Sell:").select("DAI");
    cy.url().should("include", "/swap?network=ethereum&sell=dai&buy=weth");

    cy.findByLabelText("Buy:").select("MATIC");
    cy.url().should("include", "/swap?network=ethereum&sell=dai&buy=matic");
  });

  it("should visit handle onchange stuff", () => {
    cy.visit("/swap");
    cy.findByLabelText("Buy Amount").type("1");

    cy.intercept(
      "GET",
      "https://api.0x.org/swap/v1/quote?sellToken=usdc&buyToken=weth&buyAmount=1000000000000000000",
      { fixture: 'swap-buy-quote.json' }
    );

    cy.findByLabelText("Sell Amount").should("have.value", "1212.88499");
  });
});

// TODO:
// cy.findByRole("button", { name: /Place Order/i }).click();
// cy.findByRole("button", { name: /Connect Wallet/i }).click();
