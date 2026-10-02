import { useEffect } from "react";
import { Form, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useAppSelector } from "../../redux/Hook/Hook";


const ZInputTextArea = ({
    name,
    label,
    value,
    placeholder,
    reset,
    required
}) => {
    const { control, setValue, resetField } = useFormContext();
    const { isEditModalOpen } = useAppSelector(
        (state) => state.modal
    );

    useEffect(() => {
        if (value) {
            setValue(name, value);
        }
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
                ...(required && { required:` This ${label} field is required` })
              }}
            render={({ field, fieldState: { error } }) => (
                <Form.Item
                    label={label}
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                >
                    <Input.TextArea {...field} placeholder={placeholder}  rows={10}/>
                </Form.Item>
            )}
        />
    );
};

export default ZInputTextArea;