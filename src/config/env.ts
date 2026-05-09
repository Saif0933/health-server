export const ENV = {
    jwtSecret: process.env.JWT_SECRET,
    
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

    cloudinaryName: process.env.CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUD_API_KEY,
    cloudinaryApiSecret: process.env.CLOUD_API_SECRET,
    cloudinaryFolder: process.env.CLOUD_FOLDER,

    mode: process.env.NODE_ENV,

    
    // models env 
    groqApiKey: process.env.GROQ_API_KEY,
    googleApiKey: process.env.GOOGLE_API_KEY,
}