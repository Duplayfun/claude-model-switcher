import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ModelConfig } from './config.js';
import { ModelSwitcher } from './switcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WebServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.configManager = new ModelConfig();
    this.modelSwitcher = new ModelSwitcher();
    this.server = null;

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());

    // 静态文件服务 - 前端资源
    this.app.use(express.static(path.join(__dirname, '../web')));
  }

  setupRoutes() {
    // API路由
    this.setupAPIRoutes();

    // 前端应用路由
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../web/index.html'));
    });
  }

  setupAPIRoutes() {
    // 获取所有模型配置
    this.app.get('/api/models', async (req, res) => {
      try {
        const models = await this.configManager.loadConfig();
        const active = await this.configManager.getActiveModel();

        res.json({
          success: true,
          data: {
            models,
            activeModel: active.model
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 切换模型
    this.app.post('/api/models/:modelName/switch', async (req, res) => {
      try {
        const { modelName } = req.params;
        const success = await this.modelSwitcher.switchModel(modelName);

        res.json({
          success,
          message: success ? `Model switched to ${modelName}` : `Failed to switch to ${modelName}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 更新模型配置
    this.app.put('/api/models/:modelName', async (req, res) => {
      try {
        const { modelName } = req.params;
        const updates = req.body;

        const models = await this.configManager.loadConfig();

        if (!models[modelName]) {
          return res.status(404).json({
            success: false,
            error: 'Model not found'
          });
        }

        // 更新模型配置
        models[modelName] = { ...models[modelName], ...updates };

        await this.configManager.saveConfig(models);

        res.json({
          success: true,
          message: `Model ${modelName} configuration updated`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 设置自定义模型版本
    this.app.put('/api/models/:modelName/version', async (req, res) => {
      try {
        const { modelName } = req.params;
        const { modelVersion } = req.body;

        if (!modelVersion || typeof modelVersion !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Model version is required and must be a string'
          });
        }

        const success = await this.configManager.setCustomModelVersion(modelName, modelVersion.trim());

        if (success) {
          res.json({
            success: true,
            message: `Custom model version set for ${modelName}: ${modelVersion.trim()}`
          });
        } else {
          res.status(500).json({
            success: false,
            error: 'Failed to set custom model version'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 测试模型连接
    this.app.post('/api/models/:modelName/test', async (req, res) => {
      try {
        const { modelName } = req.params;
        const isConnected = await this.configManager.testConnection(modelName);

        res.json({
          success: true,
          data: {
            connected: isConnected,
            status: isConnected ? 'connected' : 'disconnected'
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 获取当前活动模型
    this.app.get('/api/models/active', async (req, res) => {
      try {
        const active = await this.configManager.getActiveModel();
        res.json({
          success: true,
          data: active
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 创建自定义模型
    this.app.post('/api/models/custom', async (req, res) => {
      try {
        const { name, baseUrl, apiKeyName, apiKey, defaultModel, description } = req.body;

        const models = await this.configManager.loadConfig();

        // 创建新的自定义模型
        models[name] = {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          baseUrl,
          apiKeyName: apiKeyName || 'ANTHROPIC_API_KEY',
          apiKey: apiKey || '',
          defaultModel: defaultModel || 'gpt-3.5-turbo',
          description: description || '',
          isCustom: true
        };

        await this.configManager.saveConfig(models);

        res.json({
          success: true,
          message: `Custom model ${name} created`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 删除自定义模型
    this.app.delete('/api/models/:modelName', async (req, res) => {
      try {
        const { modelName } = req.params;
        const models = await this.configManager.loadConfig();

        if (!models[modelName] || !models[modelName].isCustom) {
          return res.status(400).json({
            success: false,
            error: 'Can only delete custom models'
          });
        }

        delete models[modelName];
        await this.configManager.saveConfig(models);

        res.json({
          success: true,
          message: `Custom model ${modelName} deleted`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 导出配置（JSON格式，方便迁移到云端）
    this.app.get('/api/config/export', async (req, res) => {
      try {
        const models = await this.configManager.loadConfig();
        const active = await this.configManager.getActiveModel();

        // 移除敏感信息中的完整 API Key，提示用户手动填写
        const exportData = {};
        Object.keys(models).forEach(key => {
          exportData[key] = { ...models[key] };
          if (exportData[key].apiKey) {
            exportData[key].apiKey = ''; // 不导出密钥，通过环境变量传递
            exportData[key]._keyHint = `请在目标环境设置 ${exportData[key].apiKeyName || 'ANTHROPIC_API_KEY'} 环境变量`;
          }
        });

        res.json({
          success: true,
          data: {
            config: exportData,
            activeModel: active.model,
            exportTime: new Date().toISOString(),
            note: 'API密钥已移除，请通过环境变量配置'
          }
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // 导入配置（从JSON恢复模型设置）
    this.app.post('/api/config/import', async (req, res) => {
      try {
        const { config, activeModel } = req.body;

        if (!config || typeof config !== 'object') {
          return res.status(400).json({
            success: false,
            error: '无效的配置格式，请提供有效的 JSON 配置'
          });
        }

        const models = await this.configManager.loadConfig();

        // 合并导入的配置，保留已有 API 密钥
        Object.keys(config).forEach(key => {
          if (typeof config[key] === 'object' && config[key] !== null) {
            if (!models[key]) {
              models[key] = config[key];
            } else {
              // 保留已有 API 密钥，合并其他字段
              const existingKey = models[key].apiKey;
              models[key] = { ...models[key], ...config[key] };
              if (config[key].apiKey === '' && existingKey) {
                models[key].apiKey = existingKey;
              }
            }
          }
        });

        await this.configManager.saveConfig(models);

        // 如果指定了激活模型，切换过去
        if (activeModel && models[activeModel]) {
          await this.configManager.setActiveModel(activeModel);
        }

        res.json({
          success: true,
          message: `已成功导入 ${Object.keys(config).length} 个模型配置`,
          data: { models: Object.keys(config) }
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // 获取系统状态
    this.app.get('/api/status', async (req, res) => {
      try {
        const models = await this.configManager.loadConfig();
        const active = await this.configManager.getActiveModel();

        // 获取各模型状态
        const statusPromises = Object.keys(models).map(async (modelName) => {
          try {
            const isConnected = await this.configManager.testConnection(modelName);
            return {
              name: modelName,
              connected: isConnected,
              hasApiKey: !!models[modelName].apiKey
            };
          } catch (error) {
            return {
              name: modelName,
              connected: false,
              hasApiKey: !!models[modelName].apiKey,
              error: error.message
            };
          }
        });

        const modelStatuses = await Promise.all(statusPromises);

        res.json({
          success: true,
          data: {
            activeModel: active.model,
            models: modelStatuses,
            timestamp: Date.now()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`🚀 Claude Code AI Model Hub Web UI`);
          console.log(`📱 Server running at: http://localhost:${this.port}`);
          console.log(`🌐 API endpoints available at: http://localhost:${this.port}/api/`);
          console.log('\n📋 Available API endpoints:');
          console.log('  GET  /api/models          - Get all model configurations');
          console.log('  POST /api/models/:name/switch - Switch to model');
          console.log('  PUT  /api/models/:name    - Update model configuration');
          console.log('  POST /api/models/:name/test  - Test model connection');
          console.log('  GET  /api/models/active   - Get active model');
          console.log('  POST /api/models/custom   - Create custom model');
          console.log('  DELETE /api/models/:name  - Delete custom model');
          console.log('  GET  /api/status          - Get system status');
          resolve(this.server);
        }
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 Web server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export default WebServer;