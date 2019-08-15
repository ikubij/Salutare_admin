<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout"> 
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">Salutare Patients</h4>
            </div>
            <md-field md-clearable class="md-toolbar-section-end md-layout-item">
              <md-input placeholder="Search by any criteria..." v-model="search" @input="searchOnTable" />
            </md-field>
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
                <md-table-cell md-label="Patient's Name" md-sort-by="patientName">{{ item.patientName }}</md-table-cell>
                <md-table-cell md-label="Phone no" md-sort-by="phone">{{ item.phone }}</md-table-cell>
                <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Gender" md-sort-by="gender">{{ item.gender }}</md-table-cell>
                <md-table-cell md-label="Date of birth" md-sort-by="DOB">{{ item.DOB }}</md-table-cell>

                <md-table-cell md-label="actions">
                  <md-button
                    class="md-just-icon md-simple md-primary"
                    tag="router-link"
                    v-bind:to="{ name: 'PatientDetails', params: { patient_id: item.id }}"
                  >
                    <i class="fa fa-eye"></i>
                    <md-tooltip md-direction="top">View more details</md-tooltip>
                  </md-button>
                  <md-button
                    class="md-just-icon md-simple md-danger"
                    tag="router-link"
                    @click="deletePatients(item)"
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
    </div>
  </div>
</template>

<script>
import db from "@/components/firebaseInit";

const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByCriteria = (items, term) => {
  if (term) {
    return items.filter(item =>
      toLower(item.patientName).includes(toLower(term)) ||
      toLower(item.email).includes(toLower(term)) ||
      toLower(item.DOB).includes(toLower(term)) ||
      toLower(item.phone).includes(toLower(term)) ||
      toLower(item.gender).includes(toLower(term)) 
    );
  }

  return items;
};

export default {
  name: "Patients",
  data() {
    return {
      search: null,
      searched: [],
      patients_array: [],
      loading: true
    };
  },
  created() {
    this.patients = this.patients_array; //Instantiate data to the v-model to be displayed
    db.collection("patients")
      .orderBy("firstName")
      .get()
      .then(querySnapshot => {
        this.loading = true;
        querySnapshot.forEach(doc => {
           var patientName = doc.data().firstName + " " + doc.data().lastName;
          const data = {
            id: doc.id,
            patientName: patientName,
            phone: doc.data().phone,
            email: doc.data().email,
            DOB: doc.data().DOB,
            gender: doc.data().gender
          };
          this.patients_array.push(data);
        });
      });
  },
  methods: {
    async deletePatients(item) {
      try {
        if (confirm("Are you sure?")) {
          await db
            .collection("patients")
            .doc(item.id)
            .delete();
          this.$router.go({
            name: "Patients"
          });
        }
      } catch (error) {
        this.error = error.response.data.error;
      }
    }, // end delete Patient
     searchOnTable() {
      this.patients = searchByCriteria(this.patients_array, this.search);
    } //end search table
  }
};
</script>