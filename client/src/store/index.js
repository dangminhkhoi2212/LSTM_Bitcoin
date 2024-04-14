import axios from "axios";
import { create } from "zustand";

const useBearStore = create((set) => ({
  bears: 0,
  isLoading: false,
  BTCData: [],
  predictData: [],
  originData: [0, 0, 0, 0, 0],
  setIsLoading: (value) => set({ isLoading: value }),
  setPredictData: (value) => set({ predictData: [...value] }),
  setOriginData: (value) => set({ originData: [...value] }),
  setBTCData: (value) => set({ BTCData: [...value] }),
  handlePredict: async (data) => {
    console.log("🚀 ~ handlePredict: ~ data:", data);
    try {
      set({ isLoading: true });
      const { values, numDate } = data;
      console.log("🚀 ~ handlePredict: ~ values:", values);
      set({ originData: values.map((val) => val) });
      console.log("🚀 ~ handleOk ~ numDate:", numDate);
      console.log("🚀 ~ handleOk ~ data:", values);
      if (values.every((val) => val !== 0)) {
        const url = "http://127.0.0.1:5000/predict";
        const predictData = (
          await axios.post(
            url,
            { data: values, numDate },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            }
          )
        ).data;
        console.log("🚀 ~ handleOk ~ dataPredict:", predictData);
        set({ predictData: [...predictData] });
      }
    } catch (error) {
      console.log("🚀 ~ handleOk ~ error:", error);
    }
    set({ isLoading: false });
  },
  removeAllBears: () => set({ bears: 0 }),
}));

export default useBearStore;
