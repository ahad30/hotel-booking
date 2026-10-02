import { Form, Input } from "antd";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useAppSelector } from "../../redux/Hook/Hook";

const ZInputTwo = ({
  name,
  type,
  label,
  defaultKey,
  value,
  placeholder,
  required,
  reset,
  onChange,
  readOnly,
  disabled
}) => {
  const { control, setValue, resetField } = useFormContext();
  const { isEditModalOpen } = useAppSelector((state) => state.modal);

  useEffect(() => {
    // if (value) {
      setValue(name, value);
    // }
  }, [value, setValue, name]);

  useEffect(() => {
    if (reset === true) {
      if (!isEditModalOpen) {
        resetField(name);
      }
    }
  }, [reset, isEditModalOpen, resetField, name]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...(required && { required: `This ${label} field is required` }),
      }}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Input
            className={defaultKey ? `${defaultKey}` : ``}
            {...field}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            readOnly={readOnly}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) {
                onChange(e);
              }
            }}
          />
        </Form.Item>
      )}
    />
  );
};

export default ZInputTwo;
