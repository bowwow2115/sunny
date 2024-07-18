<template>
  <div>
    <children-more-info ref="childrenMoreInfo"></children-more-info>
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
        <v-toolbar dark color="primary" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="이름을 입력하세요"
          ></v-text-field>
          <template>
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              item-text="name"
              item-value="key"
              prepend-inner-icon="mdi-sort"
              label="정렬"
            >
            </v-select>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!sortDesc"
              small
              depressed
              light
              color="primary"
              @click="sortDesc = true"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn
              v-else
              small
              depressed
              color="primary"
              @click="sortDesc = false"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="(item, index) in props.items"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
                <v-spacer></v-spacer>
                <v-btn small color="plus" @click="openInfoDialog(item)"
                  ><v-icon left>mdi-plus</v-icon>더보기</v-btn
                >
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item
                  v-for="(itemKey, index) in filteredKeys"
                  :key="index"
                >
                  <v-list-item-content
                    :class="{ 'blue--text': sortBy === itemKey.key }"
                  >
                    {{ itemKey.name }}:
                  </v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === itemKey.key }"
                  >
                    {{ item[itemKey.key] }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
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

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-row>
            <v-btn
              fab
              small
              dark
              color="primary"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              small
              dark
              color="primary"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import { getChildren } from '@/api/api'
import ChildrenMoreInfo from '@/components/dialog/ChildrenMoreInfo.vue'
export default {
  components: { ChildrenMoreInfo },
  name: 'ChildrenList',
  mounted() {
    this.getChildren()
  },
  data() {
    return {
      childrenList: [],
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
      sortByList: [
        '이름',
        '원아코드',
        '입학일',
        '반명',
        '주소',
        '생일',
        '재원여부',
      ],
      keys: [
        // 'name',
        // 'childCode',
        // 'admissionDate',
        // 'className',
        // 'address',
        // 'birthday',
        // 'status',
        { key: 'name', name: '이름' },
        { key: 'childCode', name: '원아코드' },
        { key: 'admissionDate', name: '입학일' },
        { key: 'className', name: '반명' },
        { key: 'address', name: '주소' },
        { key: 'birthday', name: '생일' },
        { key: 'status', name: '재원여부' },
      ],
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.childrenList.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.keys.filter((item) => item.key !== 'name')
    },
    sortByNameList() {
      return this.keys.map((item) => item.name)
    },
  },
  methods: {
    getChildren() {
      this.$withLoading(
        getChildren()
          .then((response) => {
            if (response.code == '0') {
              response.data.forEach((element) => {
                element.address = `${element.address.address} ${element.address.detailAddress}`
                element.status = element.status ? '재원' : '졸업 or 퇴원'
              })
              this.childrenList = response.data
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
    },
    openInfoDialog(info) {
      this.$refs.childrenMoreInfo.showInfo({
        id: info.id,
        childCode: info.childCode,
        admissionDate: info.admissionDate,
        className: info.className,
        address: info.address,
        birthday: info.birthday,
        parentList: info.parentList,
        status: info.status,
        amRide: info.amRide,
        pmRide: info.pmRide,
        name: info.name,
      })
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
    keyToName(key) {
      switch (key) {
        case 'name':
          return '이름'
        case 'childCode':
          return '원아코드'
        case 'admissionDate':
          return '입학일'
        case 'className':
          return '반명'
        case 'address':
          return '주소'
        case 'birthday':
          return '생일'
        case 'status':
          return '재원여부'
      }
    },
  },
}
</script>

<style></style>
