<template>
  <div class="content">
    <div class="md-layout md-alignment-top-center">
      <router-link
        to="/patients"
        tag="md-button"
        class="md-info"
        style="padding:0 10px 0 10px; margin-left:80%"
      >
        <i class="far fa-arrow-alt-circle-left fa-sm" aria-hidden="true" style="margin-right:10px"></i>
        <span style="margin-left:1vh">Go back</span>
      </router-link>

      <div class="md-layout-item md-medium-size-100 md-size-33">
        <div class="md-card md-card-profile md-theme-default">
          <div class="md-card-avatar" style="padding:15px">
            <img src="@/assets/img/faces/patient2.png" class="img" />
          </div>
          <div class="md-card-content">
            <h6 class="category text-gray">{{patient_details.phone}} | {{patient_details.email}}</h6>
            <h4 class="card-title">{{patient_details.firstName}} {{patient_details.lastName}}</h4>
            <md-divider></md-divider>

            <h6>Date of birth</h6>
            <h6 class="category text-gray">{{patient_details.DOB}}</h6>
            <h6>Gender</h6>
            <h6 class="category text-gray card-title" style="tex">{{patient_details.gender}}</h6>
          </div>
        </div>
      </div>
      <!--end patients details -->

      <!------------------------------TRANSACTIONS---------------------->
      <div class="md-layout-item md-small-size-50 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4
                class="title"
              >{{patient_details.firstName}} {{patient_details.lastName}} Transactions</h4>
            </div>
          </md-card-header>
          <md-card-content>
            <md-table
              v-model="transactions"
              :table-header-color="tableHeaderColor"
              md-sort="dateTime"
              md-sort-order="asc"
            >
              <md-table-empty-state
                md-label="No Transactions found "
                :md-description="`Kindly wait.`"
              ></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Transaction Date" md-sort-by="dateTime">{{ item.dateTime }}</md-table-cell>
                <md-table-cell
                  md-label="Doctor's Name"
                  md-sort-by="doctorName"
                >{{ item.doctorName }}</md-table-cell>
                <md-table-cell
                  md-label="Doctor's speciality"
                  md-sort-by="doctorSpeciality"
                >{{ item.doctorSpeciality }}</md-table-cell>
                <md-table-cell
                  md-label="Session Duration"
                  md-sort-by="sessionDuration"
                >{{ item.sessionDuration }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!----------------------------end table for transactions--------->

      <!------------------------------REQUESTS---------------------->
      <div class="md-layout-item md-small-size-50 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">{{patient_details.firstName}} {{patient_details.lastName}} Requests</h4>
            </div>
          </md-card-header>
          <md-card-content>
            <md-table
              v-model="requests"
              :table-header-color="tableHeaderColor"
              md-sort="dateTime"
              md-sort-order="asc"
            >
              <md-table-empty-state md-label="No Requests found " :md-description="`Kindly wait.`"></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell
                  md-label="Doctor's Name"
                  md-sort-by="doctorName"
                >{{ item.doctorName }}</md-table-cell>
                <md-table-cell
                  md-label="Doctor's speciality"
                  md-sort-by="doctorSpeciality"
                >{{ item.doctorSpeciality }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.status }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!----------------------------end table for requests--------->

      <!------------------------------APPOINTMENTS---------------------->
      <!-- <div class="md-layout-item md-small-size-50 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4
                class="title"
              >{{patient_details.firstName}} {{patient_details.lastName}} Appointments</h4>
            </div>
          </md-card-header>
          <md-card-content>
            <md-table v-model="appointments" :table-header-color="tableHeaderColor" md-sort="dateTime" md-sort-order="asc">
              <md-table-empty-state
                md-label="No doctors found "
                :md-description="`Kindly wait.`"
              ></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Transaction Date" md-sort-by="dateTime">{{ item.dateTime }}</md-table-cell>
                <md-table-cell md-label="Patient's Name" md-sort-by="patientName">{{ item.patientName }}</md-table-cell>
                <md-table-cell md-label="Doctor's Name" md-sort-by="doctorName">{{ item.doctorName }}</md-table-cell>
                <md-table-cell md-label="Doctor's speciality" md-sort-by="doctorSpeciality">{{ item.doctorSpeciality }}</md-table-cell>
                <md-table-cell md-label="Session Duration" md-sort-by="sessionDuration">{{ item.sessionDuration }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>-->
      <!----------------------------end table for appointments--------->
    </div>
  </div>
</template>

<script>
import db from "@/components/firebaseInit";
import { async } from "q";

export default {
  name: "patient details",
  data() {
    return {
      patient_details: {},
      patient_transactions: [],
      patient_requests: [],
      patient_appointments: []
    };
  },

  created() {
    //get patient's details
    const ref = db.collection("patients").doc(this.$route.params.patient_id);
    ref.get().then(doc => {
      if (doc.exists) {
        this.patient_details = doc.data();
      } else {
        alert("No such document!");
      }
    }); //end patient details

    // Call our async function in a try block to catch connection errors.
    try {
      this.run(); //Initiate the program
    } catch (err) {
      console.log("Error with run functon: ", err);
    }

    //Instantiate data to the v-model to be displayed
    this.transactions = this.patient_transactions;
    this.requests = this.patient_requests;
    this.appointments = this.patient_appointments;
  }, //end created

  // watch: {
  //   $route: "fetchData"
  // },

  methods: {
    // In the async/await example, we need to wrap our code inside a function
    // and mark it as 'async'. This allows us to 'await' on a Promise.
    async run() {
      await this.getTransactions();
      await this.getRequests();
      await this.getAppointments();

      // console.log(this.patient_transactions);
      console.log(this.patient_requests);
    }, // End function Run

    getTransactions() {
      db.collection("transactions")
        .where("patientID", "==", this.$route.params.patient_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const transaction_data = {
              appointmentId: doc.data().appointmentId,
              doctorId: doc.data().doctorId,
              doctorName: doc.data().doctorName,
              doctorSpeciality: doc.data().doctorSpeciality,
              patientName: doc.data().patientName,
              sessionDuration: doc.data().sessionDuration,
              timestamp: doc.data().timestamp,
              dateTime: this.structureDateTime(doc.data().timestamp)
            };
            this.patient_transactions.push(transaction_data);
          });
        }); //end request collection
    }, // end get Transactions

    getRequests() {
      db.collection("requests")
        // .where("patientID", "==", "Qhyaaxk9cxaSf9vhbAmy")
        // .where("patientID", "==", this.$route.params.patient_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log("a");
            const request_data = {
              doctorId: doc.data().doctorId,
              doctorName: doc.data().doctorName,
              doctorSpeciality: doc.data().doctorSpeciality,
              patientLocation: doc.data().patientLocation,
              status: doc.data().status
            };
            this.patient_requests.push(request_data);
          });
        }); //end transaction collection
    }, // end get Requests

    getAppointments() {
      db.collection("appointments")
        .where("patientID", "==", this.$route.params.patient_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const transaction_data = {
              appointmentId: doc.data().appointmentId,
              doctorId: doc.data().doctorID,
              doctorName: doc.data().doctorName,
              doctorSpeciality: doc.data().doctorSpeciality,
              patientName: doc.data().patientName,
              sessionDuration: doc.data().sessionDuration,
              timestamp: doc.data().timestamp,
              dateTime: this.structureDateTime(doc.data().timestamp)
            };
            this.patient_appointments.push(appointment_data);
          });
        }); //end appointments collection
    }, // end get Appointments

    structureDateTime(timestamp) {
      var array = timestamp.split("-");
      var dateString =
        array[0] +
        "/" +
        array[1] +
        "/" +
        array[2] +
        "  " +
        array[3] +
        ":" +
        array[4] +
        ":" +
        array[5];
      return dateString;
    } //end structure date and time
  }
};
</script>