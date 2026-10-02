import { ReactNode, useEffect } from "react";
import { Form } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import SaveAndCloseButton from "../Button/SaveAndCloseButton";
import { useAppSelector } from "../../redux/Hook/Hook";
import { use } from "react";

const ZFormTwo = ({ 
  children,
  submit,
  defaultValues,
  resolver,
  isSuccess,
  isLoading,
  closeModal,
  isError,
  error,
  data,
  formType,
  buttonName,
}) => {
  const { isAddModalOpen, isEditModalOpen, isCustomerModalOpen, isProductModalOpen } = useAppSelector(
    (state) => state.modal
  );

  const methods = useForm({
    mode: "all",
    defaultValues: defaultValues || {},
    resolver,
  });

  const onSubmit = (data) => {
    submit(data);
  };

  // Reset form when modal closes (for create forms)
  useEffect(() => {
    if (formType === "create") {
      if (!isAddModalOpen || !isEditModalOpen ) {
        methods.reset();
      }
    }
  }, [isAddModalOpen, isEditModalOpen, methods, formType]);

  // Set default values when they change (for edit forms)
  useEffect(() => {
    if (formType === "edit" && defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods, formType]);

  // Close modal on success and reset create forms
  useEffect(() => {
    if (isSuccess && closeModal) {
      closeModal();
      if (formType === "create") {
        methods.reset();
      }
    }
  }, [isSuccess, methods, formType]);

  // Show toast notifications
  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: 1 });
    } else if (isSuccess) {
      toast.success(data?.message || "Operation successful", { id: 1 , duration: 3000 });
    } else if (isError) {
      toast.error(error?.data?.message || "An error occurred", { 
        id: 1, 
        duration: 3000 
      });
    }
  }, [isSuccess, isLoading, isError, data, error]);

  useEffect(() => {
    toast.dismiss(1);
  }, []);

  return (
    <FormProvider {...methods}>
      <Form layout="vertical" onFinish={methods.handleSubmit(onSubmit)}>
        <div>{children}</div>
        
        {buttonName && (
          <SaveAndCloseButton
            closeModal={closeModal}
            isLoading={isLoading}
            isSuccess={isSuccess}
            title={buttonName}
          />
        )}
      </Form>
    </FormProvider>
  );
};

export default ZFormTwo;