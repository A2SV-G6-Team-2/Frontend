export type ExpenseLogRow = {
    id: string;
    description: string;
    expenseDate: string;
    categoryId: string;
    categoryName: string;
    amount: number;
};

export type NewExpenseInput = {
    description: string;
    amount: number;
    expenseDate: string;
    categoryId: string;
    categoryName: string;
};
