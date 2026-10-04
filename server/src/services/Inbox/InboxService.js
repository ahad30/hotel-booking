const ApiError = require("../../error/handleApiError");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact messages and newsletter subscribers from the public site.
class InboxService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    async createContact({ name, email, phone, subject, description }) {
        if (!name?.trim() || !description?.trim()) {
            throw new ApiError(400, "Name and message are required.");
        }
        if (!EMAIL_RE.test(email || "")) {
            throw new ApiError(400, "Please enter a valid email address.");
        }
        return this.prisma.contact.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone?.trim() || null,
                subject: subject?.trim() || null,
                description: description.trim(),
            },
        });
    }

    getContacts() {
        return this.prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    }

    deleteContact(id) {
        return this.prisma.contact.delete({ where: { id } });
    }

    // Subscribing twice is not an error: an existing address is simply re-activated.
    async subscribe(email) {
        const normalized = (email || "").trim().toLowerCase();
        if (!EMAIL_RE.test(normalized)) {
            throw new ApiError(400, "Please enter a valid email address.");
        }
        return this.prisma.subscriber.upsert({
            where: { email: normalized },
            update: { isSubscribed: true },
            create: { email: normalized },
        });
    }

    getSubscribers() {
        return this.prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } });
    }

    deleteSubscriber(id) {
        return this.prisma.subscriber.delete({ where: { id } });
    }
}

module.exports = InboxService;
