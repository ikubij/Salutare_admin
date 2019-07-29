<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Add a new doctor</h4>
          </md-card-header>
          <md-card-content>
            <form @submit.prevent="saveDoctor" class="col s12">
               <p v-if="errors.length">
                  <b>Please correct the following <strong style="color:red">error(s)</strong></b>
                  <ul>
                    <li :key="index" v-for="(error,index) in errors" >{{ error }}</li>
                  </ul>
                </p>
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-field>
                    <label>First Name</label>
                    <md-input v-model="firstName" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-field>
                    <label>Last Name</label>
                    <md-input v-model="lastName" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label>email Address</label>
                    <md-input v-model="email" type="email"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label>Phone Number</label>
                    <md-input v-model="phone" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-33">
                  <md-field>
                    <label for="speciality">Speciality</label>
                    <md-select v-model="speciality" name="speciality" id="speciality">
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
                    <md-select v-model="residence" name="residence" id="residence">
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
                    style="padding:0 10px 0 10px; margin-right:5vh"
                  >
                    <i
                      class="far fa-check-circle fa-sm"
                      aria-hidden="true"
                      style="margin-right:10px"
                    ></i>
                    <span style="margin-left:1vh">Submit details</span>
                  </md-button>

                  <md-button
                    type="reset"
                    class="md-raised md-warning"
                    style="padding:0 10px 0 10px;"
                  >
                    <i class="fas fa-redo fa-sm" aria-hidden="true" style="margin-right:10px"></i>
                    <span style="margin-left:1vh">Reset Form</span>
                  </md-button>
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
// Initialize the firebase admin API for doctor account creation
import * as admin from "firebase-admin";
//var admin = require("firebase-admin");
var serviceAccount = require("@/components/salutem-health-admin.json");
admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://salutem-health.firebaseio.com"
});

// const serviceAccount = require('@/components/salutem-health-admin.json');
// admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
// });

export default {
  name: "NewDoctor",
  data() {
    return {
      errors: [],
      firstName: null,
      lastName: null,
      residence: null,
      speciality: null,
      phone: null,
      email: null
    };
  },
  methods: {
     checkForm: function (e) {
      if (this.firstName && this.lastName && this.phone && this.email && this.residence && this.speciality) {
        return true;
      }

      this.errors = [];

      if (!this.firstName) {
        this.errors.push('First Name required.');
      }
      if (!this.lastName) {
        this.errors.push('Last Name required.');
      }
      if (!this.phone) {
        this.errors.push('Phone Number required.');
      } else if (!this.validPhone(this.phone)) {
        this.errors.push('Valid Phone Number required.');
      }
       if (!this.email) {
        this.errors.push('Email required.');
      }
      if (!this.residence) {
        this.errors.push('Residence required.');
      }
      if (!this.speciality) {
        this.errors.push('Speciality required.');
      }

      e.preventDefault();
    }, //end check form
    validPhone: function (phone) {
      var re = /^(\+254|0)[1-9]\d{8}$/;
      return re.test(phone);
    },//end validate phone
    saveDoctor() {
      this.checkForm(); //first validate the form
      db.collection("doctors")
        .add({
          firstName: this.firstName,
          lastName: this.lastName,
          residence: this.residence,
          speciality: this.speciality,
          phone: this.phone,
          email: this.email
        })
        .then(docRef => {
          // console.log("Doctor added: ", docRef.id);

          admin
            .auth()
            .createUser({
              email: this.email,
              password: "abcdef",
              disabled: false
            })
            .then(function(userRecord) {
              // See the UserRecord reference doc for the contents of userRecord.
              console.log("Successfully created new user:", userRecord.uid);
            })
            .catch(function(error) {
              console.log("Error creating new user:", error);
            }); // end create user account
          this.$router.push("/doctors");
        })
        .catch(error => {
          console.error("Error adding doctor: ", error);
        }); // end submit to collection doctors
    } //end save doctor
  }
};
</script>