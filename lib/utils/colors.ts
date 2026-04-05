export const categoryColorMap: Record<string, { hex: string, classes: string }> = {
    food: { hex: '#ec4899', classes: 'bg-pink-100/60 text-pink-600' },
    transport: { hex: '#10b981', classes: 'bg-emerald-100/60 text-emerald-600' },
    rent: { hex: '#a855f7', classes: 'bg-purple-100/60 text-purple-600' },
    entertainment: { hex: '#f59e0b', classes: 'bg-amber-100/60 text-amber-600' },
    health: { hex: '#f43f5e', classes: 'bg-rose-100/60 text-rose-600' },
    utilities: { hex: '#06b6d4', classes: 'bg-cyan-100/60 text-cyan-600' },
    shopping: { hex: '#6366f1', classes: 'bg-indigo-100/60 text-indigo-600' },
    education: { hex: '#8b5cf6', classes: 'bg-violet-100/60 text-violet-600' },
    income: { hex: '#14b8a6', classes: 'bg-teal-100/60 text-teal-600' },
    other: { hex: '#3b82f6', classes: 'bg-blue-100/50 text-blue-600' }
};

export const getCategoryColor = (name: string = '') => {
    const t = name.toLowerCase();
    if (t.includes('subscription') || t.includes('netflix') || t.includes('streaming'))
        return categoryColorMap.entertainment;
    if (t.includes('drink') || t.includes('coffee') || t.includes('beverage'))
        return categoryColorMap.utilities;
    if (t.includes('food') || t.includes('restaurant') || t.includes('cafe'))
        return categoryColorMap.food;
    if (t.includes('transport') || t.includes('taxi') || t.includes('bus') || t.includes('fuel')) 
        return categoryColorMap.transport;
    if (t.includes('rent') || t.includes('housing') || t.includes('home')) 
        return categoryColorMap.rent;
    if (t.includes('entertainment') || t.includes('movie') || t.includes('game') || t.includes('hobby')) 
        return categoryColorMap.entertainment;
    if (t.includes('health') || t.includes('medical') || t.includes('gym') || t.includes('pharmacy')) 
        return categoryColorMap.health;
    if (t.includes('utilit') || t.includes('bill') || t.includes('electricity') || t.includes('water') || t.includes('internet')) 
        return categoryColorMap.utilities;
    if (t.includes('shop') || t.includes('cloth') || t.includes('gift')) 
        return categoryColorMap.shopping;
    if (t.includes('educat') || t.includes('book') || t.includes('course')) 
        return categoryColorMap.education;
    if (t.includes('salary') || t.includes('income') || t.includes('bonus')) 
        return categoryColorMap.income;
    
    return categoryColorMap.other;
};
