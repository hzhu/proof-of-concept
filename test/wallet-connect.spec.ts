import chaiUrl from "chai-url";
import puppeteer from "puppeteer";
import { expect, use as chaiUse } from "chai";
import { getDocument, queries } from "pptr-testing-library";
import * as dappeteer from "@chainsafe/dappeteer";
import type { Browser, Page } from "puppeteer";
import type { Dappeteer } from "@chainsafe/dappeteer";

chaiUse(chaiUrl);

const { getByText, findAllByText } = queries;

let metamask: Dappeteer;
let browser: Browser;
let testPage: Page;

describe("wallet connection", () => {
  before(async () => {
    browser = await dappeteer.launch(puppeteer, {
      metamaskVersion:
        process.env.METAMASK_VERSION || dappeteer.RECOMMENDED_METAMASK_VERSION,
    });

    metamask = await dappeteer.setupMetamask(browser, {
      seed: "pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog",
      password: "password1234",
    });

    testPage = await browser.newPage();
    await testPage.goto("http://localhost:3000/swap");
  });

  it("should connect to ethereum", async () => {
    (expect(testPage.url()).to.have as any).path("/swap");

    const document = await getDocument(testPage);
    const connect = await findAllByText(document, "Connect Wallet");
    await connect[0].click();
    await pause(0.1);
    const metaMaskBtn = await getByText(document, /MetaMask/i);
    await metaMaskBtn.click();
    await pause(0.1);
    await metamask.approve();
    await metamask.page.close();
    await testPage.waitForNavigation();
    await getByText(document, "Ethereum");

    (expect(testPage.url()).to.have as any).path("/swap?network=ethereum");
  });

  after(async () => {
    await browser.close();
  });
});

function pause(seconds: number): Promise<void> {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}
