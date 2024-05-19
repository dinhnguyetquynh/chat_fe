import request from '../utils/request';

class MessageService {
    constructor(req) {
        this.req = req;
    }

    async getMessageListByConversationId(id) {
        return this.req.get(`/messages/${id}?page=1&limit=20`);
    }

    async sendMessage(formData) {
        return this.req.post(`/messages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }
}

const messageService = new MessageService(request);
export default messageService;
