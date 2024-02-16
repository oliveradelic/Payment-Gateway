describe('Refund a Payment', () => {
    const baseUrl = 'https://eu-test.oppwa.com';
    const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
    const entityId = '8a8294174b7ecb28014b9699220015ca';
    let paymentId; // Variable to store the payment ID
  
    before(() => {
      // Make a payment to be refunded
      cy.request({
        method: 'POST',
        url: `${baseUrl}/v1/payments`,
        headers: {
            'Authorization': `Bearer ${accessToken}` 
        },
        form: true,
        body: {
          entityId: entityId, 
          amount: '100.00', 
          currency: 'EUR',
          paymentBrand: 'VISA', 
          paymentType: 'DB', 
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
  
  it('should refund a payment', () => {
      // Ensure paymentId is properly set
      expect(paymentId).to.exist;  
    
      // refund the previous payment
      cy.request({
        method: 'POST',
        url: `${baseUrl}/v1/payments/${paymentId}`, 
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        form: true,
        body: {
          entityId: entityId, 
          paymentType: 'RF', 
          amount: '50.00', // Refund amount (can be partial or full - this is partial refund)
          currency: 'EUR',
        },
          failOnStatusCode: false, // Don't fail on non-200 status codes

      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.result.code).to.eq('000.100.110'); // Assuming this is the error code for invalid amount
      });
    });
  });
  