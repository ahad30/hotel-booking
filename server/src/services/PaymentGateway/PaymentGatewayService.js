const SSLCommerzPayment = require('sslcommerz-lts');// import dotenvHelper from './dotenvHelper';  // Ensure this is correctly imported
const dotenvHelper = require('../../config/dotenv');

class PaymentGatewayService {

    async createPayment({ name, email, phone, address, productName, price }) {
        const store_id = 'bijon66efc7e8a6d5e';
        const store_password = 'bijon66efc7e8a6d5e@ssl';
        const is_live = false;
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