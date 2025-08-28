import { tasksClient } from '../api-client.js';
export const taskTools = [
    {
        name: 'create_task',
        description: 'Create a new task in PomoDash',
        inputSchema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Task title (required)'
                },
                description: {
                    type: 'string',
                    description: 'Task description (optional)'
                },
                due_date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Due date in ISO format (optional)'
                },
                priority: {
                    type: 'string',
                    enum: ['low', 'medium', 'high'],
                    description: 'Task priority (default: medium)'
                },
                start_time: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start time for timeboxing (optional)'
                },
                end_time: {
                    type: 'string',
                    format: 'date-time',
                    description: 'End time for timeboxing (optional)'
                }
            },
            required: ['title']
        }
    },
    {
        name: 'list_tasks',
        description: 'List all tasks',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'update_task',
        description: 'Update an existing task',
        inputSchema: {
            type: 'object',
            properties: {
                task_id: {
                    type: 'string',
                    description: 'Task ID to update (required)'
                },
                title: {
                    type: 'string',
                    description: 'New task title (optional)'
                },
                description: {
                    type: 'string',
                    description: 'New task description (optional)'
                },
                status: {
                    type: 'string',
                    enum: ['pending', 'in_progress', 'completed', 'archived'],
                    description: 'New task status (optional)'
                },
                priority: {
                    type: 'string',
                    enum: ['low', 'medium', 'high'],
                    description: 'New task priority (optional)'
                }
            },
            required: ['task_id']
        }
    },
    {
        name: 'delete_task',
        description: 'Delete a task',
        inputSchema: {
            type: 'object',
            properties: {
                task_id: {
                    type: 'string',
                    description: 'Task ID to delete (required)'
                }
            },
            required: ['task_id']
        }
    }
];
export async function handleTaskTool(name, arguments_) {
    try {
        switch (name) {
            case 'create_task': {
                const response = await tasksClient.post('', arguments_);
                return {
                    content: [{
                            type: 'text',
                            text: `✅ Task created successfully!\n\nTitle: ${response.data.task.title}\nStatus: ${response.data.task.status}\nPriority: ${response.data.task.priority}`
                        }]
                };
            }
            case 'list_tasks': {
                const response = await tasksClient.get('');
                const tasks = response.data.tasks || [];
                if (tasks.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: '📝 No tasks found.'
                            }]
                    };
                }
                const taskList = tasks.map((task) => `📋 ${task.title} (${task.id})\n   Status: ${task.status} | Priority: ${task.priority}${task.due_date ? ` | Due: ${new Date(task.due_date).toLocaleDateString()}` : ''}`).join('\n\n');
                return {
                    content: [{
                            type: 'text',
                            text: `📝 Found ${tasks.length} tasks:\n\n${taskList}`
                        }]
                };
            }
            case 'update_task': {
                const { task_id, ...updateData } = arguments_;
                const response = await tasksClient.put(`/${task_id}`, updateData);
                return {
                    content: [{
                            type: 'text',
                            text: `✅ Task updated successfully!\n\nTitle: ${response.data.task.title}\nStatus: ${response.data.task.status}`
                        }]
                };
            }
            case 'delete_task': {
                await tasksClient.delete(`/${arguments_.task_id}`);
                return {
                    content: [{
                            type: 'text',
                            text: `✅ Task deleted successfully! (ID: ${arguments_.task_id})`
                        }]
                };
            }
            default:
                throw new Error(`Unknown task tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [{
                    type: 'text',
                    text: `❌ Error: ${error.response?.data?.error || error.message}`
                }]
        };
    }
}
//# sourceMappingURL=tasks.js.map