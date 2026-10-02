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
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";
import { useDeleteHotelMutation, useGetHotelQuery } from "../../../../redux/Feature/Admin/hotel/hotelApi";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { useNavigate } from "react-router-dom";

const Hotels = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, error, isLoading: hotelIsLoading } = useGetHotelQuery();
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [
    deleteHotel,
    { isLoading: dHIsLoading, isError, isSuccess, data: dHData, error: dHError },
  ] = useDeleteHotelMutation();

  const hotelData = data?.data?.map((hotel, index) => ({
    key: index,
    id: hotel?.id,
    name: hotel?.name,
    description: hotel?.description,
    location: hotel?.location,
    image: hotel?.image,
    // division: hotel?.divisionId?.name || "N/A",
    // city: hotel?.cityId?.name || "N/A",
    amenities: hotel?.amenities,
    isActive: hotel?.isActive,
  }));

  const handleEditHotel = (id) => {
    navigate(`/admin/edit-hotel/${id}`);
  };


  const handleViewHotel = (id) => {
    navigate(`/admin/view-hotel-details/${id}`);
  };



  const handleDeleteHotel = (hotelData) => {
    setSelectedHotel(hotelData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteConfirm = () => {
    deleteHotel(selectedHotel?.id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="line-clamp-1">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <Image 
          alt="" 
          height={50} 
          width={50} 
          src={record.image} 
          className="rounded-md object-cover"
        />
      ),
    },
    // {
    //   title: "Division",
    //   dataIndex: "division",
    //   key: "division",
    // },
    // {
    //   title: "City",
    //   dataIndex: "city",
    //   key: "city",
    // },
    {
      title: "Amenities",
      dataIndex: "amenities",
      key: "amenities",
      render: (amenities) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {amenities?.map((amenity, index) => (
            <Tag key={index} color="blue">
              {amenity}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive === true ? 'green' : 'red'}>
          {isActive === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
         <a onClick={() => handleViewHotel(record.id)}>
                  <Tooltip title="Click here to view hotel details" placement="top">
                  
                  <AiFillEye size={25}/>
                          </Tooltip>
                  </a>
          <a onClick={() => handleEditHotel(record.id)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500 hover:text-green-700" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteHotel(record)}>
            <Tooltip title="Delete" placement="top">
              <AiFillDelete className="text-red-500 hover:text-red-700" size={20} />
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
        <ButtonWithModal title="Add Hotel" path={`/admin/add-hotel`}></ButtonWithModal>
      </div>

      <DashboardTable 
        columns={columns} 
        data={hotelData} 
        loading={hotelIsLoading} 
      />

      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Hotel">
        <AddHotel />
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Hotel">
        <EditHotel selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel}/>
      </EditModal>

      {/* DeleteModal Component */}
      <DeleteModal
        data={dHData}
        error={dHError}
        isLoading={dHIsLoading}
        isSuccess={isSuccess}
        title="Delete Hotel"
        onDelete={handleDeleteConfirm}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"This will permanently remove the selected hotel and all its associated data."}
      ></DeleteModal>
    </>
  );
};

export default Hotels;