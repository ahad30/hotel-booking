import React, { useState } from "react";
import { Tag } from "antd";
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
import { useDeleteAreaMutation, useGetAreasQuery } from "../../../../redux/Feature/Admin/area/areaApi";
import AddArea from "./AddArea";
import EditArea from "./EditArea";

const Areas = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading: areaIsLoading } = useGetAreasQuery();
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedArea, setSelectedArea] = useState(null);
  const [
    deleteArea,
    { isLoading: dIsLoading, isError, isSuccess, data: dData, error: dError },
  ] = useDeleteAreaMutation();

  const areaData = data?.data?.map((area, index) => ({
    key: index,
    id: area?.id,
    name: area?.name,
    bn_name: area?.bn_name,
    serialId: area?.serialId,
    district_id: area?.district_id,
    district_name: area?.district_name,
  }));

  const handleEditArea = (areaData) => {
    setSelectedArea(areaData);
    dispatch(setIsEditModalOpen());
  };

  const handleDeleteArea = (areaData) => {
    setSelectedArea(areaData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteConfirm = () => {
    deleteArea(selectedArea?.id);
  };

  const columns = [
    // {
    //   title: "Area Serial No",
    //   dataIndex: "serialId",
    //   key: "serialId",
    // },
    {
      title: "Area Name",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Name (Bengali)",
    //   dataIndex: "bn_name",
    //   key: "bn_name",
    // },
    {
      title: "District Name",
      dataIndex: "district_name",
      key: "district_name",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditArea(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteArea(record)}>
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
        <ButtonWithModal title="Add Area"></ButtonWithModal>
      </div>

      <DashboardTable 
        columns={columns} 
        data={areaData} 
        loading={areaIsLoading} 
      />

      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Area">
        <AddArea />
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Area">
        <EditArea selectedArea={selectedArea} setSelectedArea={setSelectedArea}/>
      </EditModal>

      {/* DeleteModal Component */}
      <DeleteModal
        data={dData}
        error={dError}
        isLoading={dIsLoading}
        isSuccess={isSuccess}
        title="Delete Area"
        onDelete={handleDeleteConfirm}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"This will permanently remove the selected area."}
      ></DeleteModal>
    </>
  );
};

export default Areas;