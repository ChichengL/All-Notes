
爬虫：请求网站并提取数据的自动化程序

其工作流程
1. 想指定的url发送http请求
2. 获取响应（HTML、XML、JSON、二进制数据）
3. 处理数据（解析DOM等）
4. 将处理好的数据进行存储

### 实现爬取图片的爬虫
1. 发起http请求，获取整个网页的内容
2. 通过cheerio库，对网页内容进行分析
3. 提取img标签的src属性
4. 使用download库进行批量图片的下载

#### 1.发起http请求
http模块
request方法
request(options,callback)
或者request(url,[options],callback)

```js
const http = require('http');
//创建对象
const req = http.request('http://web.itheima.com/teacher.html',(res)=>{
    console.log(res );
})
//这里才发起请求
req.end();
```

这样得到的是一个大的对象

如果要获得页面html代码，可以使用res的各种方法
```js
const http = require('http');

const req = http.request('http://web.itheima.com/teacher.html',(res)=>{
    const chunks = []//存放数据的数组
    res.on('data',(chunk)=>{
    //监听打塔时间，获取传递过来的数据片段
        chunks.push(chunk)
        //逐渐拿取数据
    })
    res.on('end',()=>{
        console.log(Buffer.concat(chunks).toString('utf-8'))
        //将数据拼接，然后转化为字符串 进行打印
    })
})

req.end();
```

#### 2.使用cheerio库
```js
const http = require('http');
const cheerio = require('cheerio');
const HOST = 'http://web.itheima.com/'
const req = http.request( HOST +'teacher.html',(res)=>{
    const chunks = []
    res.on('data',(chunk)=>{
        chunks.push(chunk)
    })
    res.on('end',()=>{
        let imgs = []
        // console.log(Buffer.concat(chunks).toString('utf-8'))
        let html = Buffer.concat(chunks).toString('utf-8')
        const $ = cheerio.load(html)
        // console.log($('.tea_main .tea_con li img').length )
        $('.tea_main .tea_con li img').each((index,item)=>{
            // console.log(HOST + $(item).attr('src'))
            imgs.push(HOST + $(item).attr('src'))
        })
    })
})

req.end();
```
这个语法和jquery的一样


3.使用download库
```js
const http = require('http');
const cheerio = require('cheerio');
const axios = require('axios');
const download = require('download');
const fs = require('fs'); // 使用 Promises API
const HOST = 'http://web.itheima.com/';
const mkdir = require('fs').promises.mkdir
const req = http.request(HOST + 'teacher.html', async (res) => {
    const chunks = [];
    res.on('data', (chunk) => {
        chunks.push(chunk);
    });

   
    res.on('end', async () => {
        await fs.promises.mkdir('./dist/download', { recursive: true })
        let html = Buffer.concat(chunks).toString('utf-8');
        const $ = cheerio.load(html);
        // 获取图片 URL 列表
        const imgs = Array.prototype.map.call($('.tea_main .tea_con li img'), item => HOST + encodeURI($(item).attr('src')));
        Promise.all(imgs.map(x=>download(x, './dist/download'))).then(()=>{
            console.log('所有图片下载完成');
        })
    })
});

req.end();
```

download不支持未转义的字符，因此需要使用encodeURI将路径进行转义为base64编码（避免出现中文之类的）
download，语法更为简单
如果担心麻烦可以使用axios

补充axios版
```js
const http = require('http');
const cheerio = require('cheerio');
const axios = require('axios');
const download = require('download');
const fs = require('fs'); // 使用 Promises API
const HOST = 'http://web.itheima.com/';
const mkdir = require('fs').promises.mkdir
const req = http.request(HOST + 'teacher.html', async (res) => {
    const chunks = [];
    res.on('data', (chunk) => {
        chunks.push(chunk);
    });
    res.on('end', async () => {
        let html = Buffer.concat(chunks).toString('utf-8');
        const $ = cheerio.load(html);

        // 获取图片 URL 列表

        const imgs = Array.prototype.map.call($('.tea_main .tea_con li img'), item => HOST + $(item).attr('src'));
        Promise.all(imgs.map(async (imgUrl) => {
            try{
                const response = await axios({
                    url: imgUrl,
                    responseType: 'stream',
                });
                const dirPath = `dist/${decodeURIComponent(new URL(imgUrl).pathname.split('/').slice(0, -1).join('/'))}`;
                await mkdir(dirPath, { recursive: true });
                // 创建可写流并保存到 dist 文件夹
                const filePath = `dist/${decodeURIComponent(new URL(imgUrl).pathname)}`;
                const writeStream = fs.createWriteStream(filePath, () => {
                    console.log(`图片 ${imgUrl} 开始下载`);
                });
                response.data.pipe(writeStream);

                // 确保文件写入完毕
                await new Promise((resolve, reject) => {
                    writeStream.on('finish', resolve);
                    writeStream.on('error', reject);
                });

            } catch (error) {
                console.error(`图片 ${imgUrl} 下载失败: `, error);
            }
        })).then(()=>{
            console.log('所有图片下载完成');
        })
    });

});

  

req.end();
```



### Selenium
v 