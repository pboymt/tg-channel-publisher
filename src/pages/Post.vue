<script setup lang="ts">
import { ref, computed, ComputedRef, reactive, nextTick } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElImageViewer, ElInput, UploadFile, UploadInstance } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus';

interface PostForm {
    title: string;
    content: string;
    tags: string[];
    source: string;
    images: ComputedRef<string[]>;
}

const form = reactive<PostForm>({
    title: '',
    content: '',
    tags: [],
    source: '',
    images: computed(() => {
        return imageList.value.map(file => file.url!);
    }),
})

const imageList = ref<UploadUserFile[]>([]);
const uploadRef = ref<UploadInstance>();
const imagePreviewList: ComputedRef<string[]> = computed(() => {
    return imageList.value.map((file) => {
        return file.url!;
    });
});

const dialogImageIndex = ref(0)
const dialogVisible = ref(false)
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const InputRef = ref<InstanceType<typeof ElInput>>()

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
    // await fetch('ryukyu://upload', {
    //     method: 'POST',
    //     body: file.path
    // })
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

function handleTagClose(tag: string) {
    const index = form.tags.findIndex(item => item === tag);
    form.tags.splice(index, 1);
}

function showTagInput() {
    tagInputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

function handleTagInputConfirm() {
    if (tagInputValue.value) {
        form.tags.push(tagInputValue.value)
    }
    tagInputVisible.value = false
    tagInputValue.value = ''
}
</script>

<template>
    <el-container style="overflow-y: auto; max-height: 100vh;">
        <el-header>
            <el-row>
                <!-- <el-col :span="24"> -->
                <h1>消息</h1>
                <!-- </el-col> -->
            </el-row>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="15">
                    <h3>选择图片</h3>
                    <el-upload ref="uploadRef" list-type="picture-card" multiple accept="image/*"
                        @success="onUploadSuccess" @remove="onRemove" :http-request="uploadHttpRequest"
                        @preview="handlePictureCardPreview" :limit="10">
                        <!-- :http-request="uploadHttpRequest" -->
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <el-form :model="form">
                        <h3>标题</h3>
                        <el-form-item>
                            <el-input size="large" v-model="form.title" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <h3>内容</h3>
                        <el-form-item>
                            <el-input size="large" :autosize="{ minRows: 3 }" type="textarea" v-model="form.content"
                                placeholder="请输入内容">
                            </el-input>
                        </el-form-item>
                        <h3>标签</h3>
                        <div>
                            <el-tag v-for="tag in form.tags" :key="tag" class="mx-1" closable size="large"
                                style="margin: 0.25rem;" :disable-transitions="false" @close="handleTagClose(tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input v-if="tagInputVisible" ref="InputRef" v-model="tagInputValue" class="ml-1 w-1"
                                size="default" style="margin: 0.25rem;" @keyup.enter="handleTagInputConfirm"
                                @blur="handleTagInputConfirm" />
                            <el-button v-else class="button-new-tag ml-1" size="default" @click="showTagInput"
                                style="margin: 0.25rem;">
                                + 标签
                            </el-button>
                        </div>
                        <h3>来源</h3>
                        <el-form-item>
                            <el-input size="large" v-model="form.source" placeholder="请输入来源"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="9">
                    <h3>预览</h3>
                    <el-space fill :fill-ratio="80" alignment="center" direction="vertical">
                        <el-card>
                            {{ form }}
                        </el-card>
                    </el-space>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
    <el-image-viewer v-if="dialogVisible" @close="closeDialog" :url-list="imagePreviewList"
        :initial-index="dialogImageIndex">

    </el-image-viewer>
</template>

<style lang="scss">
// .el-dialog {
//     width: 60%;
//     height: 60%;
// }
h1 {
    font-size: var(--el-font-size-extra-large);
}

div.preview {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: wheat;
}
</style>