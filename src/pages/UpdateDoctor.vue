<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Update D. {{doctor.firstName}} {{doctor.lastName}} details</h4>
          </md-card-header>
          <md-card-content>
            <form @submit="onSubmit" class="col s12">
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-field>
                    <label>First Name</label>
                    <md-input v-model.trim="doctor.firstName" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-field>
                    <label>Last Name</label>
                    <md-input v-model.trim="doctor.lastName" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label>Email Address</label>
                    <md-input v-model.trim="doctor.email" type="email"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label>Phone Number</label>
                    <md-input v-model.trim="doctor.phone" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label for="speciality">Speciality</label>
                    <md-select v-model.trim="doctor.speciality" name="speciality" id="speciality">
                      <md-option value="Audiologist">Audiologist</md-option>
                      <md-option value="Allergist">Allergist</md-option>
                      <md-option value="Cardiologist">Cardiologist</md-option>
                      <md-option value="Dentist">Dentist</md-option>
                      <md-option value="Dermatologist">Dermatologist</md-option>
                      <md-option value="Epidemiologist">Epidemiologist</md-option>
                      <md-option value="Gynecologist">Gynecologist</md-option>
                      <md-option value="Immunologist">Immunologist</md-option>
                      <md-option value="Microbiologist">Microbiologist</md-option>
                      <md-option value="Pediatrician">Pediatrician</md-option>
                      <md-option value="Physiologist">Physiologist</md-option>
                    </md-select>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label for="residence">Residence</label>
                    <md-select v-model.trim="doctor.residence" name="residence" id="residence">
                      <md-optgroup label="Westlands">
                        <md-option value="Kitisuru">Kitisuru</md-option>
                        <md-option value="Parklands">Parklands</md-option>
                        <md-option value="Kangemi">Kangemi</md-option>
                      </md-optgroup>
                      <md-optgroup label="Embakasi Central">
                        <md-option value="KayoleNorth">Kayole North</md-option>
                        <md-option value="Komarock">Komarock</md-option>
                        <md-option value="KayoleSouth">Kayole South</md-option>
                      </md-optgroup>
                      <md-optgroup label="Langata">
                        <md-option value="Karen">Karen</md-option>
                        <md-option value="NairobiWest">Nairobi West</md-option>
                        <md-option value="SouthC">South C</md-option>
                      </md-optgroup>
                      <md-optgroup label="Roysambu">
                        <md-option value="Githurai">Githurai</md-option>
                        <md-option value="Zimmerman">Zimmerman</md-option>
                        <md-option value="Kahawa">Kahawa</md-option>
                      </md-optgroup>
                      <md-optgroup label="Starehe">
                        <md-option value="Ngara">Ngara</md-option>
                        <md-option value="Pangani">Pangani</md-option>
                        <md-option value="NairobiCentral">Nairobi Central</md-option>
                      </md-optgroup>
                    </md-select>
                  </md-field>
                </div>

                <div class="md-layout-item md-size-100 text-left">
                  <md-button
                    type="submit"
                    class="md-raised md-success"
                    style="padding:0 10px 0 10px; margin-right:100px "
                  >
                    <i
                      class="far fa-check-circle fa-sm"
                      aria-hidden="true"
                      style="margin-right:10px"
                    ></i>
                    <span style="margin-left:1vh">Submit details</span>
                  </md-button>

                  <router-link to="/doctors" tag="md-button" class="md-info">
                    <i
                      class="far fa-arrow-alt-circle-left fa-sm"
                      aria-hidden="true"
                      style="margin-right:10px"
                    ></i>
                    <span style="margin-left:1vh">All doctors</span>
                  </router-link>
                </div>
              </div>
            </form>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/components/firebaseInit";

export default {
  name: "update doctor",
  data() {
    return {
      doctor: {}
    };
  },

  created() {
    const ref = db.collection("doctors").doc(this.$route.params.doctor_id);
    ref.get().then(doc => {
      if (doc.exists) {
        this.doctor = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },

  watch: {
    $route: "fetchData"
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      const updateRef = db
        .collection("doctors")
        .doc(this.$route.params.doctor_id);
      updateRef
        .set(this.doctor)
        .then(docRef => {
          this.doctor.firstName = "";
          this.doctor.lastName = "";
          this.doctor.email = "";
          this.doctor.phone = "";
          this.doctor.residence = "";
          this.doctor.speciality = "";

          this.$router.push("/doctors");
        })
        .catch(error => {
          alert("Error adding document: ", error);
        });
    } //end on submit
  }
};
</script>