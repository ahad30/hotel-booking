import { Modal } from "antd";
import { useAppDispatch } from "../../redux/Hook/Hook";
import { setIsViewModalOpen } from "../../redux/Modal/ModalSlice";


const ViewModal = ({ children, isViewModalOpen, title, width }) => {
  const dispatch = useAppDispatch();
  const handleCancel = () => {
    dispatch(setIsViewModalOpen());
  };
  return (
    <>
      <Modal
      className="my-5"
        title={title}
        centered
        open={isViewModalOpen}
        style={``}
        width={width ? width : 500}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="">{children}</div>
      </Modal>
    </>
  );
};

export default ViewModal;
