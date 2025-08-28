import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { categoriesClient } from '../api-client.js';

export const categoryTools: Tool[] = [
  {
    name: 'list_categories',
    description: 'List all categories and projects',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'create_category',
    description: 'Create a new category or project',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Category/Project name (required)'
        },
        color: {
          type: 'string',
          description: 'Category color (default: #3b82f6)'
        },
        is_project: {
          type: 'boolean',
          description: 'Whether this is a project (default: false)'
        }
      },
      required: ['name']
    }
  }
];

export async function handleCategoryTool(name: string, arguments_: any) {
  try {
    switch (name) {
      case 'list_categories': {
        const response = await categoriesClient.get('');
        const categories = response.data.categories || [];
        const projects = response.data.projects || [];
        
        if (categories.length === 0 && projects.length === 0) {
          return {
            content: [{
              type: 'text',
              text: '🏷️ No categories or projects found.'
            }]
          };
        }

        let result = '';
        
        if (categories.length > 0) {
          const categoriesList = categories.map((category: any) => 
            `🏷️ ${category.name} (${category.id})\n   Color: ${category.color}`
          ).join('\n\n');
          result += `🏷️ Found ${categories.length} categories:\n\n${categoriesList}`;
        }
        
        if (projects.length > 0) {
          if (result) result += '\n\n';
          const projectsList = projects.map((project: any) => 
            `📁 ${project.name} (${project.id})\n   Color: ${project.color}`
          ).join('\n\n');
          result += `📁 Found ${projects.length} projects:\n\n${projectsList}`;
        }

        return {
          content: [{
            type: 'text',
            text: result
          }]
        };
      }

      case 'create_category': {
        const response = await categoriesClient.post('', arguments_);
        const type = arguments_.is_project ? 'Project' : 'Category';
        return {
          content: [{
            type: 'text',
            text: `✅ ${type} created successfully!\n\nName: ${response.data.category.name}\nColor: ${response.data.category.color}`
          }]
        };
      }

      default:
        throw new Error(`Unknown category tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{
        type: 'text',
        text: `❌ Error: ${error.response?.data?.error || error.message}`
      }]
    };
  }
}