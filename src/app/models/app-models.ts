// ── Корневой объект (весь blob) ────────────────────────
interface AppData {
    version: number; // версия схемы
    updatedAt: string; // ISO timestamp
    scenarios: Scenario[];
    vaultItems: VaultItem[];
    reminders: Reminder[]; // детали внутри blob
    scenarioCategories: Category[];
    vaultCategories: Category[];
}

// ── Сценарий ─────────────────────────────────────────
interface Scenario {
    id: string;
    title: string;
    icon: string;
    category: string; // id категории
    priority: "CRITICAL" | "IMPORTANT" | "STANDARD";
    trigger: string; // когда применять
    steps: ScenarioStep[];
    createdAt: string;
    updatedAt: string;
}

interface ScenarioStep {
    phase: string; // название фазы
    items: string[]; // шаги внутри фазы
}

// ── Хранилище ────────────────────────────────────────
interface VaultItem {
    id: string;
    title: string;
    category: string;
    fields: VaultField[];
    createdAt: string;
}
interface VaultField {
    label: string;
    value: string;
    sensitive: boolean; // скрывать звёздочками
}

// ── Напоминания ──────────────────────────────────────
interface Reminder { // внутри AppData (зашифровано)
    id: string;
    title: string;
    date: string;
    repeat: "NONE" | "MONTHLY" | "YEARLY";
    linkedId?: string; // ссылка на сценарий/item
}
interface ReminderSchedule { // IndexedDB (НЕ зашифровано)
    id: string; // совпадает с Reminder.id
    scheduledAt: string; // когда показать уведомление
    repeat: "NONE" | "MONTHLY" | "YEARLY";
}

// ── Категория ────────────────────────────────────────
interface Category {
    id: string;
    label: string;
    icon: string;
    color: string; // hex
}