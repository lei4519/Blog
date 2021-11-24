"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[687],{4810:(s,n,a)=>{a.r(n),a.d(n,{default:()=>i});var e=a(6252);const p=(0,e.uE)('<h1 id="pc端-rem布局-非chrome浏览器字号小于12px的解决方案" tabindex="-1"><a class="header-anchor" href="#pc端-rem布局-非chrome浏览器字号小于12px的解决方案" aria-hidden="true">#</a> pc端 rem布局 非chrome浏览器字号小于12px的解决方案</h1><h2 id="所遇到的问题" tabindex="-1"><a class="header-anchor" href="#所遇到的问题" aria-hidden="true">#</a> 所遇到的问题</h2><p>UI这边要求pc端也进行rem布局进行适配，包括字号也需要使用rem，这就导致了在小屏幕下rem计算值小于12px，对于chrome浏览器而言小于12px则会显示为12px，而其他的浏览器则会正常显示。这种显示差异自然是通不过UI的走查要求的，并且小于12px的字体在pc端已经很难看清楚，所以需要将别的浏览器行为统一成chrome的行为。即小于12px也显示为12px字体。</p><h2 id="解决思路" tabindex="-1"><a class="header-anchor" href="#解决思路" aria-hidden="true">#</a> 解决思路</h2><h3 id="单纯使用css解决-x" tabindex="-1"><a class="header-anchor" href="#单纯使用css解决-x" aria-hidden="true">#</a> 单纯使用css解决 X</h3><p>因为rem的计算是浏览器计算的，不同宽度下的计算值也不尽相同，所以无法提前进行css适配。</p><h3 id="使用css-js解决" tabindex="-1"><a class="header-anchor" href="#使用css-js解决" aria-hidden="true">#</a> 使用css + js解决</h3><p>使用js来控制css当然是可以的，但是我们不可能对每个元素单独进行判断来改变其样式。我们希望的是js改变了字号，所有使用这个字号的元素都会发生改变，所幸的是我们有css变量技术（ie不支持），而js也刚好可以操控它。</p><p>我们可以将每一个字号都设置为变量，例如<code>--font-size-12: 0.12rem</code>代表12px的字号，当我们写css时统一写css变量 <code>font-size: var(--font-size-12)</code>，然后在页面运行时使用js来计算哪些字号小于了12px，改变这些变量的值为12px。</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code> <span class="token keyword">function</span> <span class="token function">adaptiveFS</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> rootValue <span class="token operator">=</span> <span class="token number">100</span> <span class="token comment">// 同postcss-pxtorem 的rootValue</span>\n  <span class="token keyword">var</span> rt <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement\n  <span class="token keyword">var</span> rootFS <span class="token operator">=</span> <span class="token function">parseFloat</span><span class="token punctuation">(</span><span class="token function">getComputedStyle</span><span class="token punctuation">(</span>rt<span class="token punctuation">)</span><span class="token punctuation">.</span>fontSize<span class="token punctuation">)</span>\n  <span class="token keyword">var</span> minFontsize <span class="token operator">=</span> <span class="token number">12</span>\n  <span class="token keyword">var</span> fs <span class="token operator">=</span> <span class="token number">12</span>\n  <span class="token keyword">var</span> styleText <span class="token operator">=</span> <span class="token string">&#39;&#39;</span>\n  <span class="token keyword">while</span> <span class="token punctuation">(</span>fs <span class="token operator">/</span> rootValue <span class="token operator">*</span> rootFS <span class="token operator">&lt;</span> minFontsize<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    styleText <span class="token operator">+=</span> <span class="token string">&#39;--font-size-&#39;</span> <span class="token operator">+</span> fs <span class="token operator">+</span> <span class="token string">&#39;:12px;&#39;</span>\n    fs<span class="token operator">++</span>\n  <span class="token punctuation">}</span>\n  rt<span class="token punctuation">.</span>style <span class="token operator">=</span> styleText\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="使用css-js-webpack解决" tabindex="-1"><a class="header-anchor" href="#使用css-js-webpack解决" aria-hidden="true">#</a> 使用css + js + webpack解决</h3><p>虽然上述方案可行，但是作为开发人员，我们不希望每次写字号的时候都去写变量，而且我们也不需要将所有的字号都设置为变量。</p><p>对于pc端的rem布局，一般来说我们是不会让屏幕无限进行缩小和放大的，所以我们会设置屏幕最大宽度和最小宽度，有了最小宽度也就有了最小的html font-size。我们只需要将 <code>font-size / rootValue * minHTMLFontSize &lt; 12</code> 的字号设置为变量就可以了。</p><p>可是这样就更加大了开发的心智负担，我们不仅要写css变量，还要记忆哪些字号写css变量，哪些字号写正常的<code>px</code>。</p><p>还好我们有各种构建工具可以帮助我们避免这种情况，我们可以使用postcss-loader来自动替换字号为css变量，使用nodejs自动生成css变量文件，使用webpack plugin自动注入在html中注入js。</p>',15),t=(0,e.Uk)("这些已经都被我写好了，大家直接拿去用就可以了，详见 "),o={href:"https://github.com/lei4519/adaptiveFontsize",target:"_blank",rel:"noopener noreferrer"},c=(0,e.Uk)("adaptive-fontsize"),r=(0,e.Uk)("，好用的话记得star～～"),l={},i=(0,a(3744).Z)(l,[["render",function(s,n){const a=(0,e.up)("OutboundLink");return(0,e.wg)(),(0,e.iD)(e.HY,null,[p,(0,e._)("p",null,[t,(0,e._)("a",o,[c,(0,e.Wm)(a)]),r])],64)}]])},3744:(s,n)=>{n.Z=(s,n)=>{const a=s.__vccOpts||s;for(const[s,e]of n)a[s]=e;return a}},1259:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-42479092",path:"/technology/Web/adaptive-fontsize.html",title:"pc端 rem布局 非chrome浏览器字号小于12px的解决方案",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"所遇到的问题",slug:"所遇到的问题",children:[]},{level:2,title:"解决思路",slug:"解决思路",children:[{level:3,title:"单纯使用css解决 X",slug:"单纯使用css解决-x",children:[]},{level:3,title:"使用css + js解决",slug:"使用css-js解决",children:[]},{level:3,title:"使用css + js + webpack解决",slug:"使用css-js-webpack解决",children:[]}]}],filePathRelative:"technology/Web/adaptive-fontsize.md",git:{updatedTime:1592231182e3}}}}]);