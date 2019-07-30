<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/doctors">
        <i class="fas fa-user-md fa-3x" style="color:white"></i>
        <p>Doctors</p>
      </sidebar-link>
      <sidebar-link to="/patients">
        <i class="fas fa-users fa-3x" style="color:white"></i>
        <p>Patients</p>
      </sidebar-link>
      <sidebar-link to="/transactions">
        <i class="fas fa-exchange-alt fa-3x" style="color:white"></i>
        <p>Transactions</p>
      </sidebar-link>
      <sidebar-link to="/appointments">
        <i class="fas fa-calendar-plus fa-3x" style="color:white"></i>
        <p>Appointments</p>
      </sidebar-link>
      <sidebar-link to="/requests">
        <i class="fas fa-paper-plane fa-3x" style="color:white"></i>
        <p>Requests</p>
      </sidebar-link>
      <sidebar-link to="/notices">
        <i class="fas fa-bell fa-3x" style="color:white"></i>
        <p>Notices</p>
      </sidebar-link>
      <sidebar-link to="/analytics">
        <i class="fas fa-chart-bar fa-3x" style="color:white"></i>
        <p>Analytics</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content></dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  }
};
</script>
