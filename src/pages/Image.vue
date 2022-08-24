<script setup lang="ts">
import { ref, computed, ComputedRef } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElImageViewer, UploadFile, UploadInstance } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus';

const imageList = ref<UploadUserFile[]>([]);
const uploadRef = ref<UploadInstance>();
const imagePreviewList: ComputedRef<string[]> = computed(() => {
    console.log(uploadRef.value?.fileList);
    console.log(uploadRef.value?.UploadList)
    return imageList.value.map((file) => {
        return file.url!;
    });
});

const dialogImageIndex = ref(0)
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log(imagePreviewList)
    const index = imagePreviewList.value.findIndex(file => {
        console.log(file, uploadFile.url)
        return file === uploadFile.url;
    });
    console.log(index)
    if (index >= 0) {
        dialogImageIndex.value = index
    }
    dialogVisible.value = true
}

const uploadHttpRequest: UploadProps['httpRequest'] = async (config) => {
    const { file } = config;
    console.log(file)
}

function onUploadSuccess(response: any, file: UploadFile, fileList: UploadFile[]) {
    imageList.value.push(file);
}

function onRemove(file: UploadFile, fileList: UploadFile[]) {
    const index = imageList.value.findIndex(item => item.uid === file.uid);
    imageList.value.splice(index, 1);
}

function closeDialog() {
    dialogVisible.value = false
}
</script>

<template>
    <h1>
        图片
    </h1>
    <div>
        <el-upload ref="uploadRef" :file-list="imageList" list-type="picture-card" multiple
            accept="image/png, image/jpeg, image/webp" action="ryukyu://upload"  @success="onUploadSuccess" @remove="onRemove"
            @preview="handlePictureCardPreview">
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
    </div>
    <el-image-viewer v-if="dialogVisible" @close="closeDialog" :url-list="imagePreviewList" :initial-index="dialogImageIndex">

    </el-image-viewer>
</template>

<style lang="scss">
// .el-dialog {
//     width: 60%;
//     height: 60%;
// }
</style>