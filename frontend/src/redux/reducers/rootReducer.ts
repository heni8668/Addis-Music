import { combineReducers } from "@reduxjs/toolkit";
import musicReducer from "./musicReducers";

// Define the root reducer with combined reducers
const rootReducer = combineReducers({
  musics: musicReducer,
});

// Export the root reducer
export type RootState = ReturnType<typeof rootReducer>; // Define RootState type for use in selectors
export default rootReducer;
