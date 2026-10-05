const ApiError = require("../error/handleApiError");
const ResponseHandler = require("../shared/response.handaler");

const MAX_QUERY = 300;

class AssistantController {
    constructor(assistantService) {
        this.assistantService = assistantService;
    }

    async search(req, res, next) {
        try {
            const query = String(req.body?.query || "").trim();
            if (query.length < 3) throw new ApiError(400, "Tell us a little about your trip.");
            if (query.length > MAX_QUERY) throw new ApiError(400, `Please keep it under ${MAX_QUERY} characters.`);
            const result = await this.assistantService.search(query);
            ResponseHandler.success(res, "Assistant results", result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AssistantController;
