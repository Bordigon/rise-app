

export const initialStore = () => {
    try {
        const token = localStorage.getItem("jwt-token");
        const refreshToken = localStorage.getItem("jwt-refresh-token");
        const userData = localStorage.getItem("user-data");
        const authData = {
            user: userData ? JSON.parse(userData): null,
            token: token,
            refreshToken: refreshToken
        }
        return { ...authData}
    } catch (error) {
        console.error("Error loading data from localStorage:", error);
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("jwt-refresh-token");
        localStorage.removeItem("user-data");
        return { user: null, token: null, refreshToken: null};
    }
};



export default function storeReducer(state, action){
    switch(action.type){
        case "LOGIN_SUCCESS":{
            const {user, token, refreshToken} = action.payload;

            localStorage.setItem("jwt-token", token);
            localStorage.setItem("jwt-refresh-token", refreshToken);
            localStorage.setItem("user-data", token);

            return {
                ...state,
                user,
                token,
                refresh_token,
                tasks: []
            };

        }case "LOGOUT":{
            localStorage.removeItem("jwt-token");
            localStorage.removeItem("jwt-refresh-token");
            localStorage.removeItem("user-data");
            return{
                user:null,
                token:null,
                refresh_token:null,
                tasks: []
            }

        }case "SET_TASK":{
            return{...state, tasks:action.payload};
        
        }case "ADD_TASK":{ // ------ al añadir la tarea acá es necesario primero añadirla al server
            return{
                ...state,
                tasks: [...state.tasks, action.payload]
            }

        }case "TASK_DONE":{
            const updatedTasks = state.tasks.map(task =>
                task.id === action.payload.id ? {...task, done: true } :task
            );
            return{...state, tasks:updatedTasks};
        
        }case "DELETE_TASK":{
            const updatedTasks = state.tasks.filter(task =>
                task.id != action.payload.id
            );
            return{...state, tasks:updatedTasks};
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
