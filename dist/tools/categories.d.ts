import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const categoryTools: Tool[];
export declare function handleCategoryTool(name: string, arguments_: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
