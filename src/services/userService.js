import request from '../utils/request';

class UserService {
  constructor(req) {
    this.req = req;
  }

  async getUserInfo() {
    return this.req.get('/users');
  }

  async getUserInfoByPhoneNumber(phoneNumber) {
    return this.req.get(`/users/${phoneNumber}/phone`);
  }

  async updateUserNameAndAvatar(data) {
    return this.req.put('/users', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const userService = new UserService(request);
export default userService;
