<template>
  <div class="content">
    <div class="md-layout">
      
        <pulse-loader :color="transactionsLoaderColor" v-show="showTransactionsLoader"></pulse-loader>

      <div class="md-layout-item md-large-size-100 md-xsmall-size-100 md-size-100">
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
    </div> <!-- End transactions graph document -->

    <div class="md-layout">
      
        <pulse-loader :color="requestLoaderColor"  v-show="showRequestsLoader"></pulse-loader>

      <div class="md-layout-item md-large-size-100 md-xsmall-size-100 md-size-100">
        <chart-card
          :chart-data="dailyRequestsChart.data"
          :chart-options="dailyRequestsChart.options"
          :chart-type="'Line'"
          :key="requestsGraphComponentKey"
          data-background-color="green"
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
    </div> <!-- End requests graph document -->

    <div class="md-layout">
      
        <pulse-loader :color="appointmentLoaderColor"  v-show="showAppointmentsLoader"></pulse-loader>

      <div class="md-layout-item md-large-size-100 md-xsmall-size-100 md-size-100">
        <chart-card
          :chart-data="dailyAppointmentsChart.data"
          :chart-options="dailyAppointmentsChart.options"
          :chart-type="'Line'"
          :key="appointmentsGraphComponentKey"
          data-background-color="blue"
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
    </div> <!-- End appointments graph document -->

  </div>
</template>

<script>
import db from "@/components/firebaseInit";
import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  NavTabsTable,
  OrderedTable
} from "@/components"; //import graph components
import PulseLoader from "vue-spinner/src/PulseLoader.vue"; //import spinner(for loading)

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
    PulseLoader //the imported vuejs spinner
  },
  name: "Analytics",
  data() {
    return {  
      last_refresh_time: null,

      transactionsLoaderColor:"#15BBCF",
      transactionsLoading:true,
      showTransactionsLoader: true,  
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
      requestLoaderColor:"#57AF5B",
      requestsLoading:true,    
      requestsGraphComponentKey: 0,
      requests_array: [],
      showRequestsLoader: true,
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

      appointmentLoaderColor:"#15BBCF",
      appointmentsLoading:true,
      appointmentsGraphComponentKey: 0,
      appointments_array: [],
      showAppointmentsLoader: true, 
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
      await this.transactionAnalytics();  //call function
      this.transactionsGraphComponentKey +=1; //re render component
      this.showTransactionsLoader = false; //Remove loader

      await this.requestsAnalytics();
      this.requestsGraphComponentKey +=1; 
      this.showRequestsLoader = false; 

      await this.appointmentsAnalytics();
      this.appointmentsGraphComponentKey +=1; 
      this.showAppointmentsLoader = false; 
      
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
        transactionLabels[counter] = day + " (" + date + ")";
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
        no_of_requests = await this.getCollectionCount(
          "requests",
          date
        );
     //   console.log(date + " : " + no_of_requests);

        /*
         *Now add the days and their respective series (no of trans) on the graph data
         */
        requestLabels[counter] = day + " (" + date + ")";
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
        appointmentLabels[counter] = day + " (" + date + ")";
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