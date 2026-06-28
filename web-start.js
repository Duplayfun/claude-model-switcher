#!/usr/bin/env node

import WebServer from './src/web-server.js';

// 使用环境变量 PORT（平台兼容：Render/Railway/Fly.io 等）
const PORT = parseInt(process.env.PORT, 10) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

console.log('🚀 Starting Claude Code AI Model Hub Web UI...');
console.log(`📱 ${isProduction ? '🌐 Production' : '🔧 Development'} mode`);
console.log(`🌍 Server will start on port ${PORT}`);
console.log('');

// 创建并启动Web服务器
const webServer = new WebServer(PORT);

webServer.start().catch(error => {
  console.error('❌ Failed to start web server:', error);
  process.exit(1);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down web server...');
  await webServer.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down web server...');
  await webServer.stop();
  process.exit(0);
});

if (!isProduction) {
  console.log('🔧 Web UI Features:');
  console.log('  • 📱 Mobile-first responsive design');
  console.log('  • 🎯 One-click model switching');
  console.log('  • ⚙️ Visual configuration editor');
  console.log('  • 📊 Real-time status monitoring');
  console.log('  • 🧪 API connection testing');
  console.log('  • ➕ Custom model management');
  console.log('');
  console.log('💡 Press Ctrl+C to stop the web server');
}