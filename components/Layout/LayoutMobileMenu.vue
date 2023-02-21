<template>
  <div class="tw-relative">
    <div
      v-if="!firstRender"
      class="tw-fixed tw-top-0 tw-left-0 tw-h-[550px] tw-w-screen tw-mt-4 tw-z-0 tw-bg-white tw-animate__animated"
      :class="{
        animate__fadeInLeft: expandedMenu,
        animate__fadeOutRight: !expandedMenu && !firstRender,
      }"
    >
      <ul>
        <li class="tw-text-xl linkStyle">
          <NuxtLink to="/" @click="displayMobileMenu"> Home </NuxtLink>
        </li>
        <li class="tw-text-xl linkStyle">
          <NuxtLink to="/products" @click="displayMobileMenu">
            Products
          </NuxtLink>
        </li>
        <li class="tw-text-xl linkStyle">
          <NuxtLink to="/categories" @click="displayMobileMenu">
            Categories
          </NuxtLink>
        </li>
        <li class="tw-text-xl linkStyle">
          <NuxtLink to="/search" @click="displayMobileMenu"> Search </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="tw-w-5/12 lg:tw-hidden" />
    <div class="tw-flex tw-flex-row tw-w-2/12 tw-px-2 tw-my-2 lg:tw-hidden">
      <div class="tw-self-center tw-block tw-w-full tw-mr-4">
        <button
          id="nav-toggle"
          class="tw-mt-2 burger burger-squeeze"
          aria-haspopup="true"
          :aria-expanded="expandedMenu"
          aria-controls="menu"
          aria-label="Navigation"
          :class="{ open: expandedMenu }"
          @click="displayMobileMenu"
        >
          <div class="burger-lines" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const expandedMenu = useState("expandedMenu", () => false);
const firstRender = useState("firstRender", () => true);

const displayMobileMenu = () => {
  expandedMenu.value = !expandedMenu.value;
  firstRender.value = false;
};
</script>

<style scoped>
/* Style for mobile menu links */
.linkStyle {
  @apply tw-w-auto tw-p-4 tw-m-4 tw-font-bold tw-text-center tw-border tw-border-gray-300 tw-border-opacity-50 tw-shadow-md tw-rounded;
}

.linkStyleCart {
  @apply tw-w-auto tw-p-4 tw-m-4 tw-font-bold tw-text-center;
}

/* Main hamburger styling */
.burger {
  height: 3em;
  width: 3em;
  position: relative;
  font-size: 14px;
  cursor: pointer;
  transition: 0.5s all;

  -webkit-tap-highlight-color: transparent;
}
.burger .burger-lines:after {
  left: 0;
  top: -1em;
}
.burger .burger-lines:before {
  left: 1em;
  top: 1em;
}
.burger:after {
  content: "";
  display: block;
  position: absolute;
  height: 150%;
  width: 150%;
  top: -25%;
  left: -25%;
}
.burger .burger-lines {
  top: 50%;
  margin-top: -0.125em;
}
.burger .burger-lines,
.burger .burger-lines:after,
.burger .burger-lines:before {
  pointer-events: none;
  display: block;
  content: "";
  width: 100%;
  border-radius: 0.25em;
  background-color: #fff;
  height: 0.25em;
  position: absolute;
  transform: rotate(0);
}

/* Burger animations classes */
.burger.burger-squeeze .burger-lines,
.burger.burger-squeeze .burger-lines:after,
.burger.burger-squeeze .burger-lines:before {
  transition: 0.2s top 0.2s, 0.1s left, 0.2s transform,
    0.4s background-color 0.2s;
}
.burger.burger-squeeze .burger-lines:after,
.burger.burger-squeeze .burger-lines:before {
  width: 2em;
}
.burger.burger-squeeze.open .burger-lines,
.burger.burger-squeeze.open .burger-lines:after,
.burger.burger-squeeze.open .burger-lines:before {
  transition: 0.2s background-color, 0.2s top, 0.2s left, 0.2s transform 0.15s;
}
.burger.burger-squeeze.open .burger-lines {
  background-color: transparent;
}
.burger.burger-squeeze.open .burger-lines:before,
.burger.burger-squeeze.open .burger-lines:after {
  left: 0.5em;
  top: 0px;
}
.burger.burger-squeeze.open .burger-lines:before {
  transform: rotate(-45deg);
}
.burger.burger-squeeze.open .burger-lines:after {
  transform: rotate(45deg);
}
</style>
