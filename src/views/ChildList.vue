<!-- ********** 카드 타입 ********** -->
<!-- <template>
  <div>
    <child-more-info ref="childMoreInfo"></child-more-info>
    <v-data-iterator
      :items="childrenList"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="primary" class="_custom-toolbar mb-4">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="ri-search-line"
            label="검색어를 입력하세요."
          ></v-text-field>
          <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            item-text="name"
            item-value="key"
            prepend-inner-icon="ri-sort-desc"
            label="정렬"
            class="ml-2"
          >
          </v-select>
          <v-btn
            v-if="!sortDesc"
            fab
            depressed
            small
            color="primary"
            @click="sortDesc = true"
          >
            <v-icon>ri-arrow-up-fill</v-icon>
          </v-btn>
          <v-btn
            v-else
            fab
            depressed
            small
            color="primary"
            @click="sortDesc = false"
          >
            <v-icon>ri-arrow-down-fill</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="(item, index) in props.items"
            :key="index"
            cols="12"
            md="6"
          >
            <v-card class="pa-2 rounded-xl">
              <v-card-title class="font-weight-bold justify-space-between">
                {{ item.name }}
                <v-btn
                  small
                  depressed
                  color="plus"
                  @click="openInfoDialog(item)"
                  >더보기<v-icon right>ri-add-circle-fill</v-icon></v-btn
                >
              </v-card-title>

              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(itemKey, index) in filteredKeys"
                    :key="index"
                    class="text-body-1 pa-0 _list-item"
                  >
                    <v-icon small color="primary">ri-check-line</v-icon>
                    <v-list-item-content
                      :class="{ 'blue--text': sortBy === itemKey.key }"
                      class="_list-item-name"
                    >
                      {{ itemKey.name }}
                    </v-list-item-content>
                    <v-list-item-content
                      :class="{ 'blue--text': sortBy === itemKey.key }"
                      class="_list-item-key"
                    >
                      <span>{{ item[itemKey.key] }}</span>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="justify-space-between">
          <v-col>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text outlined v-bind="attrs" v-on="on">
                  목록 더보기
                  {{ itemsPerPage }}
                  <v-icon>ri-arrow-down-s-fill</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col class="d-flex align-center justify-end">
            <div>
              <v-btn fab small depressed @click="formerPage">
                <v-icon>ri-arrow-left-s-line</v-icon>
              </v-btn>
              <span class="grey--text mx-4">
                {{ page }} / {{ numberOfPages }}
              </span>
              <v-btn fab small depressed @click="nextPage">
                <v-icon>ri-arrow-right-s-line</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template> -->

