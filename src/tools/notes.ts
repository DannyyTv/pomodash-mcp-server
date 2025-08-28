import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { notesClient } from '../api-client.js';

export const noteTools: Tool[] = [
  {
    name: 'create_note',
    description: 'Create a new note in PomoDash',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Note content (required)'
        },
        reference_type: {
          type: 'string',
          enum: ['general', 'task', 'project', 'category'],
          description: 'Type of reference (default: general)'
        },
        reference_id: {
          type: 'string',
          description: 'Reference ID (default: general)'
        }
      },
      required: ['content']
    }
  },
  {
    name: 'list_notes',
    description: 'List all notes',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'update_note',
    description: 'Update an existing note',
    inputSchema: {
      type: 'object',
      properties: {
        note_id: {
          type: 'string',
          description: 'Note ID to update (required)'
        },
        content: {
          type: 'string',
          description: 'New note content (optional)'
        }
      },
      required: ['note_id']
    }
  },
  {
    name: 'delete_note',
    description: 'Delete a note',
    inputSchema: {
      type: 'object',
      properties: {
        note_id: {
          type: 'string',
          description: 'Note ID to delete (required)'
        }
      },
      required: ['note_id']
    }
  },
  {
    name: 'create_note_for_task',
    description: 'Create a note linked to a specific task',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'ID of the task to link the note to (required)'
        },
        content: {
          type: 'string',
          description: 'Note content (required)'
        }
      },
      required: ['task_id', 'content']
    }
  },
  {
    name: 'create_note_for_project',
    description: 'Create a note linked to a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'ID of the project to link the note to (required)'
        },
        content: {
          type: 'string',
          description: 'Note content (required)'
        }
      },
      required: ['project_id', 'content']
    }
  },
  {
    name: 'list_note_references',
    description: 'List available tasks and projects for note linking',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];

export async function handleNoteTool(name: string, arguments_: any) {
  try {
    switch (name) {
      case 'create_note': {
        const response = await notesClient.post('', arguments_);
        return {
          content: [{
            type: 'text',
            text: `✅ Note created successfully!\n\nContent: ${response.data.note.content.substring(0, 150)}${response.data.note.content.length > 150 ? '...' : ''}\nReference: ${response.data.note.reference_type}`
          }]
        };
      }

      case 'list_notes': {
        const response = await notesClient.get('');
        const notes = response.data.notes || [];
        
        if (notes.length === 0) {
          return {
            content: [{
              type: 'text',
              text: '📚 No notes found.'
            }]
          };
        }

        const notesList = notes.map((note: any) => 
          `📝 ${note.reference_type} (${note.id})\n   Created: ${new Date(note.created_at).toLocaleDateString()}\n   Content: ${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}`
        ).join('\n\n');

        return {
          content: [{
            type: 'text',
            text: `📚 Found ${notes.length} notes:\n\n${notesList}`
          }]
        };
      }

      case 'update_note': {
        const { note_id, ...updateData } = arguments_;
        const response = await notesClient.put(`/${note_id}`, updateData);
        return {
          content: [{
            type: 'text',
            text: `✅ Note updated successfully!\n\nContent: ${response.data.note.content.substring(0, 150)}${response.data.note.content.length > 150 ? '...' : ''}`
          }]
        };
      }

      case 'delete_note': {
        await notesClient.delete(`/${arguments_.note_id}`);
        return {
          content: [{
            type: 'text',
            text: `✅ Note deleted successfully! (ID: ${arguments_.note_id})`
          }]
        };
      }

      case 'create_note_for_task': {
        const { task_id, content } = arguments_;
        
        // Task-Existenz prüfen
        const tasksResponse = await notesClient.get('../tasks');
        const tasks = tasksResponse.data.tasks || [];
        const taskExists = tasks.find((task: any) => task.id === task_id);
        
        if (!taskExists) {
          throw new Error(`Task with ID ${task_id} not found`);
        }
        
        // Note mit Task-Verknüpfung erstellen
        const noteData = {
          content,
          reference_type: 'task',
          reference_id: task_id
        };
        
        const response = await notesClient.post('', noteData);
        return {
          content: [{
            type: 'text',
            text: `✅ Task note created successfully!\n\nLinked to: ${taskExists.title}\nContent: ${response.data.note.content.substring(0, 150)}${response.data.note.content.length > 150 ? '...' : ''}`
          }]
        };
      }

      case 'create_note_for_project': {
        const { project_id, content } = arguments_;
        
        // Project-Existenz prüfen
        const categoriesResponse = await notesClient.get('../categories');
        const projects = categoriesResponse.data.projects || [];
        const projectExists = projects.find((project: any) => project.id === project_id);
        
        if (!projectExists) {
          throw new Error(`Project with ID ${project_id} not found`);
        }
        
        // Note mit Project-Verknüpfung erstellen
        const noteData = {
          content,
          reference_type: 'project',
          reference_id: project_id
        };
        
        const response = await notesClient.post('', noteData);
        return {
          content: [{
            type: 'text',
            text: `✅ Project note created successfully!\n\nLinked to: ${projectExists.name}\nContent: ${response.data.note.content.substring(0, 150)}${response.data.note.content.length > 150 ? '...' : ''}`
          }]
        };
      }

      case 'list_note_references': {
        try {
          // Tasks und Projects parallel laden
          const [tasksResponse, categoriesResponse] = await Promise.all([
            notesClient.get('../tasks'),
            notesClient.get('../categories')
          ]);
          
          const tasks = tasksResponse.data.tasks || [];
          const projects = categoriesResponse.data.projects || [];
          
          let referencesList = '';
          
          if (tasks.length > 0) {
            referencesList += '📋 **Available Tasks:**\n';
            tasks.slice(0, 10).forEach((task: any) => {
              referencesList += `   • ${task.title} (ID: ${task.id})\n`;
            });
            if (tasks.length > 10) {
              referencesList += `   ... and ${tasks.length - 10} more tasks\n`;
            }
            referencesList += '\n';
          }
          
          if (projects.length > 0) {
            referencesList += '📁 **Available Projects:**\n';
            projects.slice(0, 10).forEach((project: any) => {
              referencesList += `   • ${project.name} (ID: ${project.id})\n`;
            });
            if (projects.length > 10) {
              referencesList += `   ... and ${projects.length - 10} more projects\n`;
            }
          }
          
          if (referencesList === '') {
            referencesList = '📝 No tasks or projects available for linking.';
          } else {
            referencesList += '\n💡 Use `create_note_for_task` or `create_note_for_project` with the respective ID to create linked notes.';
          }
          
          return {
            content: [{
              type: 'text',
              text: referencesList
            }]
          };
        } catch (error: any) {
          return {
            content: [{
              type: 'text',
              text: `❌ Error loading references: ${error.response?.data?.error || error.message}`
            }]
          };
        }
      }

      default:
        throw new Error(`Unknown note tool: ${name}`);
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