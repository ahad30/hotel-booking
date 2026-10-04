const dotenvHelper = require("../config/dotenv");

// SSLCommerz posts the customer's browser back to these routes after payment
// (success / fail / cancel) and calls the IPN route server-to-server.
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    // SSLCommerz sends tran_id in the form body; our callback URLs also carry it in the query.
    tranIdOf(req) {
        return req.body?.tran_id || req.query?.tran_id;
    }

    redirectTo(res, page, tranId) {
        const query = tranId ? `?tran_id=${encodeURIComponent(tranId)}` : "";
        // 303 turns SSLCommerz's POST into a GET on the client page.
        return res.redirect(303, `${dotenvHelper.frontend_url}/${page}${query}`);
    }

    async success(req, res) {
        const tranId = this.tranIdOf(req);
        try {
            const paid = await this.paymentService.settle(tranId, req.body?.val_id, req.body);
            return this.redirectTo(res, paid ? "success" : "cancel", tranId);
        } catch (error) {
            console.error("Payment success handling failed:", error);
            return this.redirectTo(res, "cancel", tranId);
        }
    }

    async fail(req, res) {
        const tranId = this.tranIdOf(req);
        try {
            await this.paymentService.fail(tranId, req.body);
        } catch (error) {
            console.error("Payment failure handling failed:", error);
        }
        return this.redirectTo(res, "cancel", tranId);
    }

    async ipn(req, res) {
        const tranId = this.tranIdOf(req);
        try {
            const status = req.body?.status;
            if (status === "VALID" || status === "VALIDATED") {
                const paid = await this.paymentService.settle(tranId, req.body?.val_id, req.body);
                return res.status(200).json({ success: true, paid });
            }
            await this.paymentService.fail(tranId, req.body);
            return res.status(200).json({ success: true, paid: false });
        } catch (error) {
            console.error("Payment IPN handling failed:", error);
            return res.status(500).json({ success: false, message: "IPN processing failed" });
        }
    }
}

module.exports = PaymentController;
