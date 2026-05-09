export const getBuffer = async (image: string) => {
    const buffer = Buffer.from(image, 'base64');
    return buffer;
}