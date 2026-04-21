import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL="postgresql://postgres:postgres@localhost:5433/symbosys_health?schema=public"

const ENV = {


    DATABASE_URL: DATABASE_URL,

    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,

    FRONTEND_URL: process.env.FRONTEND_URL,
    FRONTEND_URL1: process.env.FRONTEND_URL1,

    // credentials to send email
    USER_EMAIL: process.env.USER_EMAIL,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,


    // Cloudinary Credentials
    cloud_name: process.env.CLOUD_NAME, 
    cloud_api_key: process.env.CLOUD_API_KEY,  
    cloud_api_secret: process.env.CLOUD_API_SECRET,
    cloud_folder: process.env.CLOUD_FOLDER,

    mode: process.env.NODE_ENV,
}

export default ENV;