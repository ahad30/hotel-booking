import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const ZSelect = ({
  name,
  label,
  mode,
  options,
  isLoading,
  value,
  placeholder,
  required,
  disabled,
  onChange: propOnChange,
}) => {
  const { control, setValue } = useFormContext();
  const [refreshKey, setRefreshKey] = useState(0);

  // Set initial value if provided
  useEffect(() => {
    if (value !== undefined) {
      setValue(name, value);
      setRefreshKey(prev => prev + 1); // Force re-render
    }
  }, [value, name, setValue]);

  // Handle internal onChange
  const handleChange = (selectedValue) => {
    // Update form value
    setValue(name, selectedValue, { shouldValidate: true });
    
    // Call prop onChange if provided
    if (propOnChange) {
      propOnChange(selectedValue);
    }
  };

  // Search and filter functions
  const onSearch = (input) => {
    // Custom search logic can be added here if needed
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Controller
      key={refreshKey}
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
          required={required}
        >
          <Select
            {...field}
            virtual={true}
            allowClear={true}
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={handleChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={options || []}
            mode={mode ? mode : undefined}
            loading={isLoading}
            disabled={disabled}
          />
        </Form.Item>
      )}
    />
  );
};

export default ZSelect;