import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isDeleteModalOpen: false,
  isViewModalOpen: false,
  isProductViewModalOpen: false,
  isNewProductViewModalOpen: false,
  isTopProductViewModalOpen: false,
  isCustomerModalOpen: false,
  isProductModalOpen: false,
  isCalculatorModalOpen: false,
  isVariantModalOpen: false,
  isHomeCategorySidebarOpen: false,
  priceMin: 1,
  priceMax: 9999,
};

const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setIsEditModalOpen: (state) => {
      state.isEditModalOpen = !state.isEditModalOpen;
    },
    setIsAddModalOpen: (state) => {
      state.isAddModalOpen = !state.isAddModalOpen;
    },
    setIsDeleteModalOpen: (state) => {
      state.isDeleteModalOpen = !state.isDeleteModalOpen;
    },
    setIsViewModalOpen: (state) => {
      state.isViewModalOpen = !state.isViewModalOpen;
    },
    setIsCustomerModalOpen: (state) => {
      state.isCustomerModalOpen = !state.isCustomerModalOpen;
    },
    setIsProductModalOpen: (state) => {
      state.isProductModalOpen = !state.isProductModalOpen;
    },
    setIsCalculatorModalOpen: (state) => {
      state.isCalculatorModalOpen = !state.isCalculatorModalOpen;
    },

    setIsVariantModalOpen: (state) => {
      state.isVariantModalOpen = !state.isVariantModalOpen;
    },

    setIsHomeCategorySidebarOpen: (state) => {
      state.isHomeCategorySidebarOpen = !state.isHomeCategorySidebarOpen;
    },
    setIsProductViewModalOpen: (state) => {
      state.isProductViewModalOpen = !state.isProductViewModalOpen;
    },
    setIsNewProductViewModalOpen: (state) => {
      state.isNewProductViewModalOpen = !state.isNewProductViewModalOpen;
    },
    setIsTopProductViewModalOpen: (state) => {
      state.isTopProductViewModalOpen = !state.isTopProductViewModalOpen;
    },
    setPriceMin: (state, action) => {
      state.priceMin = action.payload;
    },
    setPriceMax: (state, action) => {
      state.priceMax = action.payload;
    },
  },
});

export const {
  setIsAddModalOpen,
  setIsDeleteModalOpen,
  setIsEditModalOpen,
  setIsViewModalOpen,
  setIsCustomerModalOpen,
  setIsProductModalOpen,
  setIsCalculatorModalOpen,
  setIsVariantModalOpen,
  setIsHomeCategorySidebarOpen,
  setIsProductViewModalOpen,
  setIsNewProductViewModalOpen,
  setIsTopProductViewModalOpen,
  setPriceMin, 
  setPriceMax
} = ModalSlice.actions;

export default ModalSlice.reducer;
