const { createApp } = Vue;

createApp({
  data() {
    return {
      // UI状态
      loading: true,
      error: null,
      success: null,
      searchQuery: '',

      // 数据
      models: {},
      activeModel: null,
      modelStatuses: {},
      filteredModels: {},

      // 操作状态
      switchingModel: null,
      testingModel: null,

      // 编辑状态
      editingModel: null,
      editForm: {
        name: '',
        baseUrl: '',
        apiKey: '',
        defaultModel: ''
      },

      // 添加模型状态
      showAddModel: false,
      addForm: {
        key: '',
        name: '',
        baseUrl: '',
        apiKey: '',
        defaultModel: '',
        description: ''
      },

      // 配置导入导出
      showConfigModal: false,
      configExportData: '',
      configImportData: '',
      configMessage: '',
      configMessageType: '',

      // 批量API密钥设置
      showApiKeysModal: false,
      apiKeysForm: {},

      // 设置
      autoTest: true,
      theme: 'default'
    };
  },

  async mounted() {
    await this.loadData();
    this.loadSettings();

    // 自动刷新状态
    setInterval(() => {
      this.refreshStatuses();
    }, 30000); // 每30秒刷新一次
  },

  methods: {
    // 数据加载
    async loadData() {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch('/api/models');
        const result = await response.json();

        if (result.success) {
          this.models = result.data.models;
          this.activeModel = result.data.activeModel;
          this.filteredModels = this.models;

          // 初始化模型状态
          Object.keys(this.models).forEach(key => {
            this.modelStatuses[key] = 'unknown';
          });

          // 刷新状态
          await this.refreshStatuses();
        } else {
          throw new Error(result.error || 'Failed to load models');
        }
      } catch (error) {
        this.error = error.message;
        this.showMessage('error', error.message);
      } finally {
        this.loading = false;
      }
    },

    // 搜索过滤
    filterModels() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        this.filteredModels = this.models;
        return;
      }

      const filtered = {};
      Object.entries(this.models).forEach(([key, model]) => {
        const searchText = `${model.name} ${key} ${model.baseUrl}`.toLowerCase();
        if (searchText.includes(query)) {
          filtered[key] = model;
        }
      });
      this.filteredModels = filtered;
    },

    // 获取模型图标
    getModelIcon(key) {
      const icons = {
        claude: '🔮',
        gemini: '♊',
        deepseek: '🎯',
        qwen: '☁️',
        kimi: '🌙',
        glm: '🧠',
        ollama: '🦙'
      };
      return icons[key] || '🤖';
    },

    // 获取模型提供商
    getModelProvider(key) {
      const providers = {
        claude: 'Anthropic',
        gemini: 'Google',
        deepseek: 'DeepSeek',
        qwen: 'Alibaba',
        kimi: 'Moonshot',
        glm: 'ZhipuAI',
        ollama: 'Local'
      };
      return providers[key] || 'Custom';
    },

    // 获取模型类型
    getModelType(key) {
      const types = {
        claude: 'Claude API',
        gemini: 'Gemini API',
        deepseek: 'OpenAI Compatible',
        qwen: 'OpenAI Compatible',
        kimi: 'OpenAI Compatible',
        glm: 'OpenAI Compatible',
        ollama: 'Local Model'
      };
      return types[key] || 'OpenAI Compatible';
    },

    // 获取状态类名
    getStatusClass(key) {
      const status = this.modelStatuses[key];
      return {
        'status-connected': status === 'connected',
        'status-disconnected': status === 'disconnected',
        'status-testing': status === 'testing'
      };
    },

    // 切换模型
    async switchModel(modelKey) {
      if (this.switchingModel || modelKey === this.activeModel) return;

      try {
        this.switchingModel = modelKey;
        this.error = null;

        const response = await fetch(`/api/models/${modelKey}/switch`, {
          method: 'POST'
        });
        const result = await response.json();

        if (result.success) {
          this.activeModel = modelKey;
          this.showMessage('success', result.message);

          // 如果开启了自动测试，测试新模型
          if (this.autoTest) {
            setTimeout(() => this.testModel(modelKey), 1000);
          }
        } else {
          throw new Error(result.message || 'Failed to switch model');
        }
      } catch (error) {
        this.error = error.message;
        this.showMessage('error', error.message);
      } finally {
        this.switchingModel = null;
      }
    },

    // 测试模型
    async testModel(modelKey) {
      if (this.testingModel) return;

      try {
        this.testingModel = modelKey;
        this.modelStatuses[modelKey] = 'testing';

        const response = await fetch(`/api/models/${modelKey}/test`, {
          method: 'POST'
        });
        const result = await response.json();

        if (result.success) {
          this.modelStatuses[modelKey] = result.data.connected ? 'connected' : 'disconnected';

          if (result.data.connected) {
            this.showMessage('success', `${this.models[modelKey].name} 连接成功`);
          } else {
            this.showMessage('warning', `${this.models[modelKey].name} 连接失败`);
          }
        } else {
          throw new Error(result.error || 'Test failed');
        }
      } catch (error) {
        this.modelStatuses[modelKey] = 'error';
        this.showMessage('error', `测试失败: ${error.message}`);
      } finally {
        this.testingModel = null;
      }
    },

    // 编辑模型
    editModel(modelKey) {
      const model = this.models[modelKey];
      this.editingModel = modelKey;
      this.editForm = {
        name: model.name,
        baseUrl: model.baseUrl,
        apiKey: '', // 不显示现有密钥
        defaultModel: model.defaultModel
      };
    },

    // 保存模型编辑
    async saveModelEdit() {
      try {
        const updateData = {
          name: this.editForm.name,
          baseUrl: this.editForm.baseUrl,
          defaultModel: this.editForm.defaultModel
        };

        // 如果输入了新密钥，才更新密钥
        if (this.editForm.apiKey.trim()) {
          updateData.apiKey = this.editForm.apiKey;
        }

        const response = await fetch(`/api/models/${this.editingModel}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        const result = await response.json();

        if (result.success) {
          this.editingModel = null;
          await this.loadData();
          this.showMessage('success', result.message);
        } else {
          throw new Error(result.error || 'Update failed');
        }
      } catch (error) {
        this.showMessage('error', error.message);
      }
    },

    // 添加自定义模型
    async addCustomModel() {
      try {
        if (!this.addForm.key || !this.addForm.name || !this.addForm.baseUrl) {
          throw new Error('请填写必填字段');
        }

        const response = await fetch('/api/models/custom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.addForm)
        });
        const result = await response.json();

        if (result.success) {
          this.showAddModel = false;
          this.resetAddForm();
          await this.loadData();
          this.showMessage('success', result.message);
        } else {
          throw new Error(result.error || 'Failed to create model');
        }
      } catch (error) {
        this.showMessage('error', error.message);
      }
    },

    // 删除自定义模型
    async deleteModel(modelKey) {
      if (!confirm(`确定要删除模型 ${this.models[modelKey].name} 吗？`)) {
        return;
      }

      try {
        const response = await fetch(`/api/models/${modelKey}`, {
          method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
          await this.loadData();
          this.showMessage('success', result.message);
        } else {
          throw new Error(result.error || 'Delete failed');
        }
      } catch (error) {
        this.showMessage('error', error.message);
      }
    },

    // 刷新所有状态
    async refreshStatuses() {
      const statusPromises = Object.keys(this.models).map(async (key) => {
        try {
          const response = await fetch(`/api/models/${key}/test`, {
            method: 'POST'
          });
          const result = await response.json();

          if (result.success) {
            this.modelStatuses[key] = result.data.connected ? 'connected' : 'disconnected';
          } else {
            this.modelStatuses[key] = 'error';
          }
        } catch (error) {
          this.modelStatuses[key] = 'error';
        }
      });

      await Promise.all(statusPromises);
    },

    // 刷新单个状态
    refreshAll() {
      this.refreshStatuses();
      this.showMessage('success', '状态刷新完成');
    },

    // 设置管理
    loadSettings() {
      const settings = localStorage.getItem('claude-switcher-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.autoTest = parsed.autoTest ?? true;
        this.theme = parsed.theme ?? 'default';
      }
    },

    saveSettings() {
      const settings = {
        autoTest: this.autoTest,
        theme: this.theme
      };
      localStorage.setItem('claude-switcher-settings', JSON.stringify(settings));
    },

    // 工具方法
    showMessage(type, message) {
      if (type === 'success') {
        this.success = message;
        setTimeout(() => this.success = null, 3000);
      } else if (type === 'error') {
        this.error = message;
        setTimeout(() => this.error = null, 5000);
      }
    },

    getStatusText(status) {
      switch (status) {
        case 'connected': return '已连接';
        case 'disconnected': return '未连接';
        case 'testing': return '测试中';
        case 'error': return '错误';
        default: return '未知';
      }
    },

    // 配置导入导出 =====

    // 打开配置管理面板
    openConfigModal() {
      this.showConfigModal = true;
      this.configImportData = '';
      this.configMessage = '';
      this.exportConfig();
    },

    // 导出配置到JSON
    async exportConfig() {
      try {
        const response = await fetch('/api/config/export');
        const result = await response.json();
        if (result.success) {
          this.configExportData = JSON.stringify(result.data, null, 2);
          this.showConfigMessage('success', '✅ 配置已导出，可复制到云端使用');
        } else {
          this.showConfigMessage('error', '导出失败: ' + (result.error || '未知错误'));
        }
      } catch (error) {
        this.showConfigMessage('error', '导出失败: ' + error.message);
      }
    },

    // 导入配置
    async importConfig() {
      try {
        let data;
        try {
          data = JSON.parse(this.configImportData);
        } catch {
          this.showConfigMessage('error', '❌ JSON 格式错误，请检查');
          return;
        }

        // 支持两种格式: {config: ..., activeModel: ...} 或直接的配置对象
        const payload = data.config ? data : { config: data };

        const response = await fetch('/api/config/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.success) {
          this.showConfigMessage('success', '✅ ' + result.message);
          this.showConfigModal = false;
          await this.loadData();
          this.showMessage('success', '✅ 配置导入成功');
        } else {
          this.showConfigMessage('error', '导入失败: ' + (result.error || '未知错误'));
        }
      } catch (error) {
        this.showConfigMessage('error', '导入失败: ' + error.message);
      }
    },

    // 复制导出文本到剪贴板
    copyExportData() {
      navigator.clipboard.writeText(this.configExportData).then(() => {
        this.showConfigMessage('success', '✅ 已复制到剪贴板');
      }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = this.configExportData;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showConfigMessage('success', '✅ 已复制到剪贴板');
      });
    },

    showConfigMessage(type, message) {
      this.configMessageType = type;
      this.configMessage = message;
      setTimeout(() => { this.configMessage = ''; }, 5000);
    },

    // 批量API密钥设置 =====

    openApiKeysModal() {
      // 为每个模型初始化表单
      const form = {};
      Object.keys(this.models).forEach(key => {
        form[key] = '';
      });
      this.apiKeysForm = form;
      this.showApiKeysModal = true;
    },

    async saveAllApiKeys() {
      let saved = 0;
      for (const [key, apiKey] of Object.entries(this.apiKeysForm)) {
        if (apiKey && apiKey.trim()) {
          try {
            const response = await fetch(`/api/models/${key}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiKey: apiKey.trim() })
            });
            const result = await response.json();
            if (result.success) saved++;
          } catch (e) {
            console.error(`Failed to save API key for ${key}:`, e);
          }
        }
      }
      this.showApiKeysModal = false;
      if (saved > 0) {
        await this.loadData();
        this.showMessage('success', `✅ 已保存 ${saved} 个模型的 API 密钥`);
      } else {
        this.showMessage('error', '⚠️ 没有输入任何 API 密钥');
      }
    },

    resetAddForm() {
      this.addForm = {
        key: '',
        name: '',
        baseUrl: '',
        apiKey: '',
        defaultModel: '',
        description: ''
      };
    }
  }
}).mount('#app');