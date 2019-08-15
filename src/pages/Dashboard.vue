<template>
  <div class="content">
    <pulse-loader :color="color" v-show="showLoader"></pulse-loader>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
        <chart-card
          :chart-data="dailyTransactionsChart.data"
          :chart-options="dailyTransactionsChart.options"
          :chart-type="'Line'"
          :key="transactionsGraphComponentKey"
          data-background-color="blue"
        >
          <template slot="content">
            <h4 class="title">Daily Transactions</h4>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>Updated last at:
              <span id="app">{{ last_refresh_time }}</span>
            </div>
          </template>
        </chart-card>
      </div>
      <!-- End transactions graph document -->

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
        <chart-card
          :chart-data="dailyRequestsChart.data"
          :chart-options="dailyRequestsChart.options"
          :chart-type="'Bar'"
          :key="requestsGraphComponentKey"
          data-background-color="red"
        >
          <template slot="content">
            <h4 class="title">Daily Requests</h4>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>Updated last at:
              <span id="app">{{ last_refresh_time }}</span>
            </div>
          </template>
        </chart-card>
      </div>
      <!-- End requests graph document -->

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
        <chart-card
          :chart-data="dailyAppointmentsChart.data"
          :chart-options="dailyAppointmentsChart.options"
          :chart-type="'Line'"
          :key="appointmentsGraphComponentKey"
          data-background-color="green"
        >
          <template slot="content">
            <h4 class="title">Daily Appointments</h4>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>Updated last at:
              <span id="app">{{ last_refresh_time }}</span>
            </div>
          </template>
        </chart-card>
      </div>
      <!-- End appointments graph document -->
    </div>
    <!-- End column 1-->

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <md-card>
          <md-card-header data-background-color="orange" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">Salutare doctors</h4>
            </div>
          </md-card-header>
          <md-card-content>
            <md-table
              v-model="doctors"
              :table-header-color="tableHeaderColor"
              md-sort="docName"
              md-sort-order="asc"
            >
              <md-table-empty-state
                md-label="No doctors found "
                :md-description="`Kindly wait or try a different search term if searching.`"
              ></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell
                  md-label="Doctor's Name"
                  md-sort-by="docName"
                >{{ item.docName }} {{ item.lastName }}</md-table-cell>
                <md-table-cell md-label="Phone no" md-sort-by="phone">{{ item.phone }}</md-table-cell>
                <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Speciality" md-sort-by="speciality">{{ item.speciality }}</md-table-cell>
                <md-table-cell md-label="Residence" md-sort-by="residence">{{ item.residence }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.activityStatus }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!--End Doctor's table-->

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">Salutare Patients</h4>
            </div>
          </md-card-header>
          <md-card-content>
            <md-table
              v-model="patients"
              :table-header-color="tableHeaderColor"
              md-sort="patientName"
              md-sort-order="asc"
            >
              <md-table-empty-state
                md-label="No patients found "
                :md-description="`Kindly wait or try a different search term if searching.`"
              ></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell
                  md-label="Patient's Name"
                  md-sort-by="patientName"
                >{{ item.patientName }}</md-table-cell>
                <md-table-cell md-label="Phone no" md-sort-by="phone">{{ item.phone }}</md-table-cell>
                <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Gender" md-sort-by="gender">{{ item.gender }}</md-table-cell>
                <md-table-cell md-label="Date of birth" md-sort-by="DOB">{{ item.DOB }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!--End patients Table -->
    </div>
    <!--End column 2-->
  </div>
</template>

<script>
import db from "@/components/firebaseInit";
import PulseLoader from "vue-spinner/src/PulseLoader.vue"; //import spinner(for loading)

import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  NavTabsTable,
  OrderedTable
} from "@/components"; //import graph components
const toLower = text => {
  return text.toString().toLowerCase();
};

