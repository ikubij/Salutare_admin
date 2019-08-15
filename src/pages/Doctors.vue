<template>
  <div class="content">
    <div class="md-layout">
      <router-link
        to="/new doctor"
        tag="md-button"
        class="md-info"
        style="padding:0 10px 0 10px; margin-left:80%"
      >
        <i class="fas fa-user-plus fa-sm" aria-hidden="true" style="margin-right:10px"></i>
        <span style="margin-left:1vh">Add new doctor</span>
      </router-link>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <pulse-loader  :color="color"  v-show="showLoader"></pulse-loader>
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">Salutare doctors</h4>
            </div>
            <md-field md-clearable class="md-toolbar-section-end md-layout-item">
              <md-input
                placeholder="Search by any criteria..."
                v-model="search"
                @input="searchOnTable"
              />
            </md-field>
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
                >{{ item.docName }}</md-table-cell>
                <md-table-cell md-label="Phone no" md-sort-by="phone">{{ item.phone }}</md-table-cell>
                <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Speciality" md-sort-by="speciality">{{ item.speciality }}</md-table-cell>
                <md-table-cell md-label="Residence" md-sort-by="residence">{{ item.residence }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.activityStatus }}</md-table-cell>

                <md-table-cell md-label="actions">
                  <md-button
                    class="md-just-icon md-simple md-primary"
                    tag="router-link"
                    v-bind:to="{ name: 'UpdateDoctor', params: { doctor_id: item.id }}"
                  >
                    <md-icon>edit</md-icon>
                    <md-tooltip md-direction="top">Edit</md-tooltip>
                  </md-button>
                  <md-button
                    class="md-just-icon md-simple md-danger"
                    tag="router-link"
                    @click="deleteDoctor(item)"
                  >
                    <md-icon>close</md-icon>
                    <md-tooltip md-direction="top">Delete</md-tooltip>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!--End Doctor's table-->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <google-map name="GoogleMap" :testProp="doctorPropData" :markers="doctorMarkers"></google-map>
      </div>
      <!--End Doctor's Map-->
    </div>
  </div>
</template>

<script>
import db from "@/components/firebaseInit";
import { GoogleMap } from "@/components"; //import Google map component
import PulseLoader from "vue-spinner/src/PulseLoader.vue"; //import spinner(for loading)

const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByCriteria = (items, term) => {
  if (term) {
    return items.filter(
      item =>
        toLower(item.docName).includes(toLower(term)) ||
        toLower(item.email).includes(toLower(term)) ||
        toLower(item.speciality).includes(toLower(term)) ||
        toLower(item.phone).includes(toLower(term)) ||
        toLower(item.activityStatus).includes(toLower(term)) ||
        toLower(item.residence).includes(toLower(term)) 
    );
  }

  return items;
};

export default {
  components: {
    GoogleMap, //the imported google map component
    PulseLoader //the imported vuejs spinner
  },
  name: "Doctors",
  data() {
    return {
      showLoader: true, //activate spinner
      search: null,
      searched: [],
      doctors_array: [],
      doctorMarkers: []
    };
  },
  created() {
    // Call our async function in a try block to catch connection errors.
    try {
      this.run(); //Initiate the program
    } catch (err) {
      console.log("Error with run functon: ", err);
    }

    this.doctors = this.doctors_array; //Instantiate data to the v-model to be displayed
  }, //end created
  methods: {
    // In the async/await example, we need to wrap our code inside a function
    // and mark it as 'async'. This allows us to 'await' on a Promise.
    async run() {
      setTimeout(() => {
        this.fetchDoctorsData();
        this.showLoader = false; //remove spinner
      }, 2000);

      // await this.forceRerender();
    }, // End function Run
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

            //draw doctor's marker on map
            this.generateMarker(docData);
          });
        });
    }, //end get doctors
    async generateMarker(docData) {
      var latitude = docData.docCordinates._lat;
      var longitude = docData.docCordinates._long;
      var markerInfoWindow = "";

      markerInfoWindow += " <md-card >";
      markerInfoWindow += " <md-card-header>";
      markerInfoWindow += " <md-card-header-text>";
      markerInfoWindow +=
        ' <div class="md-title">' + docData.docName + "</div>";
      markerInfoWindow +=
        ' <div class="md-subhead">Currently: <strong  style="color:' +
        docData.activityColor +
        '">' +
        docData.activityStatus +
        "</strong></div>";
      markerInfoWindow +=
        ' <div class="md-subhead">Phone No: <strong>' +
        docData.phone +
        "</strong></div>";
      markerInfoWindow +=
        ' <div class="md-subhead">Email: <strong>' +
        docData.email +
        "</strong></div>";
      markerInfoWindow +=
        ' <div class="md-subhead">Speciality: <strong>' +
        docData.speciality +
        "</strong></div>";
      markerInfoWindow +=
        ' <div class="md-subhead">Residence: <strong>' +
        docData.residence +
        "</strong></div>";
      markerInfoWindow += " </md-card-header-text>";
      markerInfoWindow += " </md-card-header>";
      markerInfoWindow += " </md-card>";

      const marker = {
        position: {
          lat: latitude,
          lng: longitude
        },
        infoText: markerInfoWindow
      };

      //this.markers.push({ position: marker });
      this.doctorMarkers.push(marker);
    }, //end generateMarker
    async deleteDoctor(item) {
      try {
        if (confirm("Are you sure?")) {
          await db
            .collection("doctors")
            .doc(item.id)
            .delete();
          this.$router.go({
            name: "Doctors"
          });
        }
      } catch (error) {
        this.error = error.response.data.error;
      }
    }, // end delete doctor
    searchOnTable() {
      this.doctors = searchByCriteria(this.doctors_array, this.search);
    } //end search table
  }
};
</script>