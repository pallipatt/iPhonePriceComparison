describe("Test Suite", function () {
  it("Test 1 - verify title and store device names and values in an array", () => {
    // Declare an array to store device names and values
    const applePrice = [];

    cy.visit("http://apple.com/shop/trade-in");
    cy.xpath("//a[contains(@href,'/iphone_values')]").click();

    // XPath to select the parent elements containing device names and values
    cy.xpath("//tbody[@class='t-eyebrow-reduced']/tr")
      .each(($element, index) => {
        // Get device name and value from each row
        cy.wrap($element)
          .find("td")
          .then(($tds) => {
            const deviceName = $tds.eq(0).text().trim(); // Assuming device name is in the first column
            const deviceValue = $tds.eq(1).text().trim(); // Assuming device value is in the second column

            // Store device name and value in the applePrice array
            applePrice.push({ name: deviceName, value: deviceValue });
          });
      })
      .then(() => {
        // Log the applePrice array after all elements have been processed
        console.log("Apple Prices:", applePrice);
      });
  });
});
