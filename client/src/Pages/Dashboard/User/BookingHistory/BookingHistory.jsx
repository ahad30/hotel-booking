import React, { useState, useRef } from "react";
import { Table, Tag, Space, Tooltip, Button } from "antd";
import { AiFillEye, AiOutlineFilePdf } from "react-icons/ai";
import moment from "moment";
import { FaGreaterThan, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { setIsViewModalOpen } from "../../../../redux/Modal/ModalSlice";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ViewModal from "../../../../components/Modal/ViewModal";
import ViewBooking from "./ViewBooking";
import { useGetUserBookingsQuery } from "../../../../redux/Feature/Admin/booking/bookingApi";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import image from "../../../../assets/icon.png"; // Adjust the path to your logo image


// Create styles for PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1 solid #000',
    paddingBottom: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontWeight: 'bold',
    width: '40%'
  },
  value: {
    width: '60%'
  },
  roomRow: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '1 solid #eee'
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#666'
  },
 logoContainer: {
    display: 'flex',
  
    justifyContent: 'center',
    alignItems: 'center'},
  logo: {
    width: 150,
    marginBottom: 10
  }


});

// Create PDF document component for each booking
const BookingReceipt = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
        <Image src={image} style={styles.logo} />
        </View>
        <Text style={styles.title}>BOOKING RECEIPT</Text>
        <Text style={styles.subtitle}>Thank you for your reservation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Information</Text>
        {/* <View style={styles.row}>
          <Text style={styles.label}>Booking ID:</Text>
          <Text style={styles.value}>{booking.id}</Text>
        </View> */}
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{booking.transactionId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booking Date:</Text>
          <Text style={styles.value}>{booking.createdAt}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{booking.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{booking.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{booking.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stay Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Check-In:</Text>
          <Text style={styles.value}>{booking.checkIn}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Check-Out:</Text>
          <Text style={styles.value}>{booking.checkOut}</Text>
        </View>
        {/* <View style={styles.row}>
          <Text style={styles.label}>Nights:</Text>
          <Text style={styles.value}>
            {moment(booking.checkOut).diff(moment(booking.checkIn), 'days')} nights
          </Text>
        </View> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Room Details</Text>
        {booking?.bookingItem?.map((room, index) => (
          <View key={index} style={styles.roomRow}>
            <View style={styles.row}>
              <Text style={styles.label}>Room {index + 1}:</Text>
              <Text style={styles.value}>{room.type} (Room #{room.roomNumber})</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Capacity:</Text>
              <Text style={styles.value}>{room.capacity} person(s)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>${room.price}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amenities:</Text>
              <Text style={styles.value}>{room.amenities.join(', ')}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>${booking.totalPrice}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Status:</Text>
          <Text style={styles.value}>
            {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booking Status:</Text>
          <Text style={styles.value}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          <Text style={[styles.label, { fontWeight: 'bold', fontSize: 16 }]}>Total:</Text>
          <Text style={[styles.value, { fontWeight: 'bold', fontSize: 16 }]}>
            ${booking.totalPrice}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for choosing our service!</Text>
        <Text>For any inquiries, please contact support@example.com</Text>
      </View>
    </Page>
  </Document>
);

const BookingHistory = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const { data, error, isLoading } = useGetUserBookingsQuery(user?.id);
  const { isViewModalOpen } = useAppSelector((state) => state.modal);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookingsData = data?.data?.map((booking, index) => ({
    key: index + 1,
    id: booking?.id,
    name: booking?.name,
    email: booking?.email,
    phone: booking?.phone,
    checkIn: moment(booking?.checkIn).format("Do MMM YYYY ,  h:mm a"),
    checkOut: moment(booking?.checkOut).format("Do MMM YYYY ,  h:mm a"),
    totalPrice: booking?.totalPrice,
    paymentStatus: booking?.paymentStatus,
    status: booking?.status,
    transactionId: booking?.transactionId,
    bookingItem: booking?.bookingItem,
    createdAt: moment(booking?.createdAt).format('Do MMMM YYYY, h:mm:ss a')
  }));

  const handleViewBooking = (bookingData) => {
    setSelectedBooking(bookingData);
    dispatch(setIsViewModalOpen());
  };

  const columns = [
    {
      title: "Booking Id",
      dataIndex: "id",
      key: "id",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   key: "name",
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   key: "phone",
    // },
    // {
    //   title: "Price",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   render: (totalPrice) => <Tag color="cyan">{totalPrice} Tk</Tag>,
    // },
    // {
    //   title: "Payment",
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
    //   render: (status) => (
    //     <Tag color={status === "paid" ? "green" : "red"}>{status}</Tag>
    //   ),
    // },
    // {
    //   title: "Booking Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag
    //       color={
    //         status === "pending"
    //           ? "blue"
    //           : status === "confirmed"
    //           ? "green"
    //           : status === "cancelled"
    //           ? "red"
    //           : "default"
    //       }
    //     >
    //       {status}
    //     </Tag>
    //   ),
    // },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Booking Details">
            <Button 
              type="text" 
              icon={<AiFillEye className="text-blue-500" size={20} />} 
              onClick={() => handleViewBooking(record)}
            />
          </Tooltip>
          <Tooltip title="Download PDF">
            <PDFDownloadLink 
              document={<BookingReceipt booking={record} />} 
              fileName={`Booking_${record.id}.pdf`}
            >
              {({ loading }) => (
                loading ? 'Loading...' :  
                <Button type="text" icon={<AiOutlineFilePdf className="text-red-500" size={20} />} />
              )}
            </PDFDownloadLink>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="py-5">
        <DashboardTable columns={columns} data={bookingsData} loading={isLoading} />

        <ViewModal width={800} isViewModalOpen={isViewModalOpen}>
          {selectedBooking && (
            <>
              <ViewBooking selectedBooking={selectedBooking} />
              <div className="text-center mt-4">
                <PDFDownloadLink 
                  document={<BookingReceipt booking={selectedBooking} />} 
                  fileName={`Booking_${selectedBooking.id}.pdf`}
                >
                  {({ loading }) => (
                    loading ? 'Preparing document...' : 
                    <Button type="primary" icon={<AiOutlineFilePdf />} className="bg-red-500 hover:bg-red-600">
                      Download Receipt
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </>
          )}
        </ViewModal>
      </div>
    </>
  );
};

export default BookingHistory;