describe('Payment Process', () => {
    const baseUrl = 'https://eu-test.oppwa.com';
    const accessToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=';
    const entityId = '8a8294174b7ecb28014b9699220015ca';

    let checkoutId;
    let paymentId;

    it('prepares the checkout', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/v1/checkouts`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            form: true,
            body: {
                entityId: entityId,
                amount: '92.00',
                currency: 'EUR',
                paymentType: 'DB'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.exist;
            // Store checkoutID in the variable
            checkoutId = response.body.id;
        });
    });

    it('sends the initial payment request', () => {

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
                'card.cvv': '123'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.paymentType).to.eq('DB');
            expect(response.body.paymentBrand).to.eq('VISA');
            expect(response.body.amount).to.eq('92.00');
            expect(response.body.currency).to.eq('EUR');
            expect(response.body.result.code).to.eq('000.100.110');
            expect(response.body.result.description).to.eq("Request successfully processed in 'Merchant in Integrator Test Mode'");
            expect(response.body.id).to.exist;
            // Store payment ID in the variable
            paymentId = response.body.id;
        });
    });

    it('waits for payment processing', () => {
        // Wait for duration to allow payment processing
        cy.wait(1000);
    });


    it('gets the payment status', () => {
        // Ensure paymentId is properly set
        expect(paymentId).to.exist;
        // Ensure checkoutId is properly set
        expect(checkoutId).to.exist;

        cy.request({
            method: 'GET',
            url: `${baseUrl}/v1/checkouts/${checkoutId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.result.code).to.eq('000.200.103');
        });
    });
});

