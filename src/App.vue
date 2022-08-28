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
                        <el-menu-item index="/post">
                            <el-icon>
                                <PictureFilled />
                            </el-icon>
                            <span slot="title">消息</span>
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
            <el-container class="content-layout">
                <router-view></router-view>
            </el-container>
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
    overflow: hidden;
}


// .content-layout {
//     overflow: auto;
//     max-height: 100vh;
// }

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