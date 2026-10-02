import { Button, Form, Upload } from "antd";
import { useState, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../redux/Hook/Hook";

const ZImageInput = ({
  name,
  label,
  defaultValue,
  onRemove,
  onChange
}) => {
  const [imageList, setImageList] = useState([]);
  const { control, resetField } = useFormContext();
  const { isAddModalOpen, isEditModalOpen, isVariantModalOpen } = useAppSelector(
    (state) => state.modal
  );
  const initialRender = useRef(true);

  // Update imageList when defaultValue changes
  useEffect(() => {
    if (defaultValue && defaultValue[0]?.url) {
      setImageList([
        {
          uid: defaultValue[0].uid || "-1",
          name: defaultValue[0].name || "Previous Image",
          status: "done",
          url: defaultValue[0].url,
        },
      ]);
    } else {
      setImageList([]);
    }
  }, [defaultValue]);

  // Only reset when modal actually closes (not on initial render)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!isAddModalOpen && !isEditModalOpen && !isVariantModalOpen) {
      setImageList([]);
      resetField(name);
    }
  }, [isAddModalOpen, isEditModalOpen, isVariantModalOpen]);

  const handleChange = (info) => {
    const file = info.file;

    if (info.fileList.length > 0) {
      const newFileList = [{
        uid: file.uid,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
      }];
      setImageList(newFileList);
      onChange?.(file);
    } else {
      setImageList([]);
      onChange?.(null);
    }
  };

  const handleRemove = () => {
    setImageList([]);
    onRemove?.();
    onChange?.(null);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Upload
            name="image"
            listType="picture"
            fileList={imageList}
            onPreview={(file) => {
              const url = file.url || URL.createObjectURL(file.originFileObj);
              window.open(url, "_blank");
            }}
            beforeUpload={(file) => {
              const newFileList = [{
                uid: file.uid,
                name: file.name,
                status: "done",
                url: URL.createObjectURL(file),
              }];
              setImageList(newFileList);
              onChange(file);
              return false;
            }}
            onRemove={handleRemove}
            maxCount={1}
            onChange={handleChange}
            showUploadList={{
              showRemoveIcon: true,
              showPreviewIcon: true,
            }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      )}
    />
  );
};

export default ZImageInput;