export default {
  components: {
    StatsCard,
    ChartCard,
    NavTabsCard,
    NavTabsTable,
    OrderedTable,
    PulseLoader
  },
  name: "Analytics",
  data() {
    return {
      doctors_array: [],
      patients_array: [],

      last_refresh_time: null,

      showLoader: true, //activate spinner
      transactionsLoaderColor: "#15BBCF",
      transactionsLoading: true,
      transactionsGraphComponentKey: 0,
      transactions_array: [],
      dailyTransactionsChart: {
        data: {
          labels: [],
          series: []
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 10, // the Y axis
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }, //End daily transactions chart Data
      requestLoaderColor: "#57AF5B",
      requestsLoading: true,
      requestsGraphComponentKey: 0,
      requests_array: [],
      dailyRequestsChart: {
        data: {
          labels: [],
          series: []
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 10, // the Y axis
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }, //End daily Requests chart Data

      appointmentLoaderColor: "#15BBCF",
      appointmentsLoading: true,
      appointmentsGraphComponentKey: 0,
      appointments_array: [],
      dailyAppointmentsChart: {
        data: {
          labels: [],
          series: []
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 10, // the Y axis
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      } //End daily appointments chart Data
    };
  },
  created() {
    //Instantiate data to the v-model to be displayed
    this.doctors = this.doctors_array;
    this.patients = this.patients_array;

    //set the time graphs are displayed for the first time
    this.last_refresh_time = new Date().toLocaleTimeString("en-US");
    // Call our async function in a try block to catch connection errors.
    try {
      this.run(); //Initiate the program
    } catch (err) {
      console.log("Error with run functon: ", err);
    }
  }, //end created
  methods: {
    // In the async/await example, we need to wrap our code inside a function
    // and mark it as 'async'. This allows us to 'await' on a Promise.
    async run() {
      //Initiation of program functions
      await this.fetchDoctorsData();
      await this.fetchPatientsData();

      await this.transactionAnalytics(); //call function
      this.transactionsGraphComponentKey += 1; //re render component

      await this.requestsAnalytics();
      this.requestsGraphComponentKey += 1;

      await this.appointmentsAnalytics();
      this.appointmentsGraphComponentKey += 1;

      this.showLoader = false; //remove spinner
    }, // End function Run

    async transactionAnalytics() {
      let transactionLabels = [];
      let transactionSeries = [];
      let transactionSeriesArray = [];

      var dateStartAnalysis = new Date();
      dateStartAnalysis.setDate(dateStartAnalysis.getDate() - 6);

      //console.log(dateStartAnalysis);

      /**
       * Declaration of variables to be used INSIDE the loop
       *
       */
      var counter = 0;
      while (counter <= 6) {
        /**
         * Declaration of variables to be used WHILE looping
         */
        var no_of_transactions;
        var day;
        var date;

        // get the name of the day with function, convert to string timestamp
        day = this.getDay(dateStartAnalysis.toString());
        // structure date to match with that in database
        date = this.structureDate(dateStartAnalysis);

        // console.log(day);
        // console.log(date);

        /**
         * Check Number of transactions on every date
         *
         */
        no_of_transactions = await this.getCollectionCount(
          "transactions",
          date
        );
        // console.log(date + " : " + no_of_transactions);

        /*
         *Now add the days and their respective series (no of trans) on the graph data
         */
        transactionLabels[counter] = day;
        transactionSeries[counter] = no_of_transactions;
        //  console.log(transactionSeries);

        counter++; //increment counter
        //Increment date with 1
        dateStartAnalysis.setDate(dateStartAnalysis.getDate() + 1);
      } // End while loop

      transactionSeriesArray.push(transactionSeries);

      this.dailyTransactionsChart.data.labels = transactionLabels;
      this.dailyTransactionsChart.data.series = transactionSeriesArray;

      //  console.log(this.dailyTransactionsChart.data.series);
      //  console.log(this.dailyTransactionsChart.data.labels);
    }, //end transaction Analytics

    async requestsAnalytics() {
      let requestLabels = [];
      let requestSeries = [];
      let requestSeriesArray = [];

      var dateStartAnalysis = new Date();
      dateStartAnalysis.setDate(dateStartAnalysis.getDate() - 6);

      //console.log(dateStartAnalysis);

      /**
       * Declaration of variables to be used INSIDE the loop
       *
       */
      var counter = 0;
      while (counter <= 6) {
        /**
         * Declaration of variables to be used WHILE looping
         */
        var no_of_requests;
        var day;
        var date;

        // get the name of the day with function, convert to string timestamp
        day = this.getDay(dateStartAnalysis.toString());
        // structure date to match with that in database
        date = this.structureDate(dateStartAnalysis);

        // console.log(day);
        // console.log(date);

        /**
         * Check Number of requests on every date
         *
         */
        no_of_requests = await this.getCollectionCount("requests", date);
        //   console.log(date + " : " + no_of_requests);

        /*
         *Now add the days and their respective series (no of trans) on the graph data
         */
        requestLabels[counter] = day;
        requestSeries[counter] = no_of_requests;
        //  console.log(requestSeries);

        counter++; //increment counter
        //Increment date with 1
        dateStartAnalysis.setDate(dateStartAnalysis.getDate() + 1);
      } // End while loop

      requestSeriesArray.push(requestSeries);

      this.dailyRequestsChart.data.labels = requestLabels;
      this.dailyRequestsChart.data.series = requestSeriesArray;

      //  console.log(this.dailyrequestsChart.data.series);
      //  console.log(this.dailyrequestsChart.data.labels);
    }, //end request Analytics

    async appointmentsAnalytics() {
      let appointmentLabels = [];
      let appointmentSeries = [];
      let appointmentSeriesArray = [];

      var dateStartAnalysis = new Date();
      dateStartAnalysis.setDate(dateStartAnalysis.getDate() - 6);

      //console.log(dateStartAnalysis);

      /**
       * Declaration of variables to be used INSIDE the loop
       *
       */
      var counter = 0;
      while (counter <= 6) {
        /**
         * Declaration of variables to be used WHILE looping
         */
        var no_of_appointments;
        var day;
        var date;

        // get the name of the day with function, convert to string timestamp
        day = this.getDay(dateStartAnalysis.toString());
        // structure date to match with that in database
        date = this.structureDate(dateStartAnalysis);

        // console.log(day);
        // console.log(date);

        /**
         * Check Number of appointments on every date
         *
         */
        no_of_appointments = await this.getCollectionCount(
          "appointments",
          date
        );
        //   console.log(date + " : " + no_of_appointments);

        /*
         *Now add the days and their respective series (no of trans) on the graph data
         */
        appointmentLabels[counter] = day;
        appointmentSeries[counter] = no_of_appointments;
        //  console.log(appointmentSeries);

        counter++; //increment counter
        //Increment date with 1
        dateStartAnalysis.setDate(dateStartAnalysis.getDate() + 1);
      } // End while loop

      appointmentSeriesArray.push(appointmentSeries);

      this.dailyAppointmentsChart.data.labels = appointmentLabels;
      this.dailyAppointmentsChart.data.series = appointmentSeriesArray;

      //  console.log(this.dailyappointmentsChart.data.series);
      //  console.log(this.dailyappointmentsChart.data.labels);
    }, //end appointment Analytics

    async fetchDoctorsData() {
      db.collection("doctors")
        .orderBy("firstName")
        .get()
        .then(querySnapshot => {
          this.loading = true;
          querySnapshot.forEach(doc => {
            var docName = doc.data().firstName + " " + doc.data().lastName;
            var docCordinates = doc.data().latestLocation;
            var activity = doc.data().latestActivity;
            var activityStatus = "";
            var activityColor = "";

            if (activity === 0) {
              activityStatus = "Inactive";
              activityColor = "#EE4F4C";
            } else if (activity === 1) {
              activityStatus = "Active";
              activityColor = "#64BA68";
            }

            const docData = {
              id: doc.id,
              docName: docName,
              phone: doc.data().phone,
              email: doc.data().email,
              activityStatus: activityStatus,
              activityColor: activityColor,
              residence: doc.data().residence,
              speciality: doc.data().speciality,
              docCordinates: docCordinates
            };
            this.doctors_array.push(docData);
          });
        });
    }, //end get doctors data

    async fetchPatientsData() {
      db.collection("patients")
        .orderBy("firstName")
        .get()
        .then(querySnapshot => {
          this.loading = true;
          querySnapshot.forEach(doc => {
            var patientName = doc.data().firstName + " " + doc.data().lastName;

            const docData = {
              id: doc.id,
              patientName: patientName,
              phone: doc.data().phone,
              email: doc.data().email,
              DOB: doc.data().DOB,
              gender: doc.data().gender
            };
          });
        });
    }, //end get patients data

    //Function to return day of timestam
    getDay(timestamp) {
      var array = timestamp.split(" ");
      return array[0];
    },

    async getCollectionCount(collectionName, dateToCount) {
      var counter = 0;
      await db
        .collection(collectionName)
        .where("date", "==", dateToCount)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            /**
             * Increment the count
             */
            counter++;
          });
        }); //end appointment collection
      return counter;
    }, // end getCollectionCount on particular date

    structureDate(timestamp) {
      var month = timestamp.getMonth() + 1;
      var timestamp = timestamp.toString(); //convert to get date and year

      var array = timestamp.split(" ");
      var day = array[2];
      var year = array[3];

      //add a 0 before if less than 10
      // if (day < 10) {
      //   day = "0" + day;
      // }
      if (month < 10) {
        month = "0" + month;
      }

      var structuredDate = day + "-" + month + "-" + year;

      return structuredDate;
    },

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