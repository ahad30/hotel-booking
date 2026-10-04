import { Document, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { differenceInCalendarDays, format } from "date-fns";
import logo from "../../../../assets/icon.png";

// The built-in PDF font has no ৳ glyph, so amounts are written as "BDT".
const bdt = (v) => `BDT ${new Intl.NumberFormat("en-US").format(Number(v) || 0)}`;
const day = (d) => format(new Date(d), "EEE, d MMM yyyy");

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: "Helvetica", fontSize: 11, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  logo: { width: 90 },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  muted: { color: "#66738a" },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 8, paddingBottom: 4, borderBottom: "1 solid #d5dae2" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#66738a" },
  item: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottom: "1 solid #eceef2" },
  total: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "1 solid #111827" },
  bold: { fontFamily: "Helvetica-Bold" },
  footer: { marginTop: 28, textAlign: "center", color: "#66738a", fontSize: 10 },
});

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text>{value || "—"}</Text>
  </View>
);

export const BookingReceipt = ({ booking, hotelName }) => {
  const nights = Math.max(1, differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn)));
  return (
    <Document title={`BEHB booking ${booking.transactionId || booking.id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>Booking receipt</Text>
            <Text style={styles.muted}>Issued {format(new Date(), "d MMM yyyy")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking</Text>
          <Row label="Hotel" value={hotelName} />
          <Row label="Transaction ID" value={booking.transactionId} />
          <Row label="Booked on" value={day(booking.createdAt)} />
          <Row label="Status" value={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} />
          <Row label="Payment" value={booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "failed" ? "Failed" : "Pending"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest</Text>
          <Row label="Name" value={booking.name} />
          <Row label="Email" value={booking.email} />
          <Row label="Phone" value={booking.phone} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stay</Text>
          <Row label="Check-in" value={day(booking.checkIn)} />
          <Row label="Check-out" value={day(booking.checkOut)} />
          <Row label="Nights" value={String(nights)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rooms</Text>
          {(booking.bookingItem || []).map((item, i) => (
            <View key={i} style={styles.item}>
              <View>
                <Text style={styles.bold}>
                  {item.roomType} room × {item.quantity || 1}
                </Text>
                <Text style={styles.muted}>
                  {item.adults || 0} adults, {item.children || 0} children · {bdt(item.price)} per night
                </Text>
              </View>
              <Text>{bdt((item.price || 0) * (item.quantity || 1) * nights)}</Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.bold}>Total</Text>
            <Text style={styles.bold}>{bdt(booking.totalPrice)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Thank you for booking with BEHB · behb-hotel-booking.vercel.app</Text>
      </Page>
    </Document>
  );
};

// Renders the PDF on demand and triggers a download.
export const downloadReceipt = async (booking, hotelName) => {
  const blob = await pdf(<BookingReceipt booking={booking} hotelName={hotelName} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BEHB-booking-${booking.transactionId || booking.id}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
