# Claude Code AI Model Hub

专为 Claude Code 设计的多模型 AI API 切换器，支持 Claude、Gemini、DeepSeek、Qwen、Kimi、GLM 4.5 和 Ollama 本地模型。

## 项目特性

- **跨平台支持** - 支持 macOS、Windows 和 Linux
- **双重界面** - 命令行和现代化 Web UI
- **智能密钥管理** - 每个模型独立保存 API 密钥，切换时不会覆盖
- **零干扰设计** - Claude 原生 API 密钥完全保留，切换回来时自动恢复
- **移动端优化** - 响应式设计，支持 PWA 应用

## 系统支持

- **macOS 10.14+** - 完整功能支持
- **Windows 10/11** - 核心功能支持
- **Linux** - 基础功能支持

## 快速开始

### 1. 安装依赖

**macOS/Linux:**
```bash
git clone <repository-url>
cd claude-model-switcher
npm install
chmod +x claude
```

**Windows:**
```cmd
git clone <repository-url>
cd claude-model-switcher
npm install
```

### 2. 启动 Web 界面（推荐）

**macOS/Linux:**
```bash
./claude web
```

**Windows:**
```cmd
claude.bat web
```

浏览器将自动打开 http://localhost:3000

### 3. 使用命令行

**macOS/Linux:**
```bash
./claude claude      # 切换到 Claude
./claude kimi        # 切换到 Kimi
./claude list        # 查看所有模型
```

**Windows:**
```cmd
claude.bat claude    # 切换到 Claude
claude.bat kimi      # 切换到 Kimi
claude.bat list      # 查看所有模型
```

## 支持的模型

### 内置模型

| 模型 | 提供商 | 类型 | API 格式 |
|------|-------|------|---------|
| Claude | Anthropic | 云端 API | Claude API |
| Gemini | Google | 云端 API | Gemini API |
| DeepSeek | DeepSeek | 云端 API | OpenAI 兼容 |
| Qwen | 阿里巴巴 | 云端 API | OpenAI 兼容 |
| Kimi | Moonshot | 云端 API | OpenAI 兼容 |
| GLM 4.5 | 智谱 AI | 云端 API | OpenAI 兼容 |
| Ollama | 本地 | 本地模型 | OpenAI 兼容 |

### 自定义模型

支持任何 OpenAI 兼容的 API 服务，包括：
- 各种云端 AI 服务商的 OpenAI 兼容接口
- 私有部署的 AI 模型服务
- 本地运行的 AI 模型（如通过 vLLM、Ollama 等）
- 第三方 AI 代理服务

## 使用方法

### 模型切换

**macOS/Linux:**
```bash
./claude claude      # 切换到 Claude
./claude gemini      # 切换到 Gemini
./claude deepseek    # 切换到 DeepSeek
./claude qwen        # 切换到 Qwen
./claude kimi        # 切换到 Kimi
./claude glm         # 切换到 GLM 4.5
./claude ollama      # 切换到 Ollama（本地，无需 API key）
```

**Windows:**
```cmd
claude.bat claude    # 切换到 Claude
claude.bat gemini    # 切换到 Gemini
claude.bat deepseek  # 切换到 DeepSeek
claude.bat qwen      # 切换到 Qwen
claude.bat kimi      # 切换到 Kimi
claude.bat glm       # 切换到 GLM 4.5
claude.bat ollama    # 切换到 Ollama（本地，无需 API key）
```

### 自定义模型管理

**macOS/Linux:**
```bash
./claude myapi        # 创建自定义模型
./claude custom       # 列出自定义模型
./claude myapi -e     # 编辑自定义模型
./claude delete myapi # 删除自定义模型
```

**Windows:**
```cmd
claude.bat myapi        # 创建自定义模型
claude.bat custom       # 列出自定义模型
claude.bat myapi -e     # 编辑自定义模型
claude.bat delete myapi # 删除自定义模型
```

### 其他命令

**macOS/Linux:**
```bash
./claude list      # 查看所有模型
./claude current   # 查看当前激活的模型
./claude web       # 启动 Web 界面
./claude help      # 显示帮助信息
```

**Windows:**
```cmd
claude.bat list    # 查看所有模型
claude.bat current # 查看当前激活的模型
claude.bat web     # 启动 Web 界面
claude.bat help    # 显示帮助信息
```

## Web 界面

### 启动方式

**macOS/Linux:**
```bash
./claude web
./claude ui
```

