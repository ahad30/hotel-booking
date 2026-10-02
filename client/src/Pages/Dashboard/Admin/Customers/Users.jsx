import React, { useEffect, useState } from "react";
import { Space, Tooltip, Modal, Button, Tag, Radio } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import EditModal from "../../../../components/Modal/EditModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useDeleteUserMutation, useGetUsersQuery } from "../../../../redux/Feature/Admin/usersmanagement/userApi";
import AddUser from "./AddUser/AddUser";
import { toast } from "sonner";

const Users = () => {
  const dispatch = useAppDispatch();
  const { isAddModalOpen, isEditModalOpen } = useAppSelector((state) => state.modal);
  const [selectedUser, setSelectedUser] = useState({});
  const { data, error, isLoading: userIsLoading } = useGetUsersQuery();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUser, { isLoading: dUIsLoading, isSuccess, isError, error: uError }] = useDeleteUserMutation();
  const [roleFilter, setRoleFilter] = useState("all"); // State for role filter

  // Filter users based on role
  const filteredUsers = data?.data?.filter((user) => {
    if (roleFilter === "all") return true;
    return user.role === roleFilter;
  });

  const userData = filteredUsers?.map((user, index) => ({
    key: index,
    id: user?.id,
    email: user?.email,
    phone: user?.phone,
    role: user?.role,
    name: user?.name,
    isVerified: user?.isVerified,
    createdAt: user?.createdAt,
  }));

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    dispatch(setIsEditModalOpen());
  };

  const handleDeleteUser = (userData) => {
    setSelectedUser(userData);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteUser(selectedUser?.id);
    setIsDeleteModalOpen(false);
    toast.success("User Deleted Successfully");
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) => (
        <Tag color={isVerified === true ? "green" : "red"}>{isVerified === true ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDeleteUser(record)}>
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
        <ButtonWithModal title="Add User" path={`/admin/users/add-user`}></ButtonWithModal>
      </div>

      {/* Role Filter */}
      <div className="my-8 flex justify-center">
        <Radio.Group
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="user">User</Radio.Button>
          <Radio.Button value="admin">Admin</Radio.Button>
        </Radio.Group>
      </div>

      <DashboardTable columns={columns} data={userData} loading={userIsLoading} />

      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New User">
        <AddUser />
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit User"></EditModal>

      {/* Ant Design Delete Modal */}
      <Modal
        title="Delete User"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmLoading={dUIsLoading}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
      >
        <p>This will remove the selected user. Are you sure?</p>
      </Modal>
    </>
  );
};

export default Users;