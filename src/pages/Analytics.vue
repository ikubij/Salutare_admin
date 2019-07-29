<template>
  <div class="content">
    <div class="md-layout">
      
        <pulse-loader :loading="loading" :color="color" :size="size" v-show="showLoader"></pulse-loader>

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
      <!--End daily sales-->
    </div>
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
  name: "Transactions",
  data() {
    return {  
      showLoader: true,  //to activate spinner 
      last_refresh_time: null,
      transactionsGraphComponentKey: 0,
      transactions_array: [],
      loading: true,
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
          high: 5, // the Y axis
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      } //End daily transactions chart
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
      await this.transactionAnalytics();
      await this.forceRerender();
      this.showLoader = false; //Remove loader
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
        console.log(date + " : " + no_of_transactions);

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

    //Function to return day of timestam
    getDay(timestamp) {
      var array = timestamp.split(" ");
      return array[0];
    },

    //Function to refresh graph after data is fetched
    forceRerender() {
      this.transactionsGraphComponentKey += 1;
    },

    async getCollectionCount(collectionName, dateToCount) {
      var no_of_transactions = 0;
      await db
        .collection(collectionName)
        .where("date", "==", dateToCount)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            /**
             * Increment the number of transactions
             */
            no_of_transactions++;
          });
        }); //end request collection
      return no_of_transactions;
    }, // end getCollectionCount on particular date

    structureDate(timestamp) {
      var month = timestamp.getMonth() + 1;
      var timestamp = timestamp.toString(); //convert to get date and year

      var array = timestamp.split(" ");
      var day = array[2];
      var year = array[3];

      //add a 0 before if less than 10
      if (day < 10) {
        day = "0" + day;
      }
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