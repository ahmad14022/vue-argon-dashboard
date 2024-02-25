<script>
import { useListStore } from "@/store/todo";
import { mapState, mapActions } from "pinia";
// Impor komponen base-input di sini
import BaseInput from "../components/BaseInput.vue";
import BaseTable from "../components/BaseTable.vue";

const initialInput = {
  title: "",
  description: "",
  category: "",
  completed: false,
};

export default {
  name: "ListView",
  components: {
    // Daftarkan komponen base-input di sini
    BaseInput,
    BaseTable,
  },
  data: () => ({
    input: { ...initialInput },
    editing: false,
    // UI
    table: {
      columns: ["no", "title", "description", "category", "action"],
      actions: [
        {
          title: "Handle",
          event: "handle-event",
        },
        {
          title: "Edit",
          event: "edit-event",
        },
        {
          title: "Remove",
          event: "remove-event",
        },
      ],
    },
  }),

  computed: {
    // import all defined getters via mapState helper
    ...mapState(useListStore, ["getList", "getDetail"]),
  },
  async mounted() {
    await this.a$list();
  },
  methods: {
    // import all defined action via mapActions helper
    ...mapActions(useListStore, [
      "a$list",
      "a$add",
      "editIndex",
      "removeIndex",
    ]),
    // reset form
    resetForm() {
      // Reset Input with initial value
      Object.assign(this.input, initialInput);

      // reset editing state
      this.editing = false;
    },
    // submit form
    addForm(event) {
      console.log(event);

      // pass input to action
      // determine
      if (this.editing === false) {
        this.a$add({ ...this.input });
        console.log({ ...this.input });
      } else {
        this.editIndex(this.editing, { ...this.input });
      }

      // call reset form
      this.resetForm();
    },
    detailList(index) {
      // set editing to true from index params
      this.editing = index;
      // set input value from getters by index params
      this.input = { ...this.getDetail(index) };
    },
    // toggle completed
    toggleCompleted(index) {
      const detail = this.getDetail(index);
      this.editIndex(index, {
        // pass all entries in detail object
        ...detail,
        // take completed value then toggle it
        completed: !detail.completed,
      });
    },

    // handle event
    handleLogEvent(row) {
      console.log(row);
    },
    // handle edit
    handleEdit(index) {
      this.detailList(index);
    },
    // handle remove
    handleRemove(index) {
      if (confirm("Are you sure you want to delete this task?")) {
        this.removeIndex(index);
      }
    },
  },
};
</script>

<template>
  <div class="text-center mb-4">
    <h2 class="text-white">Create Your ToDo List</h2>
  </div>
  <div class="card">
    <div class="d-flex justify-between card-header pb-0">
      <h6>Authors table</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2 d-flex flex-column">
      <form
        class="card-header"
        @submit.prevent="($event) => addForm($event)"
        method="post"
        @reset="() => resetForm()"
      >
        <!-- use component using kebab-case -->
        <base-input
          v-model="input.title"
          name="Title"
          class="input"
          placeholder="add new"
          required
        ></base-input>
        <br />

        <!-- can be used many times -->
        <base-input
          v-model="input.description"
          name="Description"
          class="card"
          placeholder="description"
          required
        ></base-input>
        <br />

        <!-- can be used many times -->
        <base-input
          v-model="input.category"
          name="Category"
          class="input"
          placeholder="category"
          required
        ></base-input>
        <br />

        <input class="completed" v-model="input.completed" type="checkbox" />
        Completed
        <br />

        <div class="button-action">
          <button type="reset" class="button-cancel">Cancel</button>
          <button type="submit" class="button-submit">
            {{ editing !== false ? "Edit" : "Add" }}
          </button>
        </div>
      </form>

      <div class="table-responsive p-0">
        <base-table
          class="table"
          :data="getList"
          :columns="table.columns"
          :actions="table.actions"
          @handle-event="handleLogEvent"
          @edit-event="handleEdit"
          @remove-event="handleRemove"
        />
        <!-- <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary font-weight-bolder opacity-7"
              >
                No.
              </th>
              <th
                class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2"
              >
                Name
              </th>
              <th
                class="text-center text-uppercase text-secondary font-weight-bolder opacity-7"
              >
                Activity
              </th>
              <th
                class="text-center text-uppercase text-secondary font-weight-bolder opacity-7"
              >
                Actions
              </th>
              <th
                class="text-center text-uppercase text-secondary font-weight-bolder opacity-7"
              >
                Toggle
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-weight-bold mb-0">
                <p class="font-weight-bold mb-0">Eat</p>
              </td>
              <td>
                <p class="font-weight-bold mb-0">Manager</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">Online</span>
              </td>
              <td class="align-middle">
                <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                  >Edit</a
                >
              </td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </div>
  </div>

  <!-- <modal-comp v-model:show="modal.addToDoList">
    <template>
      <h3 class="modal-title">Tambah Baru</h3>
    </template>
  </modal-comp> -->
</template>

<style scoped lang="scss">
.completed {
  margin-bottom: 1rem;
}
.button-action {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 1rem;
  .button-submit {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.3rem;
    cursor: pointer;
    background: #2dce89;
    border: none;
    outline: none;
    color: #fff;
    font-weight: 500;
    transition: transform 0.2s ease;
  }

  .button-submit:hover {
    font-weight: bold;
    transform: translateY(-5px);
  }

  .button-cancel {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.3rem;
    cursor: pointer;
    background: #cccccc;
    border: none;
    outline: none;
    color: #fff;
    font-weight: 500;
    transition: transform 0.2s ease;
  }

  .button-cancel:hover {
    transform: translateY(-5px);
    font-weight: bold;
  }
}
</style>
