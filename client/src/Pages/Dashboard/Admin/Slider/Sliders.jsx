import React, { useState } from "react";
import { Image, Tag } from "antd";
import { Space, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen, setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useDeleteSliderMutation, useGetSlidersQuery } from "../../../../redux/Feature/Admin/slider/sliderApi";
import AddSlider from "./AddSlider";
import EditSlider from "./EditSlider";

const Sliders = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading: sliderIsLoading } = useGetSlidersQuery();
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [
    deleteSlider,
    { isLoading: dSIsLoading, isError, isSuccess, data: dSData, error: dSError },
  ] = useDeleteSliderMutation();


  const sliderData = data?.data?.map((slider, index) => ({
    key: index,
    id: slider?.id,
    title: slider?.title,
    description: slider?.description,
    imageUrl: slider.imageUrl,
    linkUrl: slider?.linkUrl,
    isActive: slider?.isActive,
  }));

  const handleEditSlider = (sliderData) => {
    setSelectedSlider(sliderData);
    dispatch(setIsEditModalOpen());
  };

  const handleDeleteSlider = (sliderData) => {
    setSelectedSlider(sliderData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteConfirm = () => {
    deleteSlider(selectedSlider?.id);
  };

  const columns = [
    // {
    //   title: "Title",
    //   dataIndex: "title",
    //   key: "title",
    // },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, record) => <Image alt="" height={50} width={50} src={record.imageUrl} />,
    },
    // {
    //   title: "Link URL",
    //   dataIndex: "linkUrl",
    //   key: "linkUrl",
    //   render: (linkUrl) => <a href={linkUrl} target="_blank" rel="noopener noreferrer">{linkUrl}</a>,
    // },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive === true ? 'green' : 'red'}>
          {isActive === true ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditSlider(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteSlider(record)}>
            <Tooltip title="Delete" placement="top">
              <AiFillDelete className="text-red-500" size={20} />
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div>
        <BreadCrumb />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
        <ButtonWithModal title="Add Slider"></ButtonWithModal>
      </div>

      <DashboardTable columns={columns} data={sliderData} loading={sliderIsLoading} />

      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Slider">
        <AddSlider />
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Slider">
        <EditSlider selectedSlider={selectedSlider} setSelectedSlider={setSelectedSlider}/>
      </EditModal>

      {/* DeleteModal Component */}
      <DeleteModal
        data={dSData}
        error={dSError}
        isLoading={dSIsLoading}
        isSuccess={isSuccess}
        title="Delete Slider"
        onDelete={handleDeleteConfirm}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"This will remove the selected slider."}
      ></DeleteModal>
    </>
  );
};

export default Sliders;
