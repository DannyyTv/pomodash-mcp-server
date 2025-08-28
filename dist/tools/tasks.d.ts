import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const taskTools: Tool[];
export declare function handleTaskTool(name: string, arguments_: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
