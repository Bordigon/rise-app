const STORAGE_KEY = "rise_auth";

const MOCK_TASKS_INITIAL = [
    { id: 1, name: "Drink 2 liters of water", completed: false },
    { id: 2, name: "Exercise for 30 mins", completed: false },
    { id: 3, name: "Read 15 pages", completed: false },
    { id: 4, name: "Plan tomorrow", completed: false },
];

export const initialStore = () => {
    try {
        const rawAuth = localStorage.getItem(STORAGE_KEY);
        const authData = rawAuth ? JSON.parse(rawAuth) : { user: null, token: null };
        
        return { 
            ...authData, 
            tasks: MOCK_TASKS_INITIAL,
            completedDays: new Set()
        };
    } catch (error) {
        console.error("Error loading data from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
        return { 
            user: null, 
            token: null, 
            tasks: MOCK_TASKS_INITIAL,
            completedDays: new Set()
        };
    }
};

export default function storeReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS": {
            const authData = { user: action.payload.user, token: action.payload.token };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
            console.log("LOGIN_SUCCESS:", authData);
            return { 
                ...state, 
                ...authData, 
                tasks: MOCK_TASKS_INITIAL, 
                completedDays: new Set() 
            };
        }
        case "LOGOUT": {
            localStorage.removeItem(STORAGE_KEY);
            console.log("LOGOUT");
            return { 
                user: null, 
                token: null, 
                tasks: [],
                completedDays: new Set()
            };
        }
        case "TOGGLE_TASK": {
            const updatedTasksToggle = state.tasks.map(task =>
                task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task
            );
            return { ...state, tasks: updatedTasksToggle };
        }
        case "ADD_TASK": {
            const newId = state.tasks.length > 0 ? Math.max(...state.tasks.map(task => task.id)) + 1 : 1;
            const newTask = {
                id: newId,
                name: action.payload.taskName,
                completed: false,
            };
            return { ...state, tasks: [...state.tasks, newTask] };
        }
        case "MARK_DAY_COMPLETE": {
            const newCompletedDays = new Set(state.completedDays);
            newCompletedDays.add(action.payload.dayKey);
            return { ...state, completedDays: newCompletedDays };
        }
        case "MARK_DAY_INCOMPLETE": {
            const newCompletedDays = new Set(state.completedDays);
            newCompletedDays.delete(action.payload.dayKey);
            return { ...state, completedDays: newCompletedDays };
        }
        default:
            return state;
    }
}