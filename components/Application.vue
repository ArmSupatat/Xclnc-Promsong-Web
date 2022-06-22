<template>
  <div class="Application py-xl-10 py-lg-10 py-md-10 py-sm-5 py-2">
    <v-container class="d-flex flex-sm-row justify-center flex-column">
      <div class="d-flex justify-center">
        <img class="img-Application" src="/images/Application.png" alt="" />
      </div>
      <div
        class="
          d-flex
          flex-column
          align-center
          justify-center
          download-component
        "
      >
        <img class="img-Logo mt-sm-0 mt-4" src="/images/Logo.png" />
        <p class="font-ApplicationDownload font-weight-bold mt-2 mt-sm-4">
          ดาวน์โหลดได้ที่
        </p>
        <a
          href="https://play.google.com/store/apps/details?id=com.xclnc.fsp"
          target="_blank"
        >
          <div
            class="
              font-ApplicationDownload
              d-flex
              flex-row
              justify-xl-space-around justify-md-space-around justify-center
              cursor-pointer
            "
          >
            <img class="img-app" src="/images/Btn-AppStore.png" />
          </div>
        </a>
      </div>
    </v-container>
  </div>
</template>
<style scoped>
@import url('~/assets/css/Application.css');
</style>