**Windows:**
```cmd
claude.bat web
claude.bat ui
```

### 界面特性

- **现代化设计** - Apple 风格界面，支持深色模式
- **响应式布局** - 完美适配手机、平板、桌面设备
- **PWA 支持** - 可添加到主屏幕，像原生应用一样使用
- **实时状态** - 显示各模型连接状态和系统概览
- **智能搜索** - 支持模型名称、标识、API 地址全文搜索

### 访问地址

- **本地访问**: http://localhost:3000
- **局域网访问**: http://你的IP:3000 （需配置防火墙）

## 🌐 部署到云端（免费）

将本项目的 Web 界面部署到云端，无需本地运行，随时随地通过公网访问。

### 方式一：部署到 Render（推荐，免费）

[Render](https://render.com) 提供免费 Node.js 托管，支持从 GitHub 自动部署。

#### 部署步骤

**方法 A：一键部署（推荐）**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/TERRYdu201/claude-model-switcher)

点击上方按钮 → 登录 Render → 自动识别配置 → 点击 "Apply" → 等待 2-3 分钟部署完成。

**方法 B：手动部署**

1. **将代码推送到 GitHub**
   ```bash
   git add .
   git commit -m "Add deployment config"
   git push origin main
   ```

2. **登录 Render** → https://dashboard.render.com

3. **创建 Web Service**
   - 点击 **"New +"** → **"Web Service"**
   - 连接你的 GitHub 仓库
   - Render 会自动检测到项目设置

4. **配置服务**
   | 配置项 | 填写内容 |
   |-------|---------|
   | **Name** | `claude-ai-model-hub`（任意） |
   | **Region** | `Singapore`（亚洲，访问最快） |
   | **Branch** | `main` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm run start:web` |
   | **Plan** | **Free** ✅ |

5. **点击 "Create Web Service"**

6. **等待部署完成**（约 2-3 分钟），部署成功后你会看到：
   ```
   Your service is live 🎉
   https://claude-ai-model-hub.onrender.com
   ```

#### 访问地址

部署完成后，你的 Web UI 就会在以下地址永久运行：
```
https://claude-ai-model-hub.onrender.com
```

> ⚠️ Render 免费计划说明：
> - 服务在 15 分钟无访问后会进入睡眠（冷启动约 30 秒）
> - 每月 750 小时免费运行时间（足够个人使用）
> - 支持自定义域名（需付费）

### 方式二：部署到 Railway（备用选择）

[Railway](https://railway.app) 也是优秀的 Node.js 部署平台。

1. **登录 Railway** → 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. **连接你的仓库**
4. 在 **Settings** 中设置：
   - **Start Command**: `npm run start:web`
5. 在 **Variables** 中添加：
   - `NODE_ENV` = `production`
6. Railway 会自动检测并部署

#### 访问地址

```
https://你的项目名.up.railway.app
```

> Railway 免费计划每月提供 $5 额度，足以运行本项目。

### 部署后功能说明

云端部署的 Web UI 保持完整功能：

| 功能 | 状态 |
|------|------|
| 📱 响应式界面 | ✅ 正常 |
| 🎯 模型切换 | ✅ 正常（需在服务端配置 API 密钥） |
| ⚙️ 配置编辑 | ✅ 正常 |
| 📊 状态监控 | ✅ 正常 |
| 🌙 深色模式 | ✅ 正常 |

> **注意**：部署到云端后，模型切换会影响服务器上的 Claude Code 配置，而非你的本地环境。建议将云端版本作为 UI 展示和管理面板使用。如需完整的本地模型管理功能，请使用命令行工具。

### 在 Render 上配置 API 密钥（推荐方法）

部署到 Render 后，不要在网页界面上直接输入敏感 API 密钥（不安全）。推荐通过 **Render 环境变量** 配置：

1. 打开 https://dashboard.render.com → 点击你的服务
2. 点 **Environment** 标签页
3. 点击 **Add Environment Variable**
4. 添加以下变量（只需要你有密钥的模型）：

| 环境变量名 | 对应模型 | 获取地址 |
|-----------|---------|---------|
| `ANTHROPIC_API_KEY` | Claude | https://console.anthropic.com |
| `DEEPSEEK_API_KEY` | DeepSeek | https://platform.deepseek.com |
| `GEMINI_API_KEY` | Gemini | https://aistudio.google.com |
| `QWEN_API_KEY` | Qwen (通义千问) | https://dashscope.aliyun.com |
| `MOONSHOT_API_KEY` | Kimi | https://kimi.moonshot.cn |
| `GLM_API_KEY` | GLM (智谱) | https://open.bigmodel.cn |

5. 点击 **Save Changes**
6. 然后 **Manual Deploy** → **Deploy latest commit**

服务器会自动读取这些环境变量填充到各模型的 API 密钥中，无需手动输入。

### 通过 Web UI 迁移配置（从本地到云端）

如果本地已经配置好所有模型，可以通过导出/导入功能迁移到云端：

1. **在本地** (http://localhost:3000):
   - 点击顶部的 **「配置管理」** 按钮
   - 点击 **「复制配置」** 导出设置

2. **在云端** (https://claude-model-switcher.onrender.com):
   - 点击顶部的 **「配置管理」** → 在导入区粘贴
   - 点击 **「导入配置」**
   - 然后点击 **「API密钥」** 按钮批量设置各模型的密钥

> ⚠️ 导出配置不会包含 API 密钥本身，密钥需要通过环境变量或手动输入。这保证了密钥安全。

## API 密钥配置

### 自动配置（推荐）

首次切换到新模型时，程序会自动提示输入 API 密钥：

```bash
$ ./claude kimi
Switching to kimi...
Kimi (Moonshot) requires an API key
? Would you like to configure the API key for Kimi (Moonshot) now? (Y/n) y
? Enter API key for Kimi (Moonshot): ********
API key saved for Kimi (Moonshot)
Switching to Kimi (Moonshot)...
Successfully switched to Kimi (Moonshot)
```

### 手动编辑配置

使用 `-e` 标志可以随时编辑模型配置：

```bash
$ ./claude deepseek -e
Editing configuration for DeepSeek

