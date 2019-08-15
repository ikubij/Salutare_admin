<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <h4 class="title">Add a new notice</h4>
          </md-card-header>
          <md-card-content>
            <form @submit.prevent="saveNotice" class="col s12">
              <div class="md-layout">
                <div class="md-layout-item md-large-size-100 md-size-50">
                  <md-field>
                    <label>Title</label>
                    <md-input v-model="title" type="text"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-large-size-100 md-size-50">
                  <md-field>
                    <label>Content</label>
                    <md-textarea v-model="content" type="text"></md-textarea>
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

export default {
  name: "NewNotice",
  data() {
    return {
      errors: [],
      title: null,
      content: null
    };
  },
  methods: {
    saveNotice() {
      db.collection("notices")
        .add({
          title: this.title,
          content: this.content,
          date : new Date().toLocaleString("en-GB")
        })

        .catch(error => {
          console.error("Error adding notice: ", error);
        }); // end submit to collection doctors
      this.$router.push("/notices");
    } //end save doctor
  }
};
</script>