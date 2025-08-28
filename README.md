# PomoDash MCP Server

A Model Context Protocol (MCP) server that connects AI assistants to PomoDash for seamless task and project management.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://hub.docker.com/r/mcp/pomodash)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/DannyyTv/pomodash-mcp-server)

## Features

- **Task Management**: Create, list, update, and delete tasks
- **Notes System**: Create and manage notes linked to tasks/projects
- **Categories & Projects**: Organize your work with categories and projects
- **Secure Authentication**: API key-based authentication with rate limiting
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Prerequisites

- **Premium PomoDash Account**: MCP integration requires a premium subscription
- **API Key**: Generate an API key in PomoDash Settings → API Keys
- **Node.js 20+** (for local development) or **Docker** (for containerized deployment)

## Quick Start with Docker Desktop

### 1. Generate API Key in PomoDash

1. **Open PomoDash** in your browser and log in
2. **Navigate to Settings** → Click on your profile → Settings
3. **Go to API Keys section** → Look for "API Keys" in the settings menu
4. **Click "Generate New Key"** → This creates a new API key for MCP access
5. **Copy the key immediately** → Format looks like `pmk_abc123...` 
6. **⚠️ Important**: You can only see this key once! Save it somewhere safe.

### 2. Setup Environment File

1. **Download this repository** or clone it to your computer
2. **Navigate to the pomodash-mcp-server folder**
3. **Find the file `.env.example`** in the folder
4. **Make a copy** and rename it to `.env` (remove the .example part)
5. **Open the `.env` file** with any text editor (Notepad, TextEdit, VS Code, etc.)
6. **Replace `pmk_your_api_key_here`** with your actual API key from step 1
7. **Save the file**

Your `.env` file should look like this:
```
POMODASH_API_KEY=pmk_abc123your_real_key_here
POMODASH_API_URL=https://mcp.pomodash.mindsnapz.de
NODE_ENV=production
```

### 3. Using Docker Desktop App

