import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Doctors from "@/pages/Doctors.vue";
import NewDoctor from "@/pages/NewDoctor.vue";
import UpdateDoctor from "@/pages/UpdateDoctor.vue";
import Patients from "@/pages/Patients.vue";
import PatientDetails from "@/pages/PatientDetails.vue";
import Transactions from "@/pages/Transactions.vue";
import Appointments from "@/pages/Appointments.vue";
import Requests from "@/pages/Requests.vue";
import Notices from "@/pages/Notices.vue";
import NewNotice from "@/pages/NewNotice.vue";
import Analytics from "@/pages/Analytics.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "doctors",
        name: "Doctors",
        component: Doctors
      },
      {
        path: "new doctor",
        name: "NewDoctor",
        component: NewDoctor
      },
      {
        path: "/update doctor/:doctor_id",
        name: "UpdateDoctor",
        component: UpdateDoctor
      },
      {
        path: "/patients",
        name: "Patients",
        component: Patients
      },
      {
        path: "/patient details/:patient_id",
        name: "PatientDetails",
        component: PatientDetails
      },
      {
        path: "/transactions",
        name: "Transactions",
        component: Transactions
      },
      {
        path: "/appointments",
        name: "Appointments",
        component: Appointments
      },
      {
        path: "/requests",
        name: "Requests",
        component: Requests
      },
      {
        path: "notices",
        name: "Notices",
        component: Notices
      },
      {
        path: "/new notice",
        name: "NewNotice",
        component: NewNotice
      },
      {
        path: "/analytics",
        name: "Analytics",
        component: Analytics
      }
    ]
  }
];

export default routes;
