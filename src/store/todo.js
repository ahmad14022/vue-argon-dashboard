import { defineStore } from 'pinia'

import * as s$todo from '@/service/todo'

export const useListStore = defineStore({
  id: 'list',
  // state is same as data in options api
  state: () => ({
    list: [
      {
        id: 1,
        title: 'Default Task 1',
        description: 'Description of Default Task 1',
        category: 'Default Category',
        completed: true
      },
      {
        id: 2,
        title: 'Default Task 2',
        description: 'Description of Default Task 2',
        category: 'Default Category',
        completed: false
      }
    ]
  }),
  actions: {
    async a$list() {
      try {
        // object destructure
        const { data } = await s$todo.list()
        this.list = data
      } catch ({ message, error }) {
        throw message ?? error
      }
    },
    async a$add(data) {
      try {
        await s$todo.add(data)
        await this.a$list()
      } catch ({ message, error }) {
        throw message ?? error
      }
    },
    removeIndex(index) {
      this.list = this.list.filter((val, idx) => index !== idx)
    },
    editIndex(index, data) {
      this.list[index] = data
    }
  },
  getters: {
    getList: (state) => state.list,
    getDetail: ({ list }) => {
      return (index) => list[index]
    }
  }
})