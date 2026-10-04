import { Table } from "antd";

// Shared list table for dashboard pages, framed as a card with horizontal scroll on small screens.
const DashboardTable = ({ columns, data, loading }) => (
  <div className="card overflow-hidden p-2">
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
      scroll={{ x: "max-content" }}
      size="middle"
    />
  </div>
);

export default DashboardTable;
