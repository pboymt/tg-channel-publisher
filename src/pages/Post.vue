<script setup lang="ts">
import { ref, computed, ComputedRef, reactive, nextTick } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElImageViewer, ElInput, UploadFile, UploadInstance } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus';
import { openURL } from '@/samples/node-api';

interface PostForm {
    title: string;
    content: string;
    tags: string[];
    source: string;
    link: string;
    images: ComputedRef<string[]>;
}

const form = reactive<PostForm>({
    title: '',
    content: '',
    tags: [],
    source: '',
    link: '',
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
        console.log(file, uploadFile.name)
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
    console.log(file)
    imageList.value.push(file)
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

function openExternalLink(e: MouseEvent) {
    e.preventDefault();
    if (typeof form.link === 'string' && /^[A-z]+:\/\/.*/.test(form.link)) {
        openURL(form.link)
    }
}

async function caculateAlbumLayout(file: string, index: number) {
    let width = 0;
    let height = 0;
    const img = new Image();
    img.src = file;
    return new Promise((resolve, reject) => {
        img.addEventListener('load', () => {
            switch (form.images.length) {
                case 1:

                    break;

                default:
                    break;
            }
            return {
                backgroundImage: `url(${file})`,
            }
        }, { once: true })
    })
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
                    <li v-for="img in form.images">{{ img }}</li>
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
                            <el-col :span="5">
                                <el-input size="large" v-model="form.source" placeholder="请输入来源名称"></el-input>
                            </el-col>
                            <el-col :span="1"></el-col>
                            <el-col :span="18">
                                <el-input size="large" v-model="form.link" placeholder="请输入来源链接"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="9">
                    <h3>预览</h3>
                    <el-space fill :fill-ratio="50" direction="vertical" alignment="center" style="width: 100%;">
                        <el-card :body-style="{ padding: '0' }" style="width: 350px;" class="telegram-preview">
                            <div class="photos">
                                <span v-for="(file, index) in form.images"
                                    :style="{ backgroundImage: 'url(' + file + ')' }"></span>
                            </div>
                            <div class="captions">
                                <template v-if="form.title.length">
                                    <b>{{ form.title }}</b>
                                    <br>
                                </template>
                                <template v-if="form.content.length">
                                    <br v-if="form.title.length">
                                    {{ form.content }}
                                    <br>
                                </template>
                                <template v-if="form.tags.length">
                                    <br v-if="(form.title.length || form.content.length)">
                                    <span class="tag" v-for="tag in form.tags">
                                        #{{ tag }}
                                    </span>
                                    <br>
                                </template>
                                <template v-if="form.source.length || form.link.length">
                                    <br v-if="form.title.length || form.content.length || form.tags.length">
                                    <template v-if="form.link.length && form.source.length">
                                        来源：<a :href="form.link" @click="openExternalLink">{{ form.source }}</a>
                                    </template>
                                    <template v-if="form.link.length && !form.source.length">
                                        来源：<a :href="form.link" @click="openExternalLink">{{ form.link }}</a>
                                    </template>
                                    <template v-if="!form.link.length && form.source.length">
                                        来源：<a @click="openExternalLink">{{ form.source }}</a>
                                    </template>
                                </template>
                            </div>
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

.telegram-preview {
    div.photos {
        span {
            display: inline-block;
            min-height: 50px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        span:first-child:nth-last-child(1),
        span:first-child:nth-last-child(1)~img {
            width: 100%;
        }

        span:first-child:nth-last-child(2),
        span:first-child:nth-last-child(2)~img {
            width: 50%;
        }

        span:first-child:nth-last-child(3),
        span:first-child:nth-last-child(3)~img {
            width: 33%;
        }

        span:first-child:nth-last-child(4),
        span:first-child:nth-last-child(4)~img {
            width: 25%;
        }
    }

    div.captions {
        padding: 15px;

        p {
            margin: 0;
        }

        a {
            color: dodgerblue;
            text-decoration: none;
        }

        span.tag {
            color: dodgerblue;
            cursor: pointer;
        }
    }
}
</style>