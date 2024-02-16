describe('Deleting Stored Payment Data', () => {
  const baseUrl = 'https://eu-test.oppwa.com';
  const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
  const entityId = '8a8294174b7ecb28014b9699220015ca';

  let registrationId;

  it('should store payment data during a payment', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/v1/payments`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      form: true,
      body: {
        entityId: entityId,
        amount: '92.00',
        currency: 'EUR',
        paymentBrand: 'VISA',
        paymentType: 'DB',
        'card.number': '4200000000000000',
        'card.holder': 'Jane Jones',
        'card.expiryMonth': '05',
        'card.expiryYear': '2034',
        'card.cvv': '123',
        'standingInstruction.mode': 'INITIAL',
        'standingInstruction.type': 'UNSCHEDULED',
        'standingInstruction.source': 'CIT',
        createRegistration: true,
      },
    }).then((response) => {
      // Assertions for successful storing of payment data
      expect(response.status).to.eq(200);
      expect(response.body.result.code).to.eq('000.100.110');
      expect(response.body.registrationId).to.exist;

      // Store registration ID in the variable
      registrationId = response.body.registrationId;
    });
  });


  it('should delete stored payment data', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/v1/registrations/${registrationId}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      qs: {
        entityId: entityId,
      },
    }).then((response) => {
      // Assertions for successful delete of stored payment data
      expect(response.status).to.eq(200);
      // Assuming this is the expected code for successful deletion
      expect(response.body.result.code).to.eq('000.100.110');
    });
  });
});
