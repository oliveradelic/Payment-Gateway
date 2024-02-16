describe('Initiating 3DS for an Initial Transaction', () => {
    const baseUrl = 'https://eu-test.oppwa.com';
    const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
    const entityId = '8a8294174b7ecb28014b9699220015ca';
    let checkoutId;
            let paymentId;// Variable to store the payment ID
      
       before(() => {
           
          cy.request({
            method: 'POST',
            url: 'https://eu-test.oppwa.com/v1/threeDSecure',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
              //  'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: true,
            body: {
              entityId: entityId,
              amount: '100.00',
              currency: 'EUR',
              paymentBrand: 'VISA',
              paymentType: 'DB',
             
              // other parameters...
            
              'card.expiryMonth': '05',
              'card.expiryYear': '2030',
              'card.number': '4200000000000091',
              'card.holder': 'John Doe',
              'card.cvv': '123',
              'billing.city': 'City',
              'billing.country': 'DE',
              'billing.street1': 'Street 1',
              'billing.postcode': '12345',
              'customer.email': 'john.doe@example.com',
              'threeDSecure.amount': '100.00',
              'threeDSecure.currency': 'EUR',
              'threeDSecure.challengeIndicator': '03',
              'threeDSecure.exemptionFlag': '03',
              'customer.browser.acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'customer.browser.language': 'en-US',
              'customer.browser.screenHeight': '1080',
              'customer.browser.screenWidth': '1920',
              'customer.browser.timezone': '120',
              'shopperResultUrl': 'YOUR_RESULT_URL' ,
              'customer.browser.userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.184 Safari/537.36',
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.exist;
            paymentId = response.body.id;
          });
        });
      
        it('should process 3D Secure transaction successfully', () => {
          // Check the payment status and 3D Secure response parameters
          cy.request({
            method: 'GET',
            url: `https://eu-test.oppwa.com/v1/payments/${paymentId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
           // body: {  entityId: entityId},
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.result.code).to.eq('000.100.110');
            expect(response.body.threeDSecure).to.exist;
            expect(response.body.threeDSecure.eci).to.exist;
            expect(response.body.threeDSecure.verificationId).to.exist;
            expect(response.body.threeDSecure.version).to.exist;
            expect(response.body.threeDSecure.flow).to.exist;
            expect(response.body.threeDSecure.dsTransactionId).to.exist;
            expect(response.body.threeDSecure.challengeMandatedIndicator).to.exist;
            expect(response.body.threeDSecure.authenticationType).to.exist;
            expect(response.body.threeDSecure.acsTransactionId).to.exist;
            // Add more assertions for other response parameters if needed
          });
      });
    });