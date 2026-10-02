import React, { useState } from "react";
import { Table, Tag, Space, Tooltip, Radio } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import { setIsDeleteModalOpen, setIsEditModalOpen, setIsViewModalOpen } from "../../../../redux/Modal/ModalSlice";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import ViewModal from "../../../../components/Modal/ViewModal";
import EditBooking from "./EditBooking";
import moment from "moment";
import { useDeleteBookingMutation, useGetBookingsQuery } from "../../../../redux/Feature/Admin/booking/bookingApi";
import ViewBooking from "./ViewBooking";

const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState({});
  const dispatch = useAppDispatch();
  const { isEditModalOpen, isViewModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const { data, isLoading } = useGetBookingsQuery();
  const [deleteBooking, { isLoading: deleteLoading, isError, isSuccess, data: deletedData, error: deleteError }] = useDeleteBookingMutation();

  const [filterStatus, setFilterStatus] = useState("all");

  const bookingData = data?.data?.map((booking, index) => ({
    key: index + 1,
    id: booking?.id,
    name: booking?.name,
    email: booking?.email,
    phone: booking?.phone,
    bookingItem: booking?.bookingItem,
    userId: booking?.userId,
    totalPrice: booking?.totalPrice,
    transactionId: booking?.transactionId,
    paymentStatus: booking?.paymentStatus,
    status: booking?.status,
    checkIn: moment(booking?.checkIn).format("Do MMM YYYY ,  h:mm a"),
    checkOut: moment(booking?.checkOut).format("Do MMM YYYY ,  h:mm a"),
    createdAt: moment(booking?.createdAt).format("Do MMM YYYY, h:mm a"),
  }));

  const filteredBookings =
    filterStatus === "all"
      ? bookingData
      : bookingData?.filter((booking) => booking.status === filterStatus);

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    dispatch(setIsEditModalOpen());
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    dispatch(setIsViewModalOpen());
  };

  const handleDeleteBooking = (booking) => {
    setSelectedBooking(booking);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDelete = () => {
    deleteBooking(selectedBooking?.id);
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Guest Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    // {
    //   title: "Check-In",
    //   dataIndex: "checkIn",
    //   key: "checkIn",
    // },
    // {
    //   title: "Check-Out",
    //   dataIndex: "checkOut",
    //   key: "checkOut",
    // },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => <Tag color="cyan">${price}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "paid" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "blue"
              : status === "confirmed"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
 <Space size="middle">
         <a onClick={() => handleViewBooking(record)}>
                  <Tooltip title="Click here to view hotel details" placement="top">
                  
                  <AiFillEye size={25}/>
                          </Tooltip>
                  </a>
          <a onClick={() => handleEditBooking(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500 hover:text-green-700" size={20} />
            </Tooltip>
          </a>
          {/* <a onClick={() => handleDeleteBooking(record)}>
            <Tooltip title="Delete" placement="top">
              <AiFillDelete className="text-red-500 hover:text-red-700" size={20} />
            </Tooltip>
          </a> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div>
        <BreadCrumb />
      </div>

      <div className="flex justify-center my-10">
        <Radio.Group
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="pending">Pending</Radio.Button>
          <Radio.Button value="confirmed">Confirmed</Radio.Button>
          <Radio.Button value="cancelled">Cancelled</Radio.Button>
        </Radio.Group>
      </div>

      <DashboardTable
        columns={columns}
        data={filteredBookings}
        loading={isLoading}
      />

      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Booking">
        <EditBooking selectedBooking={selectedBooking} />
      </EditModal>

      <ViewModal width={800} isViewModalOpen={isViewModalOpen}  >
        <ViewBooking selectedBooking={selectedBooking} />
      </ViewModal>

      <DeleteModal
        isLoading={deleteLoading}
        isDeleteModalOpen={isDeleteModalOpen}
        onDelete={handleDelete}
        title="Delete Booking"
        isError={isError}
        isSuccess={isSuccess}
        error={deleteError}
        data={deletedData}
        description="Deleting this booking will permanently remove the record."
      />
    </>
  );
};

export default Bookings;
