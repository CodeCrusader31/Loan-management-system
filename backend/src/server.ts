import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Attempt database connection first
    await connectDB();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Handle Graceful Shutdown
    const gracefulShutdown = (signal: NodeJS.Signals) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();