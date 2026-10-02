import React, { forwardRef } from "react";
import { Card, Row, Col, Typography, Steps, Divider, Table, Tag, Button } from "antd";
import moment from "moment";
import { AiOutlineFilePdf } from "react-icons/ai";

const { Title, Text } = Typography;
const { Step } = Steps;

const ViewBooking = forwardRef(({ selectedBooking, onPrint }, ref) => {
  if (!selectedBooking) {
    return <div>Loading...</div>;
  }

  // Booking status steps
  const getBookingSteps = (status) => {
    const steps = [
      { title: "Pending", key: "pending", description: "Booking is awaiting confirmation." },
      { title: "Confirmed", key: "confirmed", description: "Your booking has been confirmed." },
      // { title: "Checked In", key: "checkedIn", description: "You have checked in." },
      // { title: "Checked Out", key: "checkedOut", description: "Your stay has been completed." },
      { title: "Cancelled", key: "cancelled", description: "Your booking has been cancelled." },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === status);

    return { steps, currentStepIndex };
  };

  const { steps, currentStepIndex } = getBookingSteps(selectedBooking.status);

  // Table columns for rooms
  const roomColumns = [
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "Type",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },

    {
      title: "Room Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Adults",
      dataIndex: "adults",
      key: "adults",
    },
    {
      title: "Children",
      dataIndex: "children",
      key: "children",
    },

    
    {
      title: "Amenities",
      dataIndex: "amenities",
      key: "amenities",
      render: (amenities) => (
        <div className="flex flex-wrap max-w-[200px] mx-auto items-center justify-center gap-3" >
          {amenities.map((amenity, index) => (
            <Tag key={index} color="blue">
              {amenity}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  // Table data for rooms
  const roomData = selectedBooking?.bookingItem?.map((room, index) => ({
    key: index,
    ...room,
  }));

  return (
    <div ref={ref} className="py-5 px-3">

        {/* Booking Header */}
        <div className="text-center">
          <h1 className="text-2xl mb-5 font-bold">Booking Details</h1>
        </div>
        <Row gutter={[16, 16]}>
  {/* Transaction ID - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Transaction ID:</Text> {selectedBooking.transactionId}
  </Col>
  
  {/* Booking Date - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Booking Date:</Text> {selectedBooking.createdAt}
  </Col>
  
  {/* Name - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Name:</Text> {selectedBooking.name}
  </Col>
  
  {/* Email - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Email:</Text> {selectedBooking.email}
  </Col>
  
  {/* Phone - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Phone:</Text> {selectedBooking.phone}
  </Col>
  
  {/* Check-In - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Check-In:</Text> {selectedBooking.checkIn}
  </Col>
  
  {/* Check-Out - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Check-Out:</Text> {selectedBooking.checkOut}
  </Col>
  
  {/* Payment Status - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Payment Status:  </Text> 
    <Tag color={selectedBooking.paymentStatus === "paid" ? "green" : "red"}>
      {selectedBooking.paymentStatus}
    </Tag>
  </Col>
  
  {/* Booking Status - Full width on mobile */}
  <Col xs={24} sm={12}>
    <Text strong>Booking Status:  </Text> 
    <Tag color={
      selectedBooking.status === "pending" ? "blue" :
      selectedBooking.status === "confirmed" ? "green" :
      selectedBooking.status === "cancelled" ? "red" : "orange"
    }>
      {selectedBooking.status}
    </Tag>
  </Col>
</Row>

        {/* Booking Progress */}
        {/* <Divider /> */}
        {/* <div className="">
          <Steps direction="vertical" current={currentStepIndex} style={{ marginTop: "24px" }}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} description={step.description} />
            ))}
          </Steps>
        </div> */}

        {/* Room Details */}
        <Divider />
        <div className="text-center">
          <Title level={5}>Booked Rooms</Title>
        </div>
        <Table
          columns={roomColumns}
          dataSource={roomData}
          pagination={false}
          bordered
          scroll={{ x: 800 }}
          responsive={true}
          // summary={() => (
          //   <Table.Summary.Row>
          //     <Table.Summary.Cell colSpan={4} align="right">
          //       <Text strong>Total Price</Text>
          //     </Table.Summary.Cell>
          //     <Table.Summary.Cell>
          //       <Text strong>${selectedBooking.totalPrice}</Text>
          //     </Table.Summary.Cell>
          //   </Table.Summary.Row>
          // )}
        />

        {/* Booking Summary */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5}>Booking Summary</Title>
            <Row>
              <Col span={12}>
                <Text>Number of Rooms</Text>
              </Col>
              <Col span={12}>
                <Text>{selectedBooking?.bookingItem?.length}</Text>
              </Col>
            </Row>
            {/* <Row>
              <Col span={12}>
                <Text>Nights</Text>
              </Col>
              <Col span={12}>
                <Text>
               {moment(selectedBooking.checkOut).diff(moment(selectedBooking.checkIn), 'days')} nights
                </Text>
              </Col>
            </Row> */}
            <Row>
              <Col span={12}>
                <Text strong>Total Price</Text>
              </Col>
              <Col span={12}>
                <Text strong>${selectedBooking.totalPrice}</Text>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* <div className="text-center mt-4">
        <Button 
          type="primary" 
          icon={<AiOutlineFilePdf />} 
          onClick={onPrint}
          className="bg-red-500 hover:bg-red-600"
        >
          Download as PDF
        </Button>
      </div> */}

    </div>
  );
});

export default ViewBooking;