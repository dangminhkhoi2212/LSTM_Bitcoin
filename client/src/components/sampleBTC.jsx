import React, { useEffect, useState } from "react";
import { Button, Modal, InputNumber, Select } from "antd";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import axios from "axios";
import useBearStore from "../store";
const MAX_DATE = 100;

const urlAPI =
  "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=9&api_key=5ff9a282948293387d888e2ee386a44eb474b790f1328a82694c1a2e4c8cc802";

const SampleBTC = () => {
  const handlePredict = useBearStore((state) => state.handlePredict);
  const BTCData = useBearStore((state) => state.BTCData);
  const setBTCData = useBearStore((state) => state.setBTCData);
  const [initValues, setInitValue] = useState({
    values: [],
    numDate: 1,
  });

  const datesArray = Array.from({ length: MAX_DATE }, (_, index) => {
    const date = index + 1;
    return {
      value: date,
      label: `${date}`,
    };
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "values",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async (data) => {
    const values = data.values.map((val) => val.high);
    const newData = { values: [...values], numDate: data.numDate };
    handlePredict(newData);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset(initValues);
  };
  const convertTime = (time) => {
    const milliseconds = time * 1000;

    const date = new Date(milliseconds);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const dateString = `${day}/${month}/${year}`;
    return dateString;
  };
  const getBTC = async () => {
    try {
      let resultAPI;
      if (BTCData.length) {
        resultAPI = BTCData;
      } else {
        resultAPI = (await axios.get(urlAPI)).data.Data.Data;

        setBTCData(resultAPI);
      }
      const result_10 = resultAPI.map((val) => {
        return {
          date: convertTime(val.time),
          high: val.high,
        };
      });
      setInitValue({ ...initValues, values: result_10 });
    } catch (error) {
      console.log("🚀 ~ getBTC ~ error:", error);
    }
  };

  useEffect(() => {
    setValue("values", initValues.values);
  }, [initValues]);

  useEffect(() => {
    getBTC();
  }, []);
  return (
    <div className="bg-red-50 p-5 rounded-lg flex justify-center items-center">
      <div className="flex gap-3 items-center">
        <p className="font-medium">Sủ dụng ngày mới nhất để dự đoán</p>
        <Button
          type="primary"
          onClick={showModal}
          className="bg-red-300 hover:!bg-red-400 "
        >
          Nhập thông tin
        </Button>
      </div>
      <Modal
        className=""
        okType="danger"
        title="Dự đoán giá bitcoin"
        open={isModalOpen}
        onOk={handleSubmit(handleOk)}
        onCancel={handleCancel}
      >
        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h1>Giá trị đồng BTC cao nhất trong 10 ngày qua</h1>
            <p className="font-medium">Giá trị được cập nhật mới mỗi ngày</p>

            <ul className="flex flex-col gap-2">
              {fields.map((item, index) => {
                return (
                  <li key={index} className="flex gap-4 items-center">
                    <label htmlFor={item.id}>
                      Ngày {initValues.values[index].date}
                    </label>
                    <Controller
                      render={({ field }) => (
                        <InputNumber
                          readOnly={true}
                          value={field.value}
                          min={1}
                          className=" w-52 focus:border-red-200"
                        />
                      )}
                      name={`values.${index}.high`}
                      control={control}
                    />{" "}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h1>Chọn số ngày để dự đoán tiếp theo</h1>
            <Controller
              render={({ field }) => (
                <Select
                  defaultValue={1}
                  style={{
                    width: 120,
                  }}
                  onChange={field.onChange}
                  options={datesArray}
                  value={field.value}
                />
              )}
              name={"numDate"}
              control={control}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SampleBTC;