? Base URL: https://api.deepseek.com/anthropic
? API Key (DEEPSEEK_API_KEY): ********
Configuration updated for DeepSeek
```

### 配置文件位置

**macOS/Linux:**
```bash
~/.claude-model-switcher/config.json
```

**Windows:**
```cmd
%USERPROFILE%\.claude-model-switcher\config.json
```

## API 端点配置

程序已预配置了所有主流 AI 模型的 API 端点：

- **Claude**: `https://api.anthropic.com`
- **Gemini**: `https://generativelanguage.googleapis.com/v1beta`
- **DeepSeek**: `https://api.deepseek.com/anthropic`
- **Qwen**: `https://dashscope.aliyuncs.com/apps/anthropic`
- **Kimi**: `https://api.moonshot.cn/anthropic`
- **GLM 4.5**: `https://open.bigmodel.cn/api/anthropic`
- **Ollama**: `http://localhost:11434/v1`

## 工作原理

程序通过以下方式确保 API 密钥不会互相覆盖：

1. **独立存储** - 每个模型的 API 密钥单独保存在配置文件中
2. **动态映射** - 切换时将当前模型的 API 密钥映射到 `ANTHROPIC_API_KEY`
3. **环境隔离** - Claude Code 始终使用 `ANTHROPIC_API_KEY`，但实际指向不同模型的密钥
4. **即时应用** - 环境变量在当前 shell 会话中立即生效

### 平台特定实现

**macOS/Linux:**
- 程序修改 shell 配置文件（~/.zshrc）中的环境变量
- 设置 `ANTHROPIC_BASE_URL` 指向选定模型的 API 端点
- 配置相应的 API 密钥环境变量
- Claude Code 会自动使用新的配置

**Windows:**
- 程序直接更新 Claude Code 的 settings.json 文件
- 无需修改系统环境变量
- 配置立即生效，无需重启终端
- 支持 CMD、PowerShell、Windows Terminal

## 系统要求

- **操作系统**:
  - macOS 10.14+ （完整功能支持）
  - Windows 10/11 （核心功能支持）
  - Linux （基础功能支持）
- **Node.js**: 14.0.0 或更高版本
- **Shell**:
  - macOS: zsh（默认）、bash
  - Windows: CMD、PowerShell、Windows Terminal
  - Linux: bash、zsh

## 使用限制

- **macOS/Linux**: 切换模型后需要重启终端或运行 `source ~/.zshrc`
- **Windows**: 配置立即生效，无需重启终端
- Ollama 需要本地安装并运行
- 各个云端模型需要有效的 API 密钥
- 程序会自动备份原有的环境变量配置

## 故障排除

### 常见问题

