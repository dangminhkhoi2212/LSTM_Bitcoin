import React, { useEffect, useState } from "react";
import { Button, Modal, InputNumber, Select } from "antd";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useBearStore from "../store";
const MAX_DATE = 100;
const MAX_DATE_INPUT = 10;
const schema = yup.object().shape({
  values: yup
    .array()
    .required()
    .of(yup.number().required().notOneOf([0], "Giá phải khác 0")),
});

const FormType = () => {
  const handlePredict = useBearStore((state) => state.handlePredict);
  const [initValues, setInitValue] = useState({
    values: Array.from({ length: MAX_DATE_INPUT }, (_) => 0),
    numDate: 1,
  });
  const url = "http://127.0.0.1:5000/predict";

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
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "values",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async (data) => {
    handlePredict(data);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setValue("values", initValues.values);
  }, [initValues]);

  return (
    <div className="bg-red-50 p-5 rounded-lg flex justify-center items-center">
      <div className="flex gap-3 items-center">
        <p className="font-medium">Hãy nhập thông tin để dữ đoán</p>
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
        onOk={handleSubmit(handleOk)} // Call onSubmit function when OK button is clicked
        onCancel={handleCancel}
      >
        <form className="flex flex-col gap-3">
          <div>
            <h1>Nhập giá trị cao nhất của 5 ngày</h1>

            <ul className="flex flex-col gap-2">
              {fields.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="grid grid-cols-12 gap-7 items-center"
                  >
                    <label htmlFor={item.id} className="col-span-2">
                      Ngày {index + 1}
                    </label>
                    <div className="col-span-10">
                      <Controller
                        render={({ field }) => (
                          <InputNumber
                            value={field.value}
                            min={1}
                            onChange={field.onChange}
                            className=" w-52 focus:border-red-200"
                          />
                        )}
                        name={`values.${index}`}
                        control={control}
                      />{" "}
                      {errors && errors.values && errors.values[index] && (
                        <span className="text-red-500">
                          {errors.values[index].message}
                        </span>
                      )}
                    </div>
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
                  defaultValue={datesArray[0].value}
                  style={{
                    width: 120,
                  }}
                  onChange={field.onChange}
                  options={datesArray}
                  value={field.value}
                />
              )}
              name={`numDate`}
              control={control}
            />
          </div>
          <section className="flex gap-4">
            <button
              type="button"
              onClick={() => reset(initValues)}
              className="px-2 py-1 rounded-md bg-red-200"
            >
              Reset
            </button>
          </section>
        </form>
      </Modal>
    </div>
  );
};

export default FormType;
