import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  discountVisible: false,
  discountValue: 0,
};

export const CouponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setDiscountVisible: function (state, action) {
      state.discountVisible = action.payload;
    },
    setDiscountValue: function (state, action) {
      state.discountValue = action.payload;
    },
  },
});

export default CouponSlice.reducer;

export const { setDiscountVisible, setDiscountValue } = CouponSlice.actions;
