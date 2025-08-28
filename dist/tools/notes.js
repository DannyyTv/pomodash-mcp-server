import { notesClient } from '../api-client.js';
export const noteTools = [
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
    }
];
export async function handleNoteTool(name, arguments_) {
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
                const notesList = notes.map((note) => `📝 ${note.reference_type} (${note.id})\n   Created: ${new Date(note.created_at).toLocaleDateString()}\n   Content: ${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}`).join('\n\n');
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
            default:
                throw new Error(`Unknown note tool: ${name}`);
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
//# sourceMappingURL=notes.js.map