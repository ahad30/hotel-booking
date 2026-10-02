/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input } from "antd";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

const numberRegex = /^[0-9]+$/;
const fractionRegex = /^[0-9]*\.?[0-9]*$/;

const ZNumber = ({
  name,
  label,
  value,
  defaultKey,
  placeholder,
  required
}) => {
  const { control, setValue, resetField } = useFormContext();


  // by default reset
  useEffect(() => {

  
    const productFields = [
      "stock",
      "price",
    ];
  
    const resetFields = (fields, key) => {
      fields.forEach((field) => {
        if (name === field && defaultKey === key) {
          resetField(name, { defaultValue: "" });
        }
      });
    };
  
    resetFields(productFields, "product");
  }, [resetField]);
  


  useEffect(() => {
    if (value) {
      setValue(name, value);
    }
  }, [value, setValue]);

  const handleChange = (val) => {

  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...(required ? { 
          required: `This ${label} field is required` 
        } : "")
        ,
        pattern: {
          value:
            [
              "price",
            ].includes(name)
              ? fractionRegex
              : numberRegex,
          message:
            [
              "price",
            ].includes(name)
              ? "Please enter a valid number, including fractions"
              : "Only digits 1 to 9 are allowed",
        },
        maxLength: {
          value: [
            "price",
           
          ].includes(name)
            ? 10
            : 5,
          message: `Maximum length is ${
            [
              "price",
            
            ].includes(name)
              ? 10
              : 5
          } digits`,
        },
      }}
      
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Input
            {...field}
            value={field.value}
            onChange={(e) => {
              field.onChange(e.target.value);
              handleChange(e.target.value);
            }}
            placeholder={placeholder}
          
            
          />
        </Form.Item>
      )}
    />
  );
};

export default ZNumber;
