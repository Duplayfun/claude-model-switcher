#!/usr/bin/env node

// 使用环境变量 PORT（平台兼容：Render/Railway/Fly.io 等）
const PORT = parseInt(process.env.PORT, 10) || 3000;

console.log('🚀 Starting Claude Code AI Model Hub Web UI...');
console.log(`📱 Node.js version: ${process.version}`);
console.log(`🌍 Platform: ${process.platform}`);
console.log(`🔌 PORT: ${PORT}`);
console.log(`📂 CWD: ${process.cwd()}`);

try {
  const WebServer = (await import('./src/web-server.js')).default;
  console.log('✅ WebServer class loaded successfully');

  const webServer = new WebServer(PORT);
  console.log('✅ WebServer instance created');

  await webServer.start();
  console.log(`✅ Server is now listening on port ${PORT}`);
} catch (error) {
  console.error('❌ Fatal error starting server:', error);
  console.error('❌ Stack:', error.stack);
  process.exit(1);
}
