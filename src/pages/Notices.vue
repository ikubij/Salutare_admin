<template>
  <div class="content">
    <div class="md-layout">
      <router-link
        to="/new notice"
        tag="md-button"
        class="md-info"
        style="padding:0 10px 0 10px; margin-left:80%"
      >
        <i class="fas fa-user-plus fa-sm" aria-hidden="true" style="margin-right:10px"></i>
        <span style="margin-left:1vh">Add new notice</span>
      </router-link>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <pulse-loader  :color="color"  v-show="showLoader"></pulse-loader>
        <md-card>
          <md-card-header data-background-color="blue" class="md-layout">
            <div class="md-toolbar-section-start md-layout-item">
              <h4 class="title">Salutare notices</h4>
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
              v-model="notices"
              :table-header-color="tableHeaderColor"
              md-sort="docName"
              md-sort-order="asc"
            >
              <md-table-empty-state
                md-label="No notices found "
                :md-description="`Kindly wait or try a different search term if searching.`"
              ></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Date" md-sort-by="date">{{ item.date }}</md-table-cell>
                <md-table-cell md-label="Title" md-sort-by="title">{{ item.title }}</md-table-cell>
                <md-table-cell md-label="Content" md-sort-by="content">{{ item.content }}</md-table-cell>

                <md-table-cell md-label="actions">
                 
                  <md-button
                    class="md-just-icon md-simple md-danger"
                    tag="router-link"
                    @click="deleteNotice(item)"
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
      <!--End Notice's table-->

    </div>
  </div>
</template>

<script>
import db from "@/components/firebaseInit";
import PulseLoader from "vue-spinner/src/PulseLoader.vue"; //import spinner(for loading)

const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByCriteria = (items, term) => {
  if (term) {
    return items.filter(
      item =>
        toLower(item.date).includes(toLower(term)) ||
        toLower(item.title).includes(toLower(term)) ||
        toLower(item.content).includes(toLower(term))
       
    );
  }

  return items;
};

export default {
  components: {
    PulseLoader //the imported vuejs spinner
  },
  name: "Notices",
  data() {
    return {
      showLoader: true, //activate spinner
      search: null,
      searched: [],
      notices_array: [],
    };
  },
  created() {
    // Call our async function in a try block to catch connection errors.
    try {
      this.run(); //Initiate the program
    } catch (err) {
      console.log("Error with run functon: ", err);
    }

    this.notices = this.notices_array; //Instantiate data to the v-model to be displayed
  }, //end created
  methods: {
    // In the async/await example, we need to wrap our code inside a function
    // and mark it as 'async'. This allows us to 'await' on a Promise.
    async run() {
      setTimeout(() => {
        this.fetchNoticesData();
        this.showLoader = false; //remove spinner
      }, 2000);

      // await this.forceRerender();
    }, // End function Run
    async fetchNoticesData() {
      db.collection("notices")
        .orderBy("date")
        .get()
        .then(querySnapshot => {
          this.loading = true;
          querySnapshot.forEach(doc => {

            const docData = {
              id: doc.id,
              date: doc.data().date,
              title: doc.data().title,
              content: doc.data().content
              
            };
            this.notices_array.push(docData);

          });
        });
    }, //end get notices

    async deleteNotice(item) {
      try {
        if (confirm("Are you sure?")) {
          await db
            .collection("notices")
            .doc(item.id)
            .delete();
          this.$router.go({
            name: "Notices"
          });
        }
      } catch (error) {
        this.error = error.response.data.error;
      }
    }, // end delete notice
    searchOnTable() {
      this.notices = searchByCriteria(this.notices_array, this.search);
    } //end search table
  }
};
</script>