#### Option A: Using Docker Compose (Easiest)
1. **Open Docker Desktop** application on your computer
2. **Make sure Docker Desktop is running** (you'll see the Docker whale icon)
3. **Open Terminal/Command Prompt** and navigate to the pomodash-mcp-server folder
4. **Run the command**: `docker-compose up --build`
5. **Go back to Docker Desktop** → You'll see a new container called "pomodash-mcp-server"
6. **The container is now running!** You can see logs, stop/start it from Docker Desktop

#### Option B: Build and Run Manually in Docker Desktop
1. **Open Docker Desktop** application
2. **Open Terminal** and navigate to the pomodash-mcp-server folder
3. **Build the image**: `docker build -t pomodash-mcp-server .`
4. **Go to Docker Desktop** → Images tab → You'll see "pomodash-mcp-server"
5. **Click the "Run" button** next to the image
6. **In the run dialog**:
   - Click "Optional Settings"
   - Go to "Environment variables"
   - Add: `POMODASH_API_KEY` = `your_api_key`
   - Add: `POMODASH_API_URL` = `https://mcp.pomodash.mindsnapz.de`
   - Check "Interactive" and "TTY" options
7. **Click "Run"** → Container starts and appears in Containers tab

### 4. Verify It's Working

1. **In Docker Desktop**, go to Containers tab
2. **Find "pomodash-mcp-server"** container
3. **Click on it** to see details
4. **Look at the "Logs" tab** → Should show "PomoDash MCP Server running on stdio"
5. **If you see errors**, check that your API key is correct and your PomoDash account is Premium

## Local Development

### Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start in development mode
npm run dev
```

### Run the server

```bash
# With environment variables set
POMODASH_API_KEY=pmk_your_key node dist/index.js

# Or with .env file
npm start
```

## Connect to Claude Desktop or Windsurf

Once your Docker container is running, you need to connect it to your AI assistant.

### For Claude Desktop Users

1. **Find your Claude Desktop config file**:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Open the config file** with any text editor

3. **Add this configuration** (replace the path with your actual path):

```json
{
  "mcpServers": {
    "pomodash": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i", 
        "--env-file", "/full/path/to/pomodash-mcp-server/.env",
        "pomodash-mcp-server"
      ],
      "cwd": "/full/path/to/pomodash-mcp-server"
    }
  }
}
```

4. **Replace `/full/path/to/pomodash-mcp-server`** with the actual path to your folder
5. **Save the file** and **restart Claude Desktop**
6. **Test it**: Ask Claude "What tasks do I have in PomoDash?"

### For Windsurf Users

1. **Open Windsurf** and go to settings
2. **Find MCP Settings** (usually in Extensions or AI settings)
3. **Add a new MCP server** with these settings:
   - **Name**: `pomodash`
   - **Command**: `docker`
   - **Arguments**: 
     ```
     run
     --rm
     -i
     --env-file
     /full/path/to/pomodash-mcp-server/.env
     pomodash-mcp-server
     ```
   - **Working Directory**: `/full/path/to/pomodash-mcp-server`

4. **Replace the path** with your actual folder location
5. **Save and restart Windsurf**
6. **Test it**: Ask the AI "Show me my PomoDash tasks"

### Alternative: Local Node.js Setup (Without Docker)

If you prefer not to use Docker:

1. **Build the project**: `npm run build` in the pomodash-mcp-server folder
2. **Use this config instead**:

```json
{
  "mcpServers": {
    "pomodash": {
      "command": "node",
      "args": ["/full/path/to/pomodash-mcp-server/dist/index.js"],
      "env": {
        "POMODASH_API_KEY": "pmk_your_api_key_here",
        "POMODASH_API_URL": "https://mcp.pomodash.mindsnapz.de"
      }
    }
  }
}
```

## Quick Start

### Using Docker (Recommended)

1. **Generate PomoDash API Key**
   - Open [PomoDash](https://pomodash.mindsnapz.de) → Settings → API Keys
   - Click "Generate New Key" (Premium account required)
   - Copy the key (format: `pmk_...`)

2. **Run with Docker**
   ```bash
   docker run --rm -i \
     -e POMODASH_API_KEY=pmk_your_api_key_here \
     mcp/pomodash
   ```

3. **Configure AI Assistant**
   - **Claude Desktop**: Add to `claude_desktop_config.json`
   - **Windsurf**: Add to MCP settings
   - **VS Code**: Configure in `.vscode/mcp.json`

### Docker Desktop MCP Toolkit

If you have Docker Desktop with MCP Toolkit enabled:

1. Search for "PomoDash" in MCP Catalog
2. Click "Install" 
3. Enter your API key
4. Connect to your AI assistant

## Manual Setup

## Available Tools

The MCP server provides these tools to AI assistants:

### Tasks
- `create_task` - Create a new task
- `list_tasks` - List all tasks
- `update_task` - Update an existing task
- `delete_task` - Delete a task
- `create_task_for_project` - Create a task linked to a project

### Notes
- `create_note` - Create a new note
- `list_notes` - List all notes
- `update_note` - Update an existing note
- `delete_note` - Delete a note

### Categories & Projects
- `list_categories` - List all categories and projects
- `create_category` - Create a new category or project

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POMODASH_API_KEY` | ✅ | - | Your PomoDash API key |
| `POMODASH_API_URL` | ❌ | `https://mcp.pomodash.mindsnapz.de` | API base URL |
| `NODE_ENV` | ❌ | - | Node environment |

## Testing

### Test Docker Build

```bash
./test-docker.sh
```

### Manual Testing

```bash
# Test API connection
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://mcp.pomodash.mindsnapz.de/tasks

# Test container health
docker ps
docker logs pomodash-mcp-server
```

## Troubleshooting

### Common Issues

**"POMODASH_API_KEY environment variable is required"**
- Ensure your `.env` file contains a valid API key
- Check that the key format starts with `pmk_`

**"401 Invalid API key"**
- Verify your API key is correct and active
- Check if your premium subscription is active

**"403 Premium required"**
- Upgrade to a premium PomoDash account
- Verify your subscription status in account settings

**"429 Rate limit exceeded"**
- You've hit the daily API limit
- Wait for the daily reset or contact support

**Container won't start**
- Check Docker logs: `docker logs pomodash-mcp-server`
- Verify `.env` file exists and contains valid values
- Ensure Docker has sufficient resources

### Docker Debugging

```bash
# View container logs
docker-compose logs -f pomodash-mcp-server

# Check container status
docker-compose ps

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Security

- **Never commit API keys** to version control
- **Rotate keys regularly** in PomoDash settings
- **Use environment variables** for sensitive data
- **Keep Docker images updated** for security patches

## Support

For issues related to:
- **MCP Server**: Check this repository's issues
- **PomoDash API**: Contact PomoDash support
- **MCP Protocol**: See [Model Context Protocol docs](https://modelcontextprotocol.io/)