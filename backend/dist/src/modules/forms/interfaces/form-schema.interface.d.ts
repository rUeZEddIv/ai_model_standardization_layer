export interface FormFieldSchema {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'file' | 'toggle' | 'array';
    required: boolean;
    placeholder?: string;
    options?: Array<{
        label: string;
        value: string | number;
    }>;
    defaultValue?: any;
    min?: number;
    max?: number;
    accept?: string;
    multiple?: boolean;
    subSchema?: FormFieldSchema[];
}
export interface FormSchema {
    meta: {
        categoryId: string;
        categoryName: string;
        selectedModel?: string;
        availableModels?: Array<{
            id: string;
            name: string;
            provider: string;
        }>;
    };
    schema: FormFieldSchema[];
}
export interface CategoryDefinition {
    requiredFields: string[];
    optionalFields: string[];
    configFields: string[];
}
