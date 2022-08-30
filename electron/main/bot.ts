import { Telegraf } from 'telegraf';
import { HttpsProxyAgent } from 'https-proxy-agent';

export interface ChannelPost {
    title: string
    content: string
    tags: string[]
    source: string
    link: string
    images: string[]
}

let bot: Telegraf;

export async function startBot(token: string, proxy?: string) {
    if (proxy && proxy.length) {
        bot = new Telegraf(token, {
            telegram: {
                agent: new HttpsProxyAgent(proxy),
            },
        })
    } else {
        bot = new Telegraf(token)
    }
    console.log('[Telegraf]', bot)
}

function generateHtml(post: ChannelPost) {
    const title = post.title;
    const content = post.content;
    const tags = post.tags.map(s => `#${s}`).join(' ');
    const source = post.source;
    const link = post.link;
    let result = '';
    if (title.length) result = `<b>${title}</b>\n`;
    if (content.length) {
        if (result.length) result += '\n';
        result += `${content}\n`;
    }
    if (tags.length) {
        if (result.length) result += '\n';
        result += tags;
        result += '\n';
    }
    if (source.length || link.length) {
        if (result.length) result += '\n';
        if (source.length && link.length) {
            result += `<a href="${link}">${source}</a>`;
        } else if (source.length && !link.length) {
            result += `<a>${source}</a>`;
        } else {
            result += `<a href="${link}">${link}</a>`;
        }
    }
    return result;
}

export async function sendMessage(chatId: string | number, post: ChannelPost) {
    if (post.images.length > 0) {

    } else {
        const html = generateHtml(post);
        console.log(html);
        await bot.telegram.sendMessage(chatId, html, { parse_mode: 'HTML' })
    }
}