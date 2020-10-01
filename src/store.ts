import { configureStore } from "@reduxjs/toolkit"

import boardSlice from "./gameBoard/slice"

export default configureStore({
  reducer: {
    board: boardSlice.reducer
  }
})