<!-- ********** 테이블 타입 ********** -->
<template>
  <div>
    <child-more-info ref="childMoreInfo"></child-more-info>
    <v-data-table
      :items="childrenList"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :headers="headers"
      :group-by="groupBy"
      :dense="true"
      show-select
      item-key="id"
      no-data-text="등록된 원아가 존재하지 않습니다."
      class="elevation-1 mt-0 _mobile-table"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar dark color="primary" class="_custom-toolbar mb-4">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="ri-search-line"
            label="검색어를 입력하세요."
          ></v-text-field>
          <v-select
            v-model="groupBy"
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="ri-sort-desc"
            :items="[
              { name: '반명', value: 'className' },
              { name: '재원여부', value: 'status' },
            ]"
            item-text="name"
            item-value="value"
            label="집합 정렬할 기준을 선택해주세요."
          >
          </v-select>
        </v-toolbar>
      </template>
      <!-- 클릭 시 노출 된 로우 전체클릭되게 -->
      <template v-slot:header.data-table-select="{ on, props }">
        <v-simple-checkbox
          color="purple"
          v-bind="props"
          v-on="on"
        ></v-simple-checkbox>
      </template>

      <template v-slot:item.data-table-select="{ item }">
        <v-checkbox
          color="accent"
          v-model="selectedRow"
          :value="item.id"
          hide-details
        ></v-checkbox>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="openInfoDialog(item)">
          <v-icon>ri-more-2-line</v-icon>
        </v-btn>
      </template>

      <template v-slot:body.append="{ headers, items }">
        <tr>
          <td :colspan="headers.length">
            {{ `총 ${items.length}건의 원아가 검색되었습니다.` }}
          </td>
        </tr>
      </template>
      <template v-slot:footer>
        <v-row style="padding: 5px">
          <v-col>
            <v-btn type="button" class="font-weight-bold" color="accent"
              >반 변경</v-btn
            >
          </v-col>
          <v-col class="d-flex align-center justify-end">
            <v-menu style="margin-right: 10px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text outlined v-bind="attrs" v-on="on">
                  {{ itemsPerPage == -1 ? '모두' : itemsPerPage + '명씩 보기' }}
                  <v-icon>ri-arrow-down-s-fill</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{
                    number == -1 ? '모두' : number
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <div>
              <v-btn fab small depressed @click="formerPage">
                <v-icon>ri-arrow-left-s-line</v-icon>
              </v-btn>
              <span class="grey--text mx-4">
                {{ page }} / {{ numberOfPages }}
              </span>
              <v-btn fab small depressed @click="nextPage">
                <v-icon>ri-arrow-right-s-line</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { getAllChildren } from '@/api/api'
import ChildMoreInfo from '@/views/ChildMoreInfo.vue'
export default {
  name: 'ChildrenList',
  mounted() {
    this.getAllChildren()
  },
  data() {
    return {
      childrenList: [],
      itemsPerPageArray: [20, 30, 40, 50, -1],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: -1,
      sortBy: 'name',
      groupBy: null,
      selectedRow: [],
      //sortByList: ['이름', '입학일', '반명', '주소', '생일', '재원여부'], 리스트를 테이블로 변경(headers)
      headers: [
        { text: '이름', value: 'name' },
        { text: '입학일', value: 'admissionDate' },
        { text: '반명', value: 'className' },
        { text: '주소', value: 'addressName' },
        { text: '생일', value: 'birthday' },
        { text: '재원여부', value: 'status' },
        { text: '보호자', value: 'parents' },
        { text: '작업', value: 'actions', sortable: false },
      ],
      keys: [
        { key: 'name', name: '이름' },
        { key: 'admissionDate', name: '입학일' },
        { key: 'className', name: '반명' },
        { key: 'addressName', name: '주소' },
        { key: 'birthday', name: '생일' },
        { key: 'status', name: '재원여부' },
        { key: 'parents', name: '보호자' },
      ],
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(
        this.childrenList.length /
          (this.itemsPerPage == -1
            ? this.childrenList.length
            : this.itemsPerPage)
      )
    },
  },
  methods: {
    showSelectedRow() {
      console.log(this.selectedRow)
    },
    getAllChildren() {
      this.$withLoading(
        getAllChildren()
          .then((response) => {
            if (response.code == '0') {
              response.data.forEach((element) => {
                let parentNameList = ''
                element.parentList.forEach((parent) => {
                  parentNameList += parent.name + ' '
                })
                element.parents = parentNameList
                element.actions = null
                element.addressName = `${element.address.address} ${element.address.detailAddress}`
                // element.status = element.status ? '재원' : '졸업 or 퇴원'
              })
              this.childrenList = response.data
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
    },
    async openInfoDialog(info) {
      let amChildRideList = []
      let pmChildRideList = []
      if (info.childRideList != null)
        info.childRideList.forEach((childRide) => {
          if (childRide.meetingLocation.sunnyRide.am)
            amChildRideList.push(childRide)
          else pmChildRideList.push(childRide)
        })
      const result = await this.$dialog(ChildMoreInfo, {
        id: info.id,
        admissionDate: info.admissionDate,
        className: info.className,
        address: info.address,
        birthday: info.birthday,
        parentList: info.parentList,
        status: info.status,
        amChildRideList: amChildRideList,
        pmChildRideList: pmChildRideList,
        name: info.name,
      })
      // 삭제 성공 시
      if (result) {
        this.$showMessage({
          type: 'success',
          message: '성공적으로 삭제했습니다.',
        })
        let index = this.childrenList.findIndex((item) => item.id === info.id)
        if (index !== 1) {
          this.$delete(this.childrenList, index)
        }
      } else {
        this.getAllChildren()
      }
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
  },
}
</script>

<style scoped>
._custom-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  height: unset;
}
._custom-toolbar >>> .v-select {
  width: min-content;
}
._list-item {
  gap: 0 10px;
}
._list-item >>> .v-list-item__content {
  flex: unset;
}
._list-item-name {
  min-width: 80px;
  margin: 0;
}
._list-item-key {
  opacity: 0.65;
}
</style>
