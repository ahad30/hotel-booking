import { Button, Form, Upload, message } from "antd";
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../redux/Hook/Hook";

const ZMultipleImage = ({
  name,
  label,
  defaultValue,
  onRemove,
  onChange,
  defaultKey,
  setPriceQuantityImage,
  refresh,
  maxCount = 5,
}) => {
  const [imageList, setImageList] = useState([]);
  const { control, resetField } = useFormContext();
  const { isAddModalOpen, isEditModalOpen, isVariantModalOpen } = useAppSelector(
    (state) => state.modal
  );

    // Update imageList when defaultValue changes
    useEffect(() => {
    if (defaultValue && Array.isArray(defaultValue)) {
      const formattedImages = defaultValue.map((img, index) => ({
        uid: img.uid || `default-${index}`,
        name: img.name || `Image ${index + 1}`,
        status: "done",
        url: img.url || img.preview,
      }));
      setImageList(formattedImages);
    } else {
      setImageList([]);
    }
  }, [defaultValue]);

  // Reset imageList when modal is closed
  useEffect(() => {
    if (!isAddModalOpen || !isEditModalOpen || !isVariantModalOpen) {
      setImageList([]);
      resetField(name);
    }
  }, [isAddModalOpen, isEditModalOpen, isVariantModalOpen]);



  // Handle refresh (if needed)
  useEffect(() => {
    if (defaultKey === "product") {
      setImageList([]);
    }
  }, [refresh]);

  // Handle file change
  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // Limit the number of files
    if (newFileList.length > maxCount) {
      newFileList = newFileList.slice(-maxCount);
      message.warning(`You can only upload up to ${maxCount} images`);
    }

    // Format files with preview URLs
    newFileList = newFileList.map(file => ({
      ...file,
      status: "done",
      url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url,
    }));

    setImageList(newFileList);

    // Prepare files for form submission
    const filesForForm = newFileList.map(file => file.originFileObj || file);
    if (onChange) {
      onChange(filesForForm);
    }

    // Update price quantity image if needed
    if (setPriceQuantityImage && defaultKey === "product") {
      setPriceQuantityImage(prev => ({
        ...prev,
        imageUrl: filesForForm[0] || "",
      }));
    }
  };

  // Handle file removal
  const handleRemove = (file) => {
    const newFileList = imageList.filter(item => item.uid !== file.uid);
    setImageList(newFileList);

    if (onRemove) {
      onRemove(file);
    }

    if (onChange) {
      onChange(newFileList.map(file => file.originFileObj || file));
    }

    if (setPriceQuantityImage && defaultKey === "product") {
      setPriceQuantityImage(prev => ({
        ...prev,
        imageUrl: newFileList[0]?.originFileObj || newFileList[0]?.url || "",
      }));
    }
  };

  // Before upload validation
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || []}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Upload
            listType="picture-card"
            multiple
            fileList={imageList}
            beforeUpload={beforeUpload}
            onChange={({ fileList }) => {
              handleChange({ fileList });
              field.onChange(fileList.map(file => file.originFileObj || file));
            }}
            onRemove={(file) => {
              handleRemove(file);
              const newValue = field.value.filter(
                (item) => item.uid !== file.uid
              );
              field.onChange(newValue);
            }}
            onPreview={(file) => {
              const url = file.url || (file.originFileObj && URL.createObjectURL(file.originFileObj));
              if (url) window.open(url, "_blank");
            }}
            maxCount={maxCount}
          >
            {imageList.length < maxCount && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      )}
    />
  );
};

export default ZMultipleImage;