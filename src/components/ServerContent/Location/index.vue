<template>
  <Card tag="li">
    <location-content></location-content>
  </Card>
</template>

<script>
import LocationContent from './Content'
export default {
  name: 'LocationCard',
  components: {
    LocationContent
  }
}
</script>
