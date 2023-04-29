<template>
    
        <div class="main">
            <button class="item">
                <div class="itemtext">Summary</div>
            </button>
            <button class="item">
                Premium
            </button>
            <button class="item">
                Names
            </button>
        </div>
    
</template>

<style scoped>
.main {
    display: flex;
    flex-direction: row;
}

.item {
    border: 1px solid white;
    background-color: #444444;
    padding: 10px;
    flex-grow: 1;
    align-items: center;
    cursor: pointer;
}

.itemtext {
    text-align: center;
}
</style>
