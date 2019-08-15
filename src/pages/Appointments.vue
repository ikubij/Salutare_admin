<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">Salutare Appointments</h4>
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
              v-model="appointments"
              :table-header-color="tableHeaderColor"
              md-sort="date"
              md-sort-order="asc"
            >
              <md-table-empty-state
                md-label="No Appointments found "
                :md-description="`Kindly wait `"
              ></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Appointment Date" md-sort-by="date">{{ item.date }}</md-table-cell>
                <md-table-cell
                  md-label="Patient's Name"
                  md-sort-by="patientName"
                >{{ item.patientName }}</md-table-cell>
                <md-table-cell
                  md-label="Doctor's Name"
                  md-sort-by="doctorName"
                >{{ item.doctorName }}</md-table-cell>
                <md-table-cell
                  md-label="Doctor's Speciality"
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
    return items.filter(
      item =>
        toLower(item.date).includes(toLower(term)) ||
        toLower(item.patientName).includes(toLower(term)) ||
        toLower(item.doctorName).includes(toLower(term)) ||
        toLower(item.doctorSpeciality).includes(toLower(term)) ||
        toLower(item.sessionDuration).includes(toLower(term))
    );
  }

  return items;
};

export default {
  name: "Appointments",
  data() {
    return {
      search: null,
      searched: [],
      appointments_array: [],
      loading: true
    };
  },
  created() {
    this.appointments = this.appointments_array; //Instantiate data to the v-model to be displayed

    db.collection("appointments")
      .get()
      .then(querySnapshot => {
        this.loading = true;
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            date: doc.data().date,
            patientName: doc.data().patientName,
            doctorName: doc.data().doctorName,
            doctorSpeciality: doc.data().doctorSpeciality,
            sessionDuration: doc.data().sessionDuration
          };
          this.appointments_array.push(data);
        });
      });
  },
  methods: {
    searchOnTable() {
      this.appointments = searchByCriteria(this.appointments_array, this.search);
    } //end search table
  }
};
</script>