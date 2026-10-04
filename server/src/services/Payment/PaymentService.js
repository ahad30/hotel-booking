const PaymentGatewayService = require("../PaymentGateway/PaymentGatewayService");

const VALID_STATUSES = ["VALID", "VALIDATED"];

// Settles bookings when SSLCommerz reports back on a payment.
class PaymentService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
        this.gateway = new PaymentGatewayService();
    }

    findPayment(tranId) {
        return this.prisma.payment.findUnique({ where: { tranId } });
    }

    // Validates val_id with SSLCommerz and checks it belongs to this
    // transaction and amount. Returns the validation response when it's genuine.
    async verify(payment, valId) {
        if (!payment || !valId) return null;
        const validation = await this.gateway.validate(valId);
        const genuine =
            VALID_STATUSES.includes(validation?.status) &&
            validation?.tran_id === payment.tranId &&
            Math.abs(Number(validation?.amount) - payment.amount) < 1;
        return genuine ? validation : null;
    }

    async markPaid(payment, gatewayRes) {
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: "paid", gatewayRes },
        });
        await this.prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: "paid", status: "confirmed" },
        });
    }

    // A booking already confirmed (e.g. by the IPN) is never downgraded.
    async markFailed(payment, gatewayRes) {
        if (!payment || payment.status === "paid") return;
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: "failed", gatewayRes },
        });
        await this.prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: "failed", status: "cancelled" },
        });
    }

    // Shared by the success callback and the IPN. Returns true when the booking is paid.
    async settle(tranId, valId, payload) {
        const payment = await this.findPayment(tranId);
        if (!payment) return false;
        if (payment.status === "paid") return true;

        const validation = await this.verify(payment, valId);
        if (validation) {
            await this.markPaid(payment, validation);
            return true;
        }
        await this.markFailed(payment, payload);
        return false;
    }

    async fail(tranId, payload) {
        const payment = await this.findPayment(tranId);
        await this.markFailed(payment, payload);
    }
}

module.exports = PaymentService;
