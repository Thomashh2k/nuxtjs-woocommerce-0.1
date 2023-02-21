<template>
  <nav
    id="footer"
    class="tw-fixed tw-bottom-0 tw-z-50 tw-w-full md:tw-hidden lg:tw-hidden xl:tw-hidden"
  >
    <div
      class="tw-container tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-px-6 tw-py-3 tw-mx-auto tw-mt-0 md:tw-min-w-96 tw-bg-blue-800"
    >
      <LayoutMobileMenu />
      <div
        class="tw-order-3 tw-hidden tw-w-full md:tw-flex md:tw-items-center md:tw-w-auto md:tw-order-1"
        id="menu"
      ></div>
      <div class="tw-flex tw-items-center tw-order-2 md:tw-order-3" id="nav-content">
        <LayoutCart />
      </div>
    </div>
  </nav>
</template>
