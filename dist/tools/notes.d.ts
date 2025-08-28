import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const noteTools: Tool[];
export declare function handleNoteTool(name: string, arguments_: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
