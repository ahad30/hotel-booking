import { Alert, Button, Flex, Modal } from "antd";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "../../redux/Hook/Hook";
import { setIsDeleteModalOpen } from "../../redux/Modal/ModalSlice";



const DeleteModal = ({
  isDeleteModalOpen,
  title,
  width,
  data,
  error,
  isError,
  isLoading,
  isSuccess,
  description,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const handleCancel = () => {
    dispatch(setIsDeleteModalOpen());
  };
  useEffect(() => {
    if (isLoading || isSuccess || isError) {
      toast.loading("Deleting ....", { id: 1 });
      if (isSuccess) {
        toast.success(data?.message, { id: 1 });
        handleCancel();
      }
      if (isError) {
       toast.error(error?.data?.message, { id: 1 });
      }
    }
  }, [isSuccess, isLoading, isError]);
  return (
    <>
      <Modal
        title={title}
        centered
        open={isDeleteModalOpen}
        width={width ? width : 500}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="mt-7">
          <Alert
            message="Are you sure you want to delete"
            description={
              <strong>
                {description
                  ? description
                  : "This is a warning notice about copywriting."}
              </strong>
            }
            type="warning"
            showIcon
          />
        </div>
        <Flex justify="end" style={{ marginTop: "20px" }} wrap gap="small">
          <Button disabled={isLoading} onClick={handleCancel}>
            cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => onDelete()}
            type="primary"
            danger
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default DeleteModal;
