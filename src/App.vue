<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <el-scrollbar view-style="height: 100%;">
                    <el-menu :router="true" :default-active="$route.path">
                        <el-menu-item index="/">
                            <el-icon>
                                <HomeFilled />
                            </el-icon>
                            <span slot="title">主页</span>
                        </el-menu-item>
                        <el-menu-item index="/image">
                            <el-icon>
                                <PictureFilled />
                            </el-icon>
                            <span slot="title">图片</span>
                        </el-menu-item>
                        <el-menu-item index="/config">
                            <el-icon>
                                <Tools />
                            </el-icon>
                            <span slot="title">设置</span>
                        </el-menu-item>
                        <el-menu-item index="/about">
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                            <span slot="title">关于</span>
                        </el-menu-item>
                    </el-menu>
                </el-scrollbar>
            </el-aside>
            <el-main>
                <el-scrollbar>
                    <router-view></router-view>
                </el-scrollbar>
            </el-main>
        </el-container>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { HomeFilled, PictureFilled, InfoFilled, Tools } from '@element-plus/icons-vue'
</script>

<style lang="scss">
.common-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.el-aside {
    // background: #ccc;
    // border-right: 1px solid #ebeef5;
    width: 10rem;
}

.el-menu {
    height: 100%;
}

.el-menu-item {
    font-size: 1.1rem;
}

.el-menu-item.is-active {
    background: #333;
    color: #fff;
}
</style>