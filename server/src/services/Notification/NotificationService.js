class NotificationService {
    constructor(prisma) {
      this.prisma = prisma;
    }
  
    async createNotification(data) {
      return await this.prisma.notification.create({
        data
      });
    }
  
    async markAsRead(notificationId) {
      return await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
    }
  
    async getUserNotifications(userId) {
      return await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    }
  }
  
  module.exports = NotificationService;
  