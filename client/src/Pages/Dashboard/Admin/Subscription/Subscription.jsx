import React from "react";
import { Tag } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import { AiFillDelete } from "react-icons/ai";
import { Space, Tooltip } from "antd";
import moment from "moment";
import { useDeleteSubscriptionMutation, useGetSubscriptionsQuery } from "../../../../redux/Feature/Admin/subscribe/subscribeApi";

const Subscription = () => {
  const { data, error, isLoading } = useGetSubscriptionsQuery();
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();

  const subscriptionData = data?.data?.map((subscription, index) => ({
    key: index,
    id: subscription?.id,
    email: subscription?.email,
    isSubscribed: subscription?.isSubscribed,
    subscribedAt: moment(subscription?.subscribedAt).format("Do MMMM YYYY, h:mm:ss a"),
    unsubscribedAt: subscription?.unsubscribedAt || "N/A",
  }));

  const handleDeleteSubscription = async (id) => {
    try {
      await deleteSubscription(id).unwrap();
      alert("Subscription deleted successfully!");
    } catch (error) {
      alert("Failed to delete subscription.");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isSubscribed",
      key: "isSubscribed",
      render: (isSubscribed) => (
        <Tag color={isSubscribed === true ? "green" : "red"}>
          {isSubscribed === true ? "Subscribed" : "Unsubscribed"}
        </Tag>
      ),
    },
    {
      title: "Subscribed At",
      dataIndex: "subscribedAt",
      key: "subscribedAt",
    },
    // {
    //   title: "Unsubscribed At",
    //   dataIndex: "unsubscribedAt",
    //   key: "unsubscribedAt",
    // },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a onClick={() => handleDeleteSubscription(record.id)}>
    //         <Tooltip title="Delete" placement="top">
    //           <AiFillDelete className="text-red-500" size={20} />
    //         </Tooltip>
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      <div>
        <BreadCrumb />
      </div>
      <DashboardTable columns={columns} data={subscriptionData} loading={isLoading || isDeleting} />
    </>
  );
};

export default Subscription;
