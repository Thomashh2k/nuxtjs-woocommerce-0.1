<template>
  <main>
    <h1>Page not found</h1>
    <ul role="list">
      There was an error locating the page
    </ul>
    {{ $attrs.error.message }}
    <div v-html="$attrs.error.stack"></div>
</main>
</template>
