import request from '../utils/request';

class ConversationService {
    constructor(req) {
        this.req = req;
    }

    async getConversationList() {
        return this.req.get('/conversations');
    }

    async getConversationById(id) {
        return this.req.get(`/conversations/${id}`);
    }
}

const conversationService = new ConversationService(request);
export default conversationService;
