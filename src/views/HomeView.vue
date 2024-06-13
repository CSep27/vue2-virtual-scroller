<template>
  <div class="home">
    <VirtualScrollDynamic
      :estimatedItemSize="100"
      :estimatedTotal="1000"
    ></VirtualScrollDynamic>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
