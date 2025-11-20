export declare class GenerateRequestDto {
    categoryId: string;
    aiModelId: string;
    data: Record<string, any>;
}
export declare class GenerateResponseDto {
    transactionId: string;
    taskId: string;
    status: string;
    message: string;
}