1. **权限错误**:
   - **macOS/Linux**: 确保脚本有执行权限 `chmod +x claude`
   - **Windows**: 确保可以执行批处理文件，检查文件关联

2. **模块未找到**: 运行 `npm install` 安装依赖

3. **API 连接失败**: 检查 API 密钥和网络连接

4. **环境变量未生效**:
   - **macOS/Linux**: 重启终端或手动 source 配置文件
   - **Windows**: 配置应该立即生效，检查 Claude Code 安装路径

5. **Windows 下 Claude Code 找不到配置**:
   - 检查 `C:\Users\[用户名]\AppData\Roaming\Anthropic\Claude\settings.json`
   - 或 `C:\Users\[用户名]\.claude\settings.json`
   - 确保 Claude Code 已正确安装

6. **Windows 批处理文件无法运行**:
   - 检查文件关联：`.bat` 文件应关联到 `cmd.exe`
   - 尝试右键选择"以管理员身份运行"
   - 检查 Windows Defender 是否阻止了脚本执行

7. **Node.js 未找到**:
   - **Windows**: 确保 Node.js 已安装并添加到 PATH 环境变量
   - 运行 `node --version` 检查安装状态
   - 重新安装 Node.js 或修复 PATH 设置

### 手动重置

如果出现问题，可以手动清理配置：

**macOS/Linux:**
```bash
rm -rf ~/.claude-model-switcher
# 手动编辑 ~/.zshrc 或 ~/.bashrc 移除相关环境变量
```

**Windows:**
```cmd
rmdir /s "%USERPROFILE%\.claude-model-switcher"
# 手动删除 %APPDATA%\Anthropic\Claude\settings.json 中的相关配置
```

### Windows 特定重置步骤

1. **清理配置文件**:
   ```cmd
   rmdir /s "%USERPROFILE%\.claude-model-switcher"
   ```

2. **重置 Claude Code 设置**:
   - 删除 `%APPDATA%\Anthropic\Claude\settings.json`
   - 或删除 `%USERPROFILE%\.claude\settings.json`

3. **重新安装依赖**:
   ```cmd
   npm install
   ```

4. **测试安装**:
   ```cmd
   claude.bat help
   ```

## 开发

**macOS/Linux:**
```bash
npm start                    # 开发模式运行
npm run cli                  # 运行 CLI
node src/index.js <model>    # 测试特定模型
```

**Windows:**
```cmd
npm start                    # 开发模式运行
npm run cli                  # 运行 CLI
node src/index.js <model>    # 测试特定模型
claude.bat <model>           # 或使用批处理文件
```

### 开发环境设置

**跨平台开发注意事项**:
- 使用 `.gitattributes` 确保文件换行符正确
- Windows 开发者需要安装 Git for Windows
- 建议使用 VS Code 或其他支持跨平台的编辑器
- 测试时确保在目标平台上验证功能

## 更新日志

### v2.0.0 - 2025年10月 (当前版本)

**重大更新：Apple 风格 Web UI + 现代化界面**

#### 新增功能
- **Apple 风格 Web 界面** - 采用 macOS 设计语言的现代化 H5 界面
- **PWA 支持** - 可添加到手机主屏幕，像原生应用一样使用
- **深色模式** - 自动检测系统主题，支持深色/浅色模式切换
- **智能搜索** - 支持模型名称、标识、API 地址全文搜索
- **批量操作** - 支持批量测试连接、批量状态刷新
- **可视化状态** - 实时显示各模型连接状态和系统概览

#### 界面优化
- **现代化设计** - 毛玻璃效果、精致圆角、系统字体
- **响应式布局** - 完美适配手机、平板、桌面设备
- **流畅动画** - 悬停效果、模态框过渡、按钮交互动画
- **触控优化** - 按钮大小适合触摸操作，防止误触

#### 功能改进
- **统一品牌** - 系统标题更新为"Claude Code AI Model Hub"
- **架构优化** - 合并双 Node.js 项目为单项目架构
- **性能提升** - 优化 API 响应速度和界面加载性能
- **体验升级** - 改进删除按钮布局，避免卡片拥挤

#### 技术升级
- **模块化设计** - Web 服务器独立封装，代码更清晰
- **依赖优化** - 统一依赖管理，减少重复安装
- **错误处理** - 增强异常处理和用户反馈

### v1.0.0 - 初始版本
- 基础 CLI 功能：模型切换、配置管理
- 支持 7 个主流 AI 模型
- 智能 API 密钥管理系统