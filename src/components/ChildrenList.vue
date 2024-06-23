<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th
            class="text-left"
            v-for="(value, key) in childrenList[0]"
            :key="key"
          >
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in childrenList" :key="item.id">
          <td v-for="(value, key) in item" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { getChildren } from '@/api/api'
export default {
  name: 'ChildrenList.vue',
  mounted() {
    this.getChildren()
  },
  data() {
    return {
      childrenList: [],
    }
  },
  methods: {
    getChildren() {
      getChildren()
        .then((response) => {
          if (response.code == '0') {
            this.childrenList = response.data
          }
        })
        .catch((e) => {})
    },
  },
}
</script>

<style></style>
