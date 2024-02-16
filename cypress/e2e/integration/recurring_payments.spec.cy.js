describe('Store Payment Data as Stand-alone', () => {
  const baseUrl = 'https://eu-test.oppwa.com';
  const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
  const entityId = '8a8294174b7ecb28014b9699220015ca';

  let registrationId; // Variable to store registration ID 

    it('should store payment data as stand-alone', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/v1/registrations`,
        headers: {
          'Authorization': `Bearer ${accessToken} `,
        },
        form: true,
        body: {
          entityId: entityId,
          amount: '92.00',
          currency: 'EUR',
          paymentBrand: 'VISA',
          'card.number': '4200000000000000',
          'card.holder': 'Jane Jones',
          'card.expiryMonth': '05',
          'card.expiryYear': '2034',
          'card.cvv': '123',
        },
      }).then((response) => {
        // Assertions for successful storing of payment data as stand-alone
        expect(response.status).to.eq(200);
        expect(response.body.result.code).to.eq('000.100.110');
        expect(response.body.id).to.exist;
      });
    });

   
        it('should store payment data during a payment', () => {
          cy.request({
            method: 'POST',
            url: 'https://eu-test.oppwa.com/v1/payments',
            headers: {
              Authorization: 'Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=',
            },
            form: true,
            body: {
              entityId: '8a8294174b7ecb28014b9699220015ca',
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

            // Store the registration ID in the variable
            registrationId = response.body.registrationId;
          });
        });
      
      

  it('should perform an initial recurring payment', () => {

        cy.request({
          method: 'POST',
          url: 'https://eu-test.oppwa.com/v1/payments',
          headers: {
            Authorization: 'Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=',
          },
          form: true,
          body: {
            entityId: '8a8294174b7ecb28014b9699220015ca',
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
          // Assertions for successful initial recurring payment
          expect(response.status).to.eq(200);
          expect(response.body.result.code).to.eq('000.100.110');
        });
      });
    
      it('should perform a subsequent recurring payment', () => {

        cy.request({
          method: 'POST',
          url: `https://eu-test.oppwa.com/v1/registrations/${registrationId}/payments`,
          headers: {
            Authorization: 'Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=',
          },
          form: true,
          body: {
            entityId: '8a8294174b7ecb28014b9699220015ca',
            amount: '92.00',
            currency: 'EUR',
            paymentType: 'PA',
            'standingInstruction.mode': 'REPEATED',
            'standingInstruction.type': 'UNSCHEDULED',
            'standingInstruction.source': 'MIT',
            'standingInstruction.initialTransactionId': '123456780', // Replace with actual initial transaction ID
          },
        }).then((response) => {
          // Assertions for successful subsequent recurring payment
          expect(response.status).to.eq(200);
          expect(response.body.result.code).to.eq('000.100.110');
        });
      });
  
      it('should delete stored payment data', () => {
        // Ensure registrationId is properly set
        expect(registrationId).to.exist;     

         cy.request({
           method: 'DELETE',
           url: `https://eu-test.oppwa.com/v1/registrations/${registrationId}`,
           headers: {
             Authorization: 'Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=',
           },
           qs: {
             entityId: '8a8294174b7ecb28014b9699220015ca',
           },
         }).then((response) => {
           // Assertions for successful delet of stored payment data
           expect(response.status).to.eq(200);
           expect(response.body.result.code).to.eq('000.100.110'); // Assuming this is the expected code for successful deletion
         });
       });
      
  });
  