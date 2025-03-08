import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage as default storage
import { persistReducer, persistStore } from "redux-persist";

import UserReducer from "./reducers/UserReducer";
import CourseReducer from "./reducers/CourseReducer";
import InstructorReducer from "./reducers/InstructorReducer";
import CouponReducer from "./reducers/CouponReducer";
import EnrollmentReducer from "./reducers/EnrollmentReducer";
import QuizReducer from './reducers/QuizReducer'
import ChatReducer from './reducers/ChatReducer'

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: UserReducer,
  course: CourseReducer,
  instructor: InstructorReducer,
  coupon: CouponReducer,
  enrollment: EnrollmentReducer,
  quiz: QuizReducer,
  chat: ChatReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
