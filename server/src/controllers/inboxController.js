const ResponseHandler = require("../shared/response.handaler");

class InboxController {
    constructor(inboxService) {
        this.inboxService = inboxService;
    }

    async createContact(req, res, next) {
        try {
            const result = await this.inboxService.createContact(req.body);
            ResponseHandler.success(res, "Thanks! Your message has been sent.", result, 201);
        } catch (error) {
            next(error);
        }
    }

    async getContacts(req, res, next) {
        try {
            const result = await this.inboxService.getContacts();
            ResponseHandler.success(res, "Messages fetched successfully", result);
        } catch (error) {
            next(error);
        }
    }

    async deleteContact(req, res, next) {
        try {
            const result = await this.inboxService.deleteContact(req.params.id);
            ResponseHandler.success(res, "Message deleted", result);
        } catch (error) {
            next(error);
        }
    }

    async subscribe(req, res, next) {
        try {
            const result = await this.inboxService.subscribe(req.body?.email);
            ResponseHandler.success(res, "You're subscribed! Watch your inbox for deals.", result, 201);
        } catch (error) {
            next(error);
        }
    }

    async getSubscribers(req, res, next) {
        try {
            const result = await this.inboxService.getSubscribers();
            ResponseHandler.success(res, "Subscribers fetched successfully", result);
        } catch (error) {
            next(error);
        }
    }

    async deleteSubscriber(req, res, next) {
        try {
            const result = await this.inboxService.deleteSubscriber(req.params.id);
            ResponseHandler.success(res, "Subscriber removed", result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InboxController;
