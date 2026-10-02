import React, { useState } from "react";
import { Image, Tag } from "antd";
import { Space, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete } from "react-icons/ai";
import { useDeleteContactMutation, useGetContactsQuery } from "../../../../redux/Feature/Admin/contact/contactApi";
import moment from "moment"

const Contacts = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading: contactIsLoading } = useGetContactsQuery();
  const { isAddModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedContact, setSelectedContact] = useState({});
  const [
    deleteContact,
    { isLoading: dCIsLoading, isError, isSuccess, data: dCData, error: dCError },
  ] = useDeleteContactMutation();

  const contactData = data?.data?.map((contact, index) => ({
    key: index,
    id: contact?.id,
    name: contact?.name,
    email: contact?.email,
    phone: contact?.phone,
    description: contact?.description,
    createdAt: moment(contact?.createdAt).format('Do MMMM YYYY, h:mm:ss a')
  }));

  const handleDeleteContact = (contactData) => {
    setSelectedContact(contactData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteConfirm = () => {
    deleteContact(selectedContact?.id);
  };

  const columns = [
    {
      title: "Name",
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
    {
      title: "Message",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDeleteContact(record)}>
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
     
      <DashboardTable columns={columns} data={contactData} loading={contactIsLoading} />


      {/* DeleteModal Component */}
      <DeleteModal
        data={dCData}
        error={dCError}
        isLoading={dCIsLoading}
        isSuccess={isSuccess}
        title="Delete Contact"
        onDelete={handleDeleteConfirm}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"This will remove the selected contact."}
      ></DeleteModal>
    </>
  );
};

export default Contacts;
