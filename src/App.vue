<template>
  <v-app>
    <!-- ✅ 라우팅 뷰 (key 추가로 라우트 변경 시 강제 업데이트) -->
    <router-view :key="route.path" />

    <v-overlay
      v-model="loadingOverlay"
      contained
      persistent
      class="align-center justify-center"
      scrim="rgba(0, 0, 0, 0.48)"
      z-index="2000"
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
        width="4"
      ></v-progress-circular>
    </v-overlay>

    <!-- ✅ 전역 알림 (GlobalAlert) -->
    <GlobalAlert ref="alertRef" />

    <!-- ✅ 전역 스낵바 (GlobalSnackbar) -->
    <GlobalSnackbar ref="snackbarRef" />

    <!-- ✅ 전역 컨펌 (GlobalConfirmSheet) -->
    <GlobalConfirmSheet ref="confirmRef" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store'
import GlobalAlert from '@/components/GlobalAlert.vue'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
import GlobalConfirmSheet from '@/components/GlobalConfirmSheet.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const loadingOverlay = computed<boolean>({
  get: () => store.state.isLoading,
  set: (value: boolean) => store.commit('SET_LOADING', value),
})

const alertRef = ref<InstanceType<typeof GlobalAlert> | null>(null)
const snackbarRef = ref<InstanceType<typeof GlobalSnackbar> | null>(null)
const confirmRef = ref<InstanceType<typeof GlobalConfirmSheet> | null>(null)

provide('alertRef', alertRef)
provide('snackbarRef', snackbarRef)
provide('confirmRef', confirmRef)

router.afterEach(() => {
  if (store.state.isLoading) {
    store.commit('SET_LOADING', false)
  }
})

watch(
  () => store.state.isLoading,
  (newVal) => {
    console.log('Loading state changed:', newVal)
  }
)
</script>

<style lang="scss">
/* ✅ 전역 스타일: 리셋 + 변수 + 컴포넌트 */
@import './assets/styles/sass/style.scss';

/* ========== Vuetify 3 글로벌 오버라이드 ========== */
/* 로딩 오버레이 중앙 정렬 */
.v-overlay--active .v-overlay__content {
  align-items: center !important;
  justify-content: center !important;
}

/* 프로그레스 서클 색상 */
.v-progress-circular {
  --v-progress-circular-color: var(--v-primary-base);
}

/* ========== 커스텀 유틸리티 클래스 ========== */
.deleteButton {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--v-error-base, #f3003f);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--v-error-darken-1, #c40033);
  }

  &:active {
    transform: translateX(-50%) scale(0.98);
  }
}

/* ========== 반응형 유틸리티 ========== */
.flex-wrap {
  flex-wrap: wrap;
}
.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}

/* ========== 모바일 최적화 ========== */
@media (max-width: 600px) {
  .v-app-bar__content {
    padding: 0 8px;
  }

  .v-btn--size-default {
    min-width: 36px;
  }
}

/* ========== 인쇄 스타일 ========== */
@media print {
  .no-print,
  .v-overlay,
  .v-app-bar,
  .v-navigation-drawer {
    display: none !important;
  }

  body {
    background: #fff !important;
  }
}
</style>
