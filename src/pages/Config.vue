<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { ref, reactive } from 'vue';

export interface Config {
    token: string;
    proxy: string;
    channel: string;
}

const initValue = localStorage.getItem('config') ?? '{}';
const initConfig: Partial<Config> = JSON.parse(initValue);

const config = reactive<Config>({
    token: initConfig.token ?? '',
    proxy: initConfig.proxy ?? '',
    channel: initConfig.channel ?? '',
});

function save() {
    localStorage.setItem('config', JSON.stringify(config));
}

async function start() {
    await ipcRenderer.invoke('start-bot', config.token, config.proxy);
}
</script>

<template>
    <el-container style="overflow-y: auto; max-height: 100vh;">
        <el-header>
            <el-row>
                <!-- <el-col :span="24"> -->
                <h1>设置</h1>
                <!-- </el-col> -->
            </el-row>
        </el-header>
        <el-main>
            <el-form label-width="100px" size="default" style="max-width: 450px;">
                <el-form-item label="令牌">
                    <el-input v-model="config.token" />
                </el-form-item>
                <el-form-item label="代理">
                    <el-input v-model="config.proxy" />
                </el-form-item>
                <el-form-item label="频道">
                    <el-input v-model="config.channel" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="start">启动</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>