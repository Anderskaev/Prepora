// ── Корневой объект (весь blob) ────────────────────────
export interface AppData {
    version: number; // версия схемы
    updatedAt: string; // ISO timestamp
    scenarios: Scenario[];
    vaultItems: VaultItem[];
    reminders: Reminder[]; // детали внутри blob
    scenarioCategories: Category[];
    vaultCategories: Category[];
}

export type Priority = 'CRITICAL' | 'IMPORTANT' | 'STANDARD';

// ── Сценарий ─────────────────────────────────────────
export interface Scenario {
    id: string;
    title: string;
    icon: string;
    category: string; // id категории
    priority: Priority;
    trigger: string; // когда применять
    steps: ScenarioStep[];
    createdAt: string;
    updatedAt: string;
}

export interface ScenarioStep {
    phase: string; // название фазы
    items: string[]; // шаги внутри фазы
}

// ── Хранилище ────────────────────────────────────────
export interface VaultItem {
    id: string;
    title: string;
    category: string;
    fields: VaultField[];
    createdAt: string;
}
export interface VaultField {
    label: string;
    value: string;
    sensitive: boolean; // скрывать звёздочками
}

// ── Напоминания ──────────────────────────────────────
export interface Reminder { // внутри AppData (зашифровано)
    id: string;
    title: string;
    date: string;
    repeat: "NONE" | "MONTHLY" | "YEARLY";
    linkedId?: string; // ссылка на сценарий/item
}
export interface ReminderSchedule { // IndexedDB (НЕ зашифровано)
    id: string; // совпадает с Reminder.id
    scheduledAt: string; // когда показать уведомление
    repeat: "NONE" | "MONTHLY" | "YEARLY";
}

// ── Категория ────────────────────────────────────────
export interface Category {
    id: string;
    label: string;
    icon: string;
    color: string; // hex
}