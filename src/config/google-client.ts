import { OAuth2Client } from "google-auth-library"
import { ENV } from "./env";

const googleClient = new OAuth2Client({
    clientId: ENV.googleClientId,
    clientSecret: ENV.googleClientSecret,
})

export default googleClient;