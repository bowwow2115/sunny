<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <!-- <th
            class="text-left"
            v-for="(value, key) in childrenList[0]"
            :key="key"
          >
            {{ key }}
          </th> -->
          <th class="text-left">이름</th>
          <th class="text-left">원아코드</th>
          <th class="text-left">입학일</th>
          <th class="text-left">반</th>
          <th class="text-left">주소</th>
          <th class="text-left">생일</th>
          <th class="text-left">상태</th>
          <th class="text-left">오전차량</th>
          <th class="text-left">오후차량</th>
          <th class="text-left">부모정보보기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in childrenList" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.childCode }}</td>
          <td>{{ item.admissionDate }}</td>
          <td>{{ item.className }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.birthday }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.amRide }}</td>
          <td>{{ item.pmRide }}</td>
          <td>{{ item.parentList }}</td>
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
