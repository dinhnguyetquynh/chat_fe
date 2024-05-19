import request from "../utils/request";

class AuthService {
  constructor(req) {
    this.req = req;
  }

  async login(data) {
    return this.req.post("/auth/login", data);
  }

  async register(data) {
    return this.req.post("/auth/signup", data);
  }

  // async revokeToken(refresh_token){
  //   return this.req.post
  // }
}

const authService = new AuthService(request);
export default authService;
