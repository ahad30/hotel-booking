import React from 'react'
import dynamic from "next/dynamic";

const Spin = dynamic(() => import("antd/lib/spin"), { ssr: false });

const DashboardLoading = () => {
  return (

<div className="flex justify-center items-center mt-[200px]">
  <Spin size="large" />
</div>

  )
}

export default DashboardLoading
