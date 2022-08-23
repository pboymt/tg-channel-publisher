<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <router-link to="/">Home</router-link>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
</script>

<style lang="scss">
.common-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.el-aside {
    background: #ccc;
    border-right: 1px solid #ebeef5;
    width: 20rem;
}
</style>