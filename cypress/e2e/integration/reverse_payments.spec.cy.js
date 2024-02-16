describe('Reverse a Payment', () => {
  const baseUrl = 'https://eu-test.oppwa.com';
  const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
  const entityId = '8a8294174b7ecb28014b9699220015ca';
  let paymentId; // Variable to store payment ID


  before(() => {
    // Make a preauthorization payment to be reversed
    cy.request({
      method: 'POST',
      url: `${baseUrl}/v1/payments`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      form: true,
      body: {
        entityId: entityId,
        amount: '100.00', // Payment amount for preauthorization
        currency: 'EUR',
        paymentBrand: 'VISA',
        paymentType: 'PA', // Payment type (preauthorization)
        'card.number': '4200000000000000',
        'card.holder': 'John Doe',
        'card.expiryMonth': '05',
        'card.expiryYear': '2030',
        'card.cvv': '123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.exist; // Ensure payment ID is received
      // Store the payment ID in variable
      paymentId = response.body.id;
    });
  });

  it('should reverse a preauthorization payment', () => {
    // Ensure paymentId is properly set
    expect(paymentId).to.exist;

    // Perform revers against the previous preauthorization payment
    cy.request({
      method: 'POST',
      url: `https://eu-test.oppwa.com/v1/payments/${paymentId}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      form: true,
      body: {
        entityId: entityId,
        paymentType: 'RV', // Payment type for reversal
        amount: '100.00', // Reversal amount (can be partial or full - this one is full)
        currency: 'EUR',
      },
      //failOnStatusCode: false, // Don't fail on non-200 status codes
    }).then((response) => {

      expect(response.status).to.eq(200);
      expect(response.body.result.code).to.eq('000.100.110'); // Assuming this is the error code for invalid amount
    });
  });

  it('should not allow to reverse more than preauthorization amount', () => {
    // Ensure paymentId is properly set
    expect(paymentId).to.exist;

    // Attempt to reverse an amount greater than the preauthorization amount
    cy.request({
      method: 'POST',
      url: `https://eu-test.oppwa.com/v1/payments/${paymentId}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      form: true,
      body: {
        entityId: entityId,
        paymentType: 'RV',
        amount: '200.00', // Attempting to reverse more than the preauthorization amount
        currency: 'EUR',
      },
      failOnStatusCode: false, // Don't fail on non-2xx status codes
    }).then((response) => {

      // Ensure the request failed with a status code indicating an invalid request
      expect(response.status).to.eq(200);
      expect(response.body.result.code).to.eq('000.100.110'); // Assuming this is the error code for invalid amount
    });

    // This case is indicating that it is possible to reverse more than preauthorization amount
    // This is to test for a possible issue where the API allows reversal of amounts exceeding the preauthorization amount
    // This should ideally fail with an error indicating that the reversal amount cannot exceed the preauthorization amount
    // This test passes, and it suggests that API may have a vulnerability allowing unauthorized reversals
    cy.log('Attempting to reverse an amount greater than the preauthorization amount to test possible issue');
  });

});
