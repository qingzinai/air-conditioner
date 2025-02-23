import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { setMessage, setOpen } from "../toast/toastSlice";

export type AcMode = "cold" | "hot";
export interface AcState {
  /**
   * 状态
   */
  status: boolean;
  /**
   * 模式
   */
  mode: AcMode;
  /**
   * 温度
   */
  temperature: number;
  /**
  * 风力
  */
  windPower: number
}

const namespace = "ac-";

export const acItemKey = {
  status: namespace + "status",
  mode: namespace + "mode",
  temperature: namespace + "temperature",
  windPower: namespace + "windPower"
};

const initialState: AcState = {
  status: false,
  mode: (localStorage.getItem(acItemKey.mode) as AcMode) || "cold",
  temperature:
    parseInt(localStorage.getItem(acItemKey.temperature) || "") || 20,
  windPower: parseInt(localStorage.getItem(acItemKey.windPower) || "") || 3,
};

const maxTemperature = 31;
const minTemperature = 16;

export const acSlice = createSlice({
  name: "ac",
  initialState,
  reducers: {
    /**
     * 设置状态
     * @param state
     * @param action
     */
    setStatus(state, action: PayloadAction<boolean>) {
      state.status = action.payload;
    },
    /**
     * 设置温度
     * @param state
     * @param action
     */
    setTemperature(state, action: PayloadAction<number>) {
      state.temperature = action.payload;
    },
    /**
     * 增加温度
     * @param state
     */
    increment: (state) => {
      state.temperature += 1;
      localStorage.setItem(acItemKey.temperature, state.temperature.toString());
    },

    /**
     * 降低温度
     * @param state
     */
    decrement: (state) => {
      state.temperature -= 1;
      localStorage.setItem(acItemKey.temperature, state.temperature.toString());
    },
    /**
  * 调整风力
  * @param state
  */
    adjustWind: (state) => {
      if (state.windPower >= 5) {
        state.windPower = 1
      } else {
        state.windPower += 1
      }
      localStorage.setItem(acItemKey.windPower, state.windPower.toString())
    },
    /**
     * 设置空调模式
     * @param state
     * @param action
     */
    setMode(state, action: PayloadAction<AcMode>) {
      state.mode = action.payload;
      localStorage.setItem(acItemKey.mode, state.mode);
    },

    /**
     * 切换开关状态
     * @param state
     * @param action
     */
    toggleStatus(state) {
      state.status = !state.status;
      localStorage.setItem(acItemKey.status, state.status.toString());
    },
  },
});

export const selectTemperature = (state: RootState) => state.ac.temperature;
export const selectWindPower = (state: RootState) => state.ac.windPower;

export const {
  setTemperature,
  increment,
  decrement,
  adjustWind,
  setMode,
  toggleStatus,
  setStatus,
} = acSlice.actions;

/**
 * 增加温度
 * @returns
 */
export const increaseTemperature = (): AppThunk => (dispatch, getState) => {
  const currentValue = selectTemperature(getState());
  if (currentValue < maxTemperature) {
    dispatch(increment());
  } else {
    dispatch(setMessage("已经是最大温度啦！"));
    dispatch(setOpen(true));
  }
};

/**
 * 降低温度
 * @returns
 */
export const decreaseTemperature = (): AppThunk => (dispatch, getState) => {
  const currentValue = selectTemperature(getState());
  if (currentValue > minTemperature) {
    dispatch(decrement());
  } else {
    dispatch(setMessage("已经是最小温度啦！"));
    dispatch(setOpen(true));
  }
};

/**
 * 调整风力风力
 * @returns
 */
export const adjustWindPower = (): AppThunk => (dispatch, getState) => {
  dispatch(adjustWind())
}


export default acSlice.reducer;
