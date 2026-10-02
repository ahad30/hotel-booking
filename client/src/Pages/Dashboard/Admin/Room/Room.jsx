import React, { useState } from "react";
import { Image, Tag, Space, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen, setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import AddRoom from "./AddRoom";
import EditRoom from "./EditRoom";
import { useDeleteRoomMutation, useGetRoomsByHotelIdQuery } from "../../../../redux/Feature/Admin/room/roomApi";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { useNavigate } from "react-router-dom";

const Room = ({hotelId}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, error, isLoading: roomIsLoading } = useGetRoomsByHotelIdQuery(hotelId);
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [
    deleteRoom,
    { isLoading: dRIsLoading, isError, isSuccess, data: dRData, error: dRError },
  ] = useDeleteRoomMutation();

  const roomData = data?.data?.map((room, index) => ({
    key: index,
    id: room?.id,
    hotelId: room?.hotelId,
    roomNumber: room?.roomNumber,
    type: room?.type,
    price: room?.price,
    capacity: room?.capacity,
    child: room?.child,
    roomQty: room?.roomQty,
    images: room?.images || [],
    amenities: room?.amenities || [],
    isAvailable: room?.isAvailable,
  }));

  const handleEditRoom = (id) => {
    navigate(`/admin/edit-room/${id}`);
  };


  const handleDeleteRoom = (roomData) => {
    setSelectedRoom(roomData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteConfirm = () => {
    deleteRoom(selectedRoom?.id);
  };

  const columns = [
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        images?.length ? (
          <Image.PreviewGroup items={images}>
            <div className="flex items-center gap-2">
              <Image
                src={images[0]}
                width={50}
                height={50}
                className="rounded-md object-cover"
                alt="Room image"
              />
              {images.length > 1 && (
                <span className="text-xs text-gray-500">
                  +{images.length - 1} more
                </span>
              )}
            </div>
          </Image.PreviewGroup>
        ) : (
          <span>No images</span>
        )
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} Tk/-`,
    },
    {
      title: "Adult",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity) => `${capacity} ${capacity > 1 ? 'people' : 'person'}`,
    },
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
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable) => (
        <Tag color={isAvailable ? 'green' : 'red'}>
          {isAvailable ? "Available" : "Booked"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
         
          <a onClick={() => handleEditRoom(record.id)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500 hover:text-green-700" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteRoom(record)}>
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

      <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
        <ButtonWithModal title="Add Room"></ButtonWithModal>
      </div>

      <DashboardTable 
        columns={columns} 
        data={roomData} 
        loading={roomIsLoading} 
      />

      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Room">
        <AddRoom hotelId={hotelId}/>
      </AddModal>


      {/* DeleteModal Component */}
      <DeleteModal
        data={dRData}
        error={dRError}
        isLoading={dRIsLoading}
        isSuccess={isSuccess}
        title="Delete Room"
        onDelete={handleDeleteConfirm}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"This will permanently remove the selected room."}
      ></DeleteModal>
    </>
  );
};

export default Room;