describe('Standalone 3D Secure', () => {
  const baseUrl = 'https://eu-test.oppwa.com';
  const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
  const entityId = '8a8294174b7ecb28014b9699220015ca';
  
    it('should initiate a standalone 3D Secure authentication flow', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/v1/threeDSecure`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        form: true,
        body: {
          entityId: entityId,
          amount: '12.50',
          currency: 'EUR',
          paymentBrand: 'VISA',
          merchantTransactionId: 'order99234',
          transactionCategory: 'EC',
          'card.holder': 'John Smith',
          'card.number': '4200000000000067',
          'card.expiryMonth': '12',
          'card.expiryYear': '2025',
          'card.cvv': '123',
          'merchant.name': 'MerchantCo',
          'merchant.city': 'Munich',
          'merchant.country': 'DE',
          'merchant.mcc': '5399',
          'customer.ip': '192.168.0.1',
          'customer.browser.acceptHeader': 'text/html',
          'customer.browser.screenColorDepth': '48',
          'customer.browser.javaEnabled': 'false',
          'customer.browser.language': 'de',
          'customer.browser.screenHeight': '1200',
          'customer.browser.screenWidth': '1600',
          'customer.browser.timezone': '60',
          'customer.browser.challengeWindow': '4',
          'customer.browser.userAgent': 'Mozilla/4.0 (MSIE 6.0; Windows NT 5.0)',
          shopperResultUrl: 'https://docs.oppwa.com/tutorials/server-to-server/standalone3DS#step3',
          testMode: 'EXTERNAL'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.result.code).to.eq('000.200.000');
        expect(response.status).to.eq(200);
        expect(response.body.threeDSecure).to.exist;
        expect(response.body.threeDSecure.eci).to.exist;         
      });
    });
  });
  