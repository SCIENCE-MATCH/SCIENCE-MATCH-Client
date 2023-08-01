import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Axios from "axios";
import SidebarMember from "./adminRoutes/SidebarMember";
import ManageMember from "./adminRoutes/ManageMember";
import SidebarQuestion from "./adminRoutes/SidebarQuestion";
import ManageQuestion from "./adminRoutes/ManageQuestion";
import SidebarSettings from "./SidebarSettings";
import Settings from "./Settings";

function Admin() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Science Match</h1>
      <div
        style={{
          marginTop: "50px",
          display: "flex",
          width: "800px",
          margin: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SidebarMember />
          <SidebarQuestion />
          <SidebarSettings />
        </div>
        <div style={{ width: "50px" }} />
        <Route path="/admin/인원관리/:manageOpt" component={ManageMember} />
        <Route path="/admin/문제관리/:manageOpt" component={ManageQuestion} />
        <Route path="/admin/settings" component={Settings} />
      </div>
    </div>
  );
}

export default Admin;
