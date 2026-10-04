const SSLCommerzPayment = require('sslcommerz-lts');// import dotenvHelper from './dotenvHelper';  // Ensure this is correctly imported
const dotenvHelper = require('../../config/dotenv');

// Store credentials shared by payment creation and validation. Environment
// variables take precedence over the sandbox store that was hard-coded here.
const store_id = process.env.SSLCOMMERZ_STORE_ID || 'bijon66efc7e8a6d5e';
const store_password = process.env.SSLCOMMERZ_STORE_PASSWORD || 'bijon66efc7e8a6d5e@ssl';
const is_live = String(process.env.SSLCOMMERZ_IS_LIVE) === 'true';

class PaymentGatewayService {

    // Confirms a payment with SSLCommerz's validation API. The success
    // callback alone can be forged, so this is what proves the payment.
    async validate(val_id) {
        const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);
        return sslcz.validate({ val_id });
    }

    async createPayment({ name, email, phone, address, productName, price }) {
        const tranId = Date.now().toString();  // Generating unique transaction ID

        const data = {
            store_id,
            store_passwd: store_password,
            total_amount: price,
            currency: 'BDT',
            tran_id: tranId,
            success_url: `${dotenvHelper.backend_url}/api/v1/payment/success?tran_id=${tranId}`,
            fail_url: `${dotenvHelper.backend_url}/api/v1/payment/fail?tran_id=${tranId}`,
            cancel_url: `${dotenvHelper.backend_url}/api/v1/payment/cancel?tran_id=${tranId}`,
            ipn_url: `${dotenvHelper.backend_url}/api/v1/payment/ipn?tran_id=${tranId}`,
            shipping_method: 'No',
            product_name: productName,
            product_category: 'Room Booking',
            product_profile: 'non-physical-goods',
            cus_name: name,
            cus_email: email,
            cus_add1: address,
            cus_phone: phone,
            ship_name: name,
            ship_add1: address,
            ship_city: 'Dhaka',
            ship_postcode: 1200,
            ship_country: 'Bangladesh',
        };
// console.log(data)
        const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);
// console.log(sslcz,"sdf")
        return new Promise((resolve, reject) => {
            sslcz.init(data)
                .then(apiResponse => {
                    console.log('SSLCommerz Response:', apiResponse.redirectGatewayURL); // Log response
                    const GatewayPageURL = apiResponse.redirectGatewayURL;

                    console.log(!!GatewayPageURL,GatewayPageURL);
                    
                    if (!!GatewayPageURL) {
                        console.log("hello");
                        
                        resolve({
                            GatewayPageURL,
                            tranId
                        });
                    } else {
                        reject(new Error('Unable to initiate payment'));
                    }
                })
                .catch(err => {
                    console.error('SSLCommerz Error:', err); // Log detailed error
                    reject(new Error(`Payment initialization failed: ${err.message}`));
                });
        });
    }
}

module.exports = PaymentGatewayService;