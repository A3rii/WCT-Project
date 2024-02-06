import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   value: { user_name: "", email: "", isAdmin: false, role: "" },
}

export const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      logOut: (state) => {
         state.value = initialState;
      },
      logIn: (state, action) => {
         state.value.user_name = action.payload.user_name
         state.value.email = action.payload.email
         state.value.isAdmin = action.payload.isAdmin
         state.value.role = action.payload.role
      }
   },
})

export const { logOut, logIn } = userSlice.actions

export default userSlice.reducer