
import React  from "react";
import { Modal} from "antd";
import { useAppDispatch } from "../../redux/Hook/Hook";
import { setIsEditModalOpen } from "../../redux/Modal/ModalSlice";



const EditModal = ({ isEditModalOpen, title, children , width }) => {
  const dispatch = useAppDispatch();
  
  const handleCancel = () => {
    dispatch(setIsEditModalOpen());
  };

  return (
    <Modal
    className="m-5"
    title={title}
    centered
    open={isEditModalOpen}
    width={width ? width : 500}
    onCancel={handleCancel}
    okButtonProps={{ style: { display: "none" } }}
    cancelButtonProps={{ style: { display: "none" } }}
  >
    <div className="mt-7">
    {children}
    </div>
  </Modal>
  );
};

export default EditModal;
