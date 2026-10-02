import { Form, Radio } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useAppSelector } from "../../redux/Hook/Hook";

const ZRadio = ({ name, label, options, defaultValue, setProductType}) => {
  const { control } = useFormContext();
  const [value, setValue] = useState("");
  const { isEditModalOpen } = useAppSelector((state) => state.modal);

  const onChange = (value) => {
    // console.log(value)
    setValue(value);
    if (setProductType) {
      setProductType(value);
    }
  };

  useEffect(() => {
    if (defaultValue || isEditModalOpen) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Radio.Group
            {...field}
            onChange={(e) => {
              onChange(e.target.value);
              field.onChange(e.target.value);
            }}
            {...(defaultValue ? { value: value } : {})}
          >
            {options.map((item) => (
              <Radio key={item.value} value={item.value}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      )}
    />
  );
};

export default ZRadio;
