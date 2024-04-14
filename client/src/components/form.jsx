import React from "react";
import FormType from "./form_type";
import SampleBTC from "./sampleBTC";

const Form = () => {
  return (
    <div className="flex justify-center items-center rounded-md p-5 bg-white gap-5">
      <FormType />
      <SampleBTC />
    </div>
  );
};

export default Form;
