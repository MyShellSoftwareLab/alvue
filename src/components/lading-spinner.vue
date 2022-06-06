<template>
    <div class="__alv-spinner">
    </div>
</template>

<script>
export default {
    name: "lading-spinner"
}
</script>

<style scoped>
.__alv-spinner {
    margin: 0 0 0.207rem;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: text-bottom;
    border: 1.5px solid white;
    background: transparent;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

}

@keyframes spin {
    0% {
        background: transparent;
        transform: rotate(-360deg);
    }

}

</style>
