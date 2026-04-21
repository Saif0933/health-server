import app from './src/app';

const PORT = process.env.PORT || 5000;

const server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server is now running on all interfaces at port ${PORT}`);
});

export default server;
