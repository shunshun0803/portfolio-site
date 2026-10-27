// 未記入のプレースホルダーは赤で目立たせる（埋めれば自動で通常色に戻る）
export const TODO_MARK = '【要記入】';

export const todoColor = (text: string, normal: string) => (text.includes(TODO_MARK) ? '#FF4040' : normal);
