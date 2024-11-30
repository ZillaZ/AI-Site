<script>
  let props = $props();
  let width = $state(props.width);
  let height = $state(props.height);
  let fill = props.fill;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  shape-rendering="geometricPrecision"
  text-rendering="geometricPrecision"
  image-rendering="optimizeQuality"
  fill-rule="evenodd"
  clip-rule="evenodd"
  viewBox="0 0 512 462.799"
  width="{width}%"
  height="{height}%"
  ><path
    fill={fill}
    d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
  /></svg
>

<style>
  svg:hover {
      width: 60%;
      height: 60%;
  }
</style>
