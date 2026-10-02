const ResponseHandler = require("../shared/response.handaler");

class NotificationController {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }
async createNotification(req, res, next) {
    try {
        const notification = await this.notificationService.createNotification(req.body);
        ResponseHandler.success(res, "Notification created successfully", notification, 201);
    }
    catch (err) {
      next(err);
    }
}
  async getNotifications(req, res, next) {
    try {
      const result = await this.notificationService.getUserNotifications(req.params.userId); // req.user must be available
      ResponseHandler.success(res, "Notifications fetched", result);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      await this.notificationService.markAsRead(id);
      ResponseHandler.success(res, "Notification marked as read");